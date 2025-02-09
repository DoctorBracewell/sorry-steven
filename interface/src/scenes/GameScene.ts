import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { Button } from "../utils/Button";
import { Colours, GameState } from "../game/gameState";
import { Manager } from "../game/manager";
import { SceneEffects } from "../SceneEffects";
import { soundManager } from "../sound/SoundManager";
import { scaler } from "../main";

export class GameScene implements Scene {
    private p: p5;
    private SM: SceneManager;

    private manager: Manager;

    private colour_buttons: Button[] = [];
    private vibration_button: Button | null = null;
    private image: p5.Image;

    private sound_input: number[];
    private sound_buttons: Button[] = [];

    constructor(p: p5, sceneManager: SceneManager) {
        this.p = p;
        this.SM = sceneManager;
        this.manager = new Manager(p);
        this.sound_input = Array(GameState.soundCounts).fill(-1);
        this.image = this.p.loadImage("/interface/brain_gap.png");
    }

    setup(): void {
        // create buttons
        let index = 0;
        for (const c in Colours) {
            this.colour_buttons.push(
                new Button(
                    this.p,
                    scaler.getSize().physical.width * 0.1 +
                        index * scaler.getSize().physical.width * 0.12,
                    scaler.getSize().physical.height * 0.4,
                    scaler.getSize().physical.width * 0.1,
                    scaler.getSize().physical.width * 0.1,
                    10,
                    Colours[c as keyof typeof Colours],
                    true
                )
            );
            index++;
        }

        this.vibration_button = new Button(
            this.p,
            scaler.getSize().physical.width / 2,
            300,
            100,
            100,
            0,
            Colours.Pink,
            false,
            false,
            null,
            "/interface/button.png"
        );

        this.make_sound_buttons();
    }

    draw(): void {
        this.p.background(255);

        this.p.push();
        SceneEffects.applyColour(this.p);
        SceneEffects.applyShake(this.p);

        this.p.imageMode(this.p.CENTER);
        this.p.image(
            this.image,
            scaler.getSize().physical.width / 2,
            scaler.getSize().physical.height / 2,
            this.image.width * (this.p.height / scaler.getSize().logical.height),
            scaler.getSize().physical.height
        );

        // draw buttons at base size
        this.colour_buttons.forEach((btn) => btn.draw(false));
        this.sound_buttons.forEach((btn) => btn.draw(false));
        this.vibration_button!.draw(false);

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

        this.display_time(
            0.07 * scaler.getSize().physical.width,
            0.05 * scaler.getSize().physical.height,
            0.05 * scaler.getSize().physical.width,
            0.9 * scaler.getSize().physical.height
        );
    }

    make_sound_buttons() {
        for (let i = 0; i < GameState.soundCounts; i++) {
            for (let j = 0; j < GameState.soundTypeCount; j++) {
                this.sound_buttons.push(
                    new Button(
                        this.p,
                        scaler.getSize().physical.width * 0.4 +
                            i * scaler.getSize().physical.width * 0.06,
                        scaler.getSize().physical.height * 0.2 +
                            scaler.getSize().physical.height * 0.06 * j,
                        scaler.getSize().physical.width * 0.03,
                        scaler.getSize().physical.width * 0.03,
                        0,
                        Colours.Red,
                        true,
                        false,
                        [i, j]
                    )
                );
            }
        }
    }

    show_result(success: boolean | null) {
        if (success == null) return;
        if (!success) {
            SceneEffects.setShake(30);
            soundManager.playSample("/feedback/nope.mp3");
        } else {
            soundManager.playSample("/feedback/yep.mp3");
        }
    }

    display_time(x: number, y: number, w: number, h: number) {
        const progressHeight = this.p.map(GameState.timeLeft, 0, 100, 0, h);
      
        this.p.fill(100);
        this.p.rect(x - w / 2, y, w, h, 5);
      
        const bottomColor = this.p.color(0, 0, 0); // Red
        const topColor = this.p.color(0, 255, 0);    // Green

        for (let i = 0; i < progressHeight; i++) {
            const lerpedColor = this.p.lerpColor(bottomColor, topColor, i / h)
            this.p.stroke(lerpedColor);
            this.p.line(x - w / 2, y + h - i, x + w / 2, y + h - i);
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
                        this.sound_input.fill(-1);
                        setTimeout(
                            () => this.sound_buttons.forEach((btn) => btn.setColour(Colours.Red)),
                            200
                        );
                    }
                }
            }
        });
    }

    keyPressed(): void {}
}
