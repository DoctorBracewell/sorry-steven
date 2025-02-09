import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { Button } from "../utils/Button";
import { Colours, GameState, THEENUM } from "../game/gameState";
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

    private vibe_img: p5.Image | null = null;
    private vibe_img_pressed: p5.Image | null = null;
    private colour_button_images: { [key: string]: p5.Image | null } = {};

    constructor(p: p5, sceneManager: SceneManager) {
        this.p = p;
        this.SM = sceneManager;
        this.manager = new Manager(p);
        this.sound_input = Array(GameState.soundCounts).fill(-1);
        this.image = this.p.loadImage("/interface/brain_gap.png");
    }

    setup(): void {
        soundManager.manageMusic();
        soundManager.playSample("/voice/is_it_a_colour/mov");

        // create buttons
        let index = 0;
        for (const c in Colours) {
            console.log(`${Colours[c as keyof typeof Colours]}_high`);
            this.colour_buttons.push(
                new Button(
                    this.p,
                    scaler.getSize().physical.width * 0.35 + index * scaler.getSize().physical.width * 0.08,
                    scaler.getSize().physical.height * 0.25,
                    scaler.getSize().physical.width * 0.06,
                    scaler.getSize().physical.width * 0.06,
                    0,
                    Colours[c as keyof typeof Colours],
                    false,
                    false,
                    null,
                    this.colour_button_images[`${Colours[c as keyof typeof Colours]}_high`],
                    this.colour_button_images[`${Colours[c as keyof typeof Colours]}_pressed`],
                )
            );
            index++;
        }

        this.vibration_button = new Button(
            this.p,
            scaler.getSize().physical.width / 2,
            scaler.getSize().physical.height * 0.1,
            scaler.getSize().physical.width * 0.1,
            scaler.getSize().physical.width * 0.1,
            0,
            Colours.Pink,
            false,
            false,
            null,
            this.vibe_img,
            this.vibe_img_pressed
        );

        this.make_sound_buttons();
    }

    preload(): void {
        this.vibe_img = this.p.loadImage("/interface/button.png");
        this.vibe_img_pressed = this.p.loadImage("/interface/button_depressed.png");

        for (const colour of Object.values(Colours)) {
            for (const press_state of ["high", "pressed"]) {
                this.colour_button_images[`${colour}_${press_state}`] = this.p.loadImage(`/interface/${colour}_${press_state}.png`);
            }
        }


    }

    draw(): void {
        this.p.background(255);

        this.p.push();
        SceneEffects.applyColour();
        SceneEffects.applyShake();

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
            this.sound_buttons.some((b) => b.hovered) ||
            this.vibration_button!.hovered
        ) {
            this.p.cursor("pointer");
        } else {
            this.p.cursor("default");
        }

        this.manager.update();
        this.show_result(this.manager.send_input("we got any time left??"));
        if (GameState.timeLeft < 0) {
            this.SM.setScene("end");
        }

        this.p.pop();

        this.display_time(
            0.07 * scaler.getSize().physical.width,
            0.05 * scaler.getSize().physical.height,
            0.05 * scaler.getSize().physical.width,
            0.9 * scaler.getSize().physical.height
        );

        this.display_task_time(
            0.75 * scaler.getSize().physical.width,
            0.05 * scaler.getSize().physical.height,
            0.2 * scaler.getSize().physical.width,
            0.05 * scaler.getSize().physical.width,
            GameState.taskType,
            GameState.totalTaskTime,
            GameState.timeLeftOnTask
        );
    }

    make_sound_buttons() {
        for (let i = 0; i < GameState.soundCounts; i++) {
            for (let j = 0; j < GameState.soundTypeCount; j++) {
                this.sound_buttons.push(
                    new Button(
                        this.p,
                        scaler.getSize().physical.width * 0.385 +
                            i * scaler.getSize().physical.width * 0.06,
                        scaler.getSize().physical.height * 0.46 -
                            scaler.getSize().physical.height * 0.08 * j,
                        scaler.getSize().physical.width * 0.05,
                        scaler.getSize().physical.width * 0.04,
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
            soundManager.playSample("/feedback/cut_nope.mp4");
        } else {
            soundManager.playSample("/feedback/cut_yep.mp4");
        }
    }

    display_time(x: number, y: number, w: number, h: number) {
        const progressHeight = this.p.map(GameState.timeLeft, 0, 100, 0, h);

        this.p.fill(100);
        this.p.rect(x - w / 2, y, w, h);

        const bottomColor = this.p.color(0, 0, 0); // Black
        const topColor = this.p.color(0, 255, 0); // Green

        for (let i = 0; i < progressHeight; i++) {
            const lerpedColor = this.p.lerpColor(bottomColor, topColor, i / h);
            this.p.stroke(lerpedColor);
            this.p.line(x - w / 2, y + h - i, x + w / 2, y + h - i);
        }

        // black border
        this.p.fill(0, 0);
        this.p.stroke(0);
        this.p.strokeWeight(4);
        this.p.rect(x - w / 2, y, w, h);
    }

    task_to_sense(task: THEENUM | null) {
        switch (task) {
            case THEENUM.Sound:
                return "Listen";
            case THEENUM.Colours:
                return "See";
            case THEENUM.Vibrations:
                return "Feel";
            default:
                return "???";
        }
    }

    display_task_time(
        x: number,
        y: number,
        w: number,
        h: number,
        task: THEENUM | null,
        totalTime: number,
        remainingTime: number
    ) {
        if (task == null) {
            return;
        }

        let sense: string = this.task_to_sense(task);

        this.p.fill(100);
        this.p.noStroke();
        this.p.rect(x, y, w, h);

        let fontSize: number = 100;
        this.p.textSize(fontSize);

        // adjust font size
        while (
            this.p.textWidth(sense) > w - 10 ||
            this.p.textAscent() + this.p.textDescent() > h - 10
        ) {
            fontSize--;
            this.p.textSize(fontSize);
        }

        for (let i = 0; i < w * (remainingTime / totalTime); i++) {
            this.p.strokeWeight(1);
            this.p.stroke(54, 150, 191);
            this.p.line(x + i, y, x + i, y + h);
        }

        // write the sense of the current task
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.fill(255);
        this.p.noStroke();
        this.p.text(sense, x + w / 2, y + h / 2);

        // black border
        this.p.fill(0, 0);
        this.p.stroke(0);
        this.p.strokeWeight(4);
        this.p.rect(x, y, w, h);
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

        if (this.vibration_button!.mouseOverButton()) {
            this.vibration_button!.draw(true);
            this.show_result(this.manager.send_input(" "));
        }
    }

    keyPressed(): void {}
}
