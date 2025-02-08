import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { SceneEffects } from "../SceneEffects";
import { Button } from "../utils/Button";
import { Colours } from "../game/gameState";

export class GameScene implements Scene {
    private p: p5;
    private SM: SceneManager;

    //private colourOrder: Coulors[] = [];
    private buttons: Button[] = [];

    constructor(p: p5, sceneManager: SceneManager) {
        this.p = p;
        this.SM = sceneManager;
    }

    setup(): void {
        // create buttons
        let index = 0;
        for (const c in Colours) {
            this.buttons.push(
                new Button(
                  this.p, 200 + index * 100, 100, 80, 80, 10, Colours[c as keyof typeof Colours], true
                )
            );
            console.log("button: " + c);
            index++;
        }
    }

    draw(): void {
        this.p.background("GRAY");
        this.p.push();

        // draw buttons at base size
        this.buttons.forEach((btn) => btn.draw(false));

        if (this.buttons.some((b) => b.hovered)) {
            this.p.cursor("pointer");
        } else {
            this.p.cursor("default");
        }
    }

    mousePressed(): void {
        // draw buttons at scaled size if pressed
        //
        this.buttons.forEach((btn) => {
            if (btn.mouseOverButton()) {
                btn.draw(true);
                console.log(btn.getColour());
                // TODO : send colour to game manager
            }
        });
    }

    keyPressed(): void {}
}
