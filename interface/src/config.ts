import type { Scene } from "./engine/Scene";
import { BACKGROUND_COLOUR } from "./constants";

import MainMenuScene from "./scenes/MainMenuScene";

const view = document.querySelector("#canvas") as HTMLCanvasElement;

export interface IConfig {
	scenes: { [key: string]: typeof Scene };
	application: {
		view: HTMLCanvasElement;
		resizeTo: HTMLElement;
		autoDensity: boolean;
		resolution: number;
		backgroundColor: number;
	};
}

export const Config: IConfig = {
	scenes: {
		mainMenu: MainMenuScene,
	},
	application: {
		view,
		resizeTo: document.querySelector("#view") as HTMLDivElement,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		backgroundColor: BACKGROUND_COLOUR,
	},
};
