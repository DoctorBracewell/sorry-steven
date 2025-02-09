import p5 from "p5";
import { Colours } from "./game/gameState";
import { scaler } from "./main";

const ColourRGBs: Record<Colours, [number, number, number]> = {
    [Colours.Red]: [255, 0, 0],
    [Colours.Yellow]: [255, 255, 0],
    [Colours.Pink]: [255, 105, 180],
    [Colours.Green]: [0, 255, 0],
};

export class SceneEffects {
    private static shakeAmount = 0;

    public static p:p5;
    public static colour_intensity = 0;
    public static colourSequence: Colours[] = [];
    public static bpm: number = 90;
    private static startTime: number = 0;

    static resetIntensity() {
        this.startTime = this.p.millis();
        this.colour_intensity = 100;
    }

    static setShake(amount: number): void {
        this.shakeAmount = amount;
    }

    static applyShake(): void {
        if (this.shakeAmount > 0) {
            const shakeX = this.p.random(-this.shakeAmount, this.shakeAmount);
            const shakeY = this.p.random(-this.shakeAmount, this.shakeAmount);
            this.p.translate(shakeX, shakeY);

            // Reduce shake over time
            this.shakeAmount *= 0.6; // Lower factor = slower (faster?) decay
            if (this.shakeAmount < 10) {
                this.shakeAmount = 0;
            }
        }
    }

    static applyColour(): void {
        if (this.colourSequence.length == 0) {
            return;
        }

        const duration = (60 / this.bpm) * 1000;

        let c = this.colourSequence[0];

        if (this.colour_intensity <= 5) {
            this.colourSequence.shift();
            this.resetIntensity()
            return;
        }

        for (let y = 0; y < scaler.getSize().physical.height; y++) {
            let alpha = this.p.map(
                y, 0, scaler.getSize().physical.height, (this.colour_intensity / 100) * 100, (this.colour_intensity / 100) * 250
            );

            let [r, g, b] = ColourRGBs[c];

            this.p.stroke(r, g, b, alpha);
            this.p.strokeWeight(2);
            this.p.line(0, y, scaler.getSize().physical.width, y);
        }

        this.colour_intensity = 100 * (1 - ((this.p.millis() - this.startTime) / duration))

    }
}
