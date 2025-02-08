import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";

export class CutScene implements Scene {
    private p: p5;
    private SM: SceneManager;
    private images: p5.Image[] = [];
    private currentImageIndex: number = 0;
    private changeInterval: number = 5000;
    private lastChangeTime: number = 0;

    constructor(p: p5, sceneManager: SceneManager) {
        this.p = p;
        this.SM = sceneManager;
    }

    preload(): void {
        console.log("BARRY");
        const imagePaths = [
            "/cutscenes/crim.jpg",
            "/cutscenes/girraffe.jpg",
            "/cutscenes/jam.jpg",
            "/cutscenes/waste.jpg"
        ];
      
        this.images = imagePaths.map((path) => this.p.loadImage(path));
    }

    setup(): void {
        this.lastChangeTime = this.p.millis();
    }

    draw(): void {
        this.p.background(0);

        if (this.images.length > 0) {
            this.p.imageMode(this.p.CENTER);
            const currentImage = this.images[this.currentImageIndex];
            this.p.image(currentImage, this.p.width / 2, this.p.height / 2);

            if (this.p.millis() - this.lastChangeTime > this.changeInterval) {
                this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
                this.lastChangeTime = this.p.millis();
            }
        } else {
            this.p.fill(255);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(32);
            this.p.text("No images found in the cutscene folder.", this.p.width / 2, this.p.height / 2);
        }
    }

    keyPressed(): void {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        console.log(`Switched to image ${this.currentImageIndex + 1}/${this.images.length}`);
    }
}
