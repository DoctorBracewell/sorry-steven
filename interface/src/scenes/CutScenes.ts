import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";

export class CutScene implements Scene {
    private p: p5;
    private SM: SceneManager;
    private image: p5.Image | null = null;
    private image_path: string;
    private changeInterval: number = 5000;
    private lastChangeTime: number = 0;
    private next: string = "";

    constructor(p: p5, sceneManager: SceneManager, image: string, next: string) {
        this.p = p;
        this.SM = sceneManager;
        this.image_path = image;
        this.next = next;
    }

    preload(): void {
        this.image = this.p.loadImage(this.image_path);
    }

    setup(): void {
        this.lastChangeTime = this.p.millis();
    }

    draw(): void {
        this.p.background(0);

        if (this.image) {

            this.p.imageMode(this.p.CENTER);
            this.p.image(this.image, this.p.width / 2, this.p.height / 2);

            if (this.p.millis() - this.lastChangeTime > this.changeInterval) {
                this.SM.setScene(this.next);
            }
        }

    }
}
