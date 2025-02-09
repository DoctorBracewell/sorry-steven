import p5 from "p5";
import { Scene } from "../SceneManager";
import { scaler } from "../main";
import { GameState } from "../game/gameState";

export class ScoreScene implements Scene {
    private p: p5;

    constructor(p: p5) {
        this.p = p;
    }

    setup(): void {
        setTimeout(() => {
            this.p.remove();
            (document.querySelector("#menu")! as HTMLDivElement).style.display = "block";
        }, 8000);
    }

    draw(): void {
        this.p.background(0);

        const score = Math.floor((GameState.bpm - 90) * 1000);
        const { width, height } = scaler.getSize().physical;

        this.p.fill(255);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(64);
        this.p.text(`Your Score: ${score}`, width / 2, height / 2);
    }
}
