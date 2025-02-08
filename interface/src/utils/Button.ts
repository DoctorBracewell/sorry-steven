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

    constructor(p: p5, x: number, y: number, size: number, colour: Colours) {
        this.p = p;
        this.x = x;
        this.y = y;

        this.baseSize = size;
        this.scaledSize = this.baseSize * 1.2;

        this.scaledX = this.x - ((this.scaledSize - this.baseSize) / 2);
        this.scaledY = this.y - ((this.scaledSize - this.baseSize) / 2);

        this.colour = colour;
    }

    draw(pressed: boolean) {
        //this.p.fill((this.mouseOverButton() && !(pressed)) ? this.darkenColour() : this.colour);
        this.p.fill(this.colour);
        if ((this.mouseOverButton() && !(pressed))) {
            this.p.rect(this.scaledX, this.scaledY, this.scaledSize, this.scaledSize); 
        } else {
            this.p.rect(this.x, this.y, this.baseSize, this.baseSize);
        }

    }

    public mouseOverButton(): boolean {
        return this.p.mouseX > this.x && this.p.mouseX < this.x + this.baseSize && this.p.mouseY > this.y && this.p.mouseY < this.y + this.baseSize;
    }

    // darkenColour(): string {
        
    // }

    public getColour() {
        return this.colour;
    }

}