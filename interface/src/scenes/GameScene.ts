import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { Button } from "../utils/Button";
import { Colours, GameState } from "../game/gameState";
import { Manager } from "../game/manager";
import { SceneEffects } from "../SceneEffects";

export class GameScene implements Scene {
    private p: p5;
    private SM: SceneManager;

    private manager: Manager;

    private colour_buttons: Button[] = [];

    private sound_input: number[];
    private sound_buttons: Button[] = [];

    constructor(p: p5, sceneManager: SceneManager) {
        this.p = p;
        this.SM = sceneManager;
        this.manager = new Manager(p);
        this.sound_input = Array(GameState.soundCounts).fill(-1);
    }

    setup(): void {
        // create buttons
        let index = 0;
        for (const c in Colours) {
            this.colour_buttons.push(
                new Button(
                    this.p, 200 + index * 100, 100, 80, 80, 10,
                    Colours[c as keyof typeof Colours],
                    true
                )
            );
            index++;
        }

        this.make_sound_buttons();
    }

    draw(): void {
        this.p.background(255);

        this.p.push();
        SceneEffects.applyColour(this.p);
        SceneEffects.applyShake(this.p);


        // draw buttons at base size
        this.colour_buttons.forEach((btn) => btn.draw(false));
        this.sound_buttons.forEach((btn) => btn.draw(false));

        if (
            this.colour_buttons.some((b) => b.hovered) ||
            this.sound_buttons.some((b) => b.hovered)
        ) {
            this.p.cursor("pointer");
        } else {
            this.p.cursor("default");
        }

        this.manager.update();

        this.p.pop();
    }

    make_sound_buttons() {
        for (let i = 0; i < GameState.soundCounts; i++) {
            for (let j = 0; j < GameState.soundTypeCount; j++) {
                this.sound_buttons.push(
                    new Button(
                        this.p, 100 + i * 50, 400 + 40 * j, 30, 30, 0, Colours.Red, true, false, [i, j]
                    )
                );
            }
        }
    }

    show_result(success: boolean | null) {
        if (success == null) return;
        if (!success) {
            SceneEffects.setShake(30);
        }
    }

    mousePressed(): void {

        // draw buttons at scaled size if pressed
        this.colour_buttons.forEach((btn) => {
            if (btn.mouseOverButton()) {
                btn.draw(true);
                this.show_result(this.manager.send_input(btn.getColour()));
            }
        });

        this.sound_buttons.forEach((btn) => {
            if (btn.mouseOverButton()) {
                const [i, j] = btn.data;
                if (this.sound_input[i] == -1) {
                    this.sound_input[i] = j;
                    btn.setColour(Colours.Green);
                    if (!this.sound_input.some((num) => num == -1)) {
                        this.show_result(this.manager.send_input(this.sound_input));
                        this.sound_input = this.sound_input.fill(-1)
                    }
                }
            }
        });
    }

    keyPressed(): void {}
}
