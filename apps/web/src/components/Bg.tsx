import { component$ } from "@builder.io/qwik";
import _ from "lodash";

export default component$(()=>{
	return <div class="absolute bottom-0 left-0 right-0 w-full h-max z--1 of-hidden">
		<img src="https://web-assets.c5y.moe/B50/bg.png" class="block h-max w-full" />
		<img src="https://web-assets.c5y.moe/B50/fish.png" class="absolute bottom-0 left-0 right-0 w-full h-max" style={{
			transform: `translateY(${_.random(-75, 50)}px) translateX(${_.random(-150, 50)}px) rotate(${_.random(-5, 5)}deg)`,
		}} />
		<img src="https://web-assets.c5y.moe/B50/overlay.png" class="absolute bottom-0 left-0 right-0 w-full h-max" />
	</div>
})
