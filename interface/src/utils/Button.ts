import p5 from "p5";
import { Colours} from "../gameState"


export class Button {
    private p: p5;
    
    private x: number;
    private y: number;

    private scaledX: number;
    private scaledY: number;

    private baseSize: number;
    private scaledSize: number;

    private colour: Colours;

    private pressTime;
    private pressInProgress;

    constructor(p: p5, x: number, y: number, size: number, colour: Colours) {
        this.p = p;
        this.x = x;
        this.y = y;

        this.baseSize = size;
        this.scaledSize = this.baseSize * 1.2;

        this.scaledX = this.x - ((this.scaledSize - this.baseSize) / 2);
        this.scaledY = this.y - ((this.scaledSize - this.baseSize) / 2);

        this.colour = colour;

        this.pressTime = 0;
        this.pressInProgress = false;
    }

    draw(pressed: boolean) {

        if (pressed) {
            this.pressInProgress = true;
            this.pressTime = this.p.millis()
        }

        this.p.stroke("BLACK");

        if (this.pressInProgress) {
            if (this.p.millis() - this.pressTime < 300) {
                this.p.stroke("WHITE");
            } else {
            this.pressInProgress = false;
            }
        }
        else {
            this.p.stroke("BLACK");
        }

        this.p.strokeWeight(3);
        this.p.fill(this.colour);

        if ((this.mouseOverButton() && !(pressed))) {
            this.p.rect(this.scaledX, this.scaledY, this.scaledSize, this.scaledSize, 10); 
        } else {
            this.p.rect(this.x, this.y, this.baseSize, this.baseSize, 10);
        }
    }

    public mouseOverButton(): boolean {
        // TODO : make it recognise mouse over scaled button
        return this.p.mouseX > this.x && this.p.mouseX < this.x + this.baseSize && this.p.mouseY > this.y && this.p.mouseY < this.y + this.baseSize;
    }

    public getColour() {
        return this.colour;
    }

}