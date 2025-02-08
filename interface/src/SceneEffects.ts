import p5 from "p5";
import { Colours } from "./game/gameState";
import { CANVAS_WIDTH, CANVAS_HEIGHT, FPS } from "./constants";
import { scaler } from "./main";

const ColourRGBs: Record<Colours, [number, number, number]> = {
    [Colours.Red]: [255, 0, 0],
    [Colours.Yellow]: [255, 255, 0],
    [Colours.Pink]: [255, 105, 180],
    [Colours.Green]: [0, 255, 0],
};

export class SceneEffects {
    private static shakeAmount = 0;

    public static colour_intensity = 100;
    public static colourSequence: Colours[] = [];
    public static bpm: number = 90;

    static pulse(p: p5, intensity: number, speed: number, baseSize: number): number {
        const pulse = baseSize + Math.sin(p.frameCount * speed) * intensity;
        return pulse > 0 ? pulse : 0;
    }

    static setShake(amount: number): void {
        this.shakeAmount = amount;
    }

    static applyShake(p: p5): void {
        if (this.shakeAmount > 0) {
            const shakeX = p.random(-this.shakeAmount, this.shakeAmount);
            const shakeY = p.random(-this.shakeAmount, this.shakeAmount);
            p.translate(shakeX, shakeY);

            // Reduce shake over time
            this.shakeAmount *= 0.6; // Lower factor = slower (faster?) decay
            if (this.shakeAmount < 10) {
                this.shakeAmount = 0;
            }
        }
    }

    static applyColour(p: p5): void {
        if (this.colourSequence.length == 0) {
            return;
        }

        const duration = 60 / this.bpm;
        const lowerLimit = 0.1;
        const m = Math.pow(lowerLimit, 1 / (duration * FPS));

        let c = this.colourSequence[0];

        if (this.colour_intensity <= lowerLimit * 100) {
            this.colourSequence.shift();
            this.colour_intensity = 100;
            return;
        }

        for (let y = 0; y < scaler.getSize().physical.height; y++) {
            let alpha = p.map(
                y, 0, scaler.getSize().physical.height, (this.colour_intensity / 100) * 50, (this.colour_intensity / 100) * 200
            );
            let [r, g, b] = ColourRGBs[c];

            p.stroke(r, g, b, alpha);
            p.strokeWeight(2);
            p.line(0, y, scaler.getSize().physical.width, y);
        }

        this.colour_intensity *= m;
    }
}
