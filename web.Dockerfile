FROM node:22-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.json /app/
COPY patches /app/patches
COPY apps/web/package.json /app/apps/web/
COPY packages/clients/package.json /app/packages/clients/
COPY packages/data/package.json /app/packages/data/
COPY packages/types/package.json /app/packages/types/
COPY packages/utils/package.json /app/packages/utils/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store,sharing=locked \
    --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm i -g pnpm@9.15.2 && \
    pnpm install --frozen-lockfile

COPY packages /app/packages

COPY apps/web /app/apps/web

RUN cd /app/apps/web && pnpm run build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store,sharing=locked \
    --mount=type=secret,id=npmrc,target=/root/.npmrc \
    pnpm deploy --filter=@clansty/maibot-web --prod deploy

FROM node:22-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=build /app/deploy /app
COPY --from=build /app/apps/web/dist /app/dist
COPY --from=build /app/apps/web/server /app/server

# Allow for dynamic port, defaults to 3000
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the port that the application listens on
EXPOSE 3000

# Run the Qwik application with Fastify
CMD ["node", "server/entry.fastify"]

