import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { scaler } from "../main";
import { soundManager } from "../sound/SoundManager";

export class CutScene implements Scene {
    private p: p5;
    private SM: SceneManager;
    private image: p5.Image | null = null;
    private image_path: string;
    private changeInterval: number = 5000;
    private lastChangeTime: number = 0;
    private next: string = "";
    private sound: string;

    constructor(p: p5, sceneManager: SceneManager, image: string, next: string, sound: string) {
        this.p = p;
        this.SM = sceneManager;
        this.image_path = image;
        this.next = next;
        this.sound = sound;
    }

    preload(): void {
        this.image = this.p.loadImage(this.image_path);
    }

    setup(): void {
        this.lastChangeTime = this.p.millis();

        setTimeout(() => {
            soundManager.playSample(this.sound);
        }, 1000);
    }

    draw(): void {
        this.p.background(0);

        if (this.image) {
            this.p.imageMode(this.p.CENTER);

            this.p.image(
                this.image,
                scaler.getSize().physical.width / 2,
                scaler.getSize().physical.height / 2,
                this.image.width * (this.p.height / scaler.getSize().logical.height),
                scaler.getSize().physical.height
            );

            if (this.p.millis() - this.lastChangeTime > this.changeInterval) {
                this.SM.setScene(this.next);
            }
        }
    }
}
