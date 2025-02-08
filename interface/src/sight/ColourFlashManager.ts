import p5 from "p5";
import { Colours } from "../game/gameState";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../constants";

const ColourRGBs: Record<Colours, [number, number, number]> = {
    [Colours.Red]: [255, 0, 0,],
    [Colours.Yellow]: [255, 255, 0],
    [Colours.Pink]: [255, 105, 180],
    [Colours.Green]: [0, 255, 0],

};

export class ColourFlashManager {
    private p:p5;

    constructor(p: p5) {
        console.log("constructor");
        this.p = p;
    }

    public setGradients(colourSequence: Colours[], bpm: number) {
        console.log("colourSequence");
        const duration = (60 / bpm) * 1000;

        let index = 0;

        const flashNextColour = () => {
            for (let y = 0; y < CANVAS_HEIGHT; y++) {
                let alpha = this.p.map(y, 0, CANVAS_HEIGHT, 50, 200);
                console.log(colourSequence[index]);
                let [r, g, b] = ColourRGBs[colourSequence[index]];

                this.p.stroke(r, g, b, alpha);
                this.p.strokeWeight(2);
                this.p.line(0, y, CANVAS_WIDTH, y);
            }

            setTimeout(() => {
                index++;
                if (index < colourSequence.length) {
                    flashNextColour();
                }
            }, duration);
        }

        flashNextColour();
        
    }

    public test() {
        console.log("test");
        this.p.stroke(255, 0, 0); // Force red for visibility
        this.p.strokeWeight(100)
        this.p.line(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT); // Draw a simple diagonal line
        this.p.circle(0, 0, 100)
    }
}