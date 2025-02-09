import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager"
import { scaler } from "../main";

export class EndScene implements Scene {
    private p: p5;
    private image: p5.Image;

    constructor(p: p5) {
        this.p = p;
        this.image = this.p.loadImage('/interface/END 1.png');
    }

    setup(): void {
        setTimeout(() => this.p.remove(), 3000);
    }

    draw(): void {

        this.p.imageMode(this.p.CENTER);
        
        this.p.image(
            this.image,
            scaler.getSize().physical.width / 2,
            scaler.getSize().physical.height / 2,
            this.image.width * (this.p.height / scaler.getSize().logical.height),
            scaler.getSize().physical.height
        );

    }

}
