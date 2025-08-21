import { Env } from '../types';
import puppeteer, { Browser } from '@cloudflare/puppeteer';
import { DurableObjectState } from '@cloudflare/workers-types';

export class Renderer implements DurableObject {
	browser: Browser;

	constructor(private readonly state: DurableObjectState, private readonly env: Env) {
	}

	async fetch(request: Request) {
		try {
			const { url, width } = await request.json() as { url: string, width: number };
			const result = await this.renderHtml(url, width);

			return new Response(result.data, {
				headers: {
					'Content-Type': 'image/png',
					height: result.height.toString()
				}
			});
		} catch (e) {
			return new Response(e.message, { status: 500 });
		}
	}

	async getPage() {
		//if there's a browser session open, re-use it
		if (!this.browser || !this.browser.isConnected()) {
			console.log(`Browser DO: Starting new instance`);
			try {
				this.browser = await puppeteer.launch(this.env.MYBROWSER);
			} catch (e) {
				console.log(`Browser DO: Could not start browser instance. Error: ${e}`);
				throw e;
			}
		}

		return await this.browser.newPage();
	}

	async renderHtml(url: string, width: number) {
		console.log('开始渲染图片');
		const page = await this.getPage();
		await page.setViewport({ width, height: 300 });
		console.log(new Date(), '页面已创建');
		await page.goto(url, { waitUntil: 'networkidle2' });
		console.log(new Date(), '页面已加载');
		const data = await page.screenshot({ encoding: 'binary', fullPage: true, type: 'jpeg' }) as Buffer;
		const height = await page.evaluate('document.body.scrollHeight') as number;
		console.log(new Date(), '图片已生成');

		this.state.waitUntil(page.close()); // async
		return { data, width, height };
	}
}
