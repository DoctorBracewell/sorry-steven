import p5 from "p5";
import { Colours } from "../game/gameState"


export class Button {
    private p: p5;
    
    private x: number;
    private y: number;
    private w: number;
    private h: number;

    private scaledX: number;
    private scaledY: number;
    private scaledW: number;
    private scaledH: number;

    private r: number; // corner radius
    private colour: Colours;
    private hasBorder: boolean;

    private pressTime;
    private pressInProgress;

    constructor(p: p5, x: number, y: number, w: number, h: number, r: number, colour: Colours, hasBorder: boolean) {
        this.p = p;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.scaledW = this.w * 1.2;
        this.scaledH = this.h * 1.2;

        this.scaledX = this.x - ((this.scaledW - this.w) / 2);
        this.scaledY = this.y - ((this.scaledH - this.h) / 2);

        this.r = r;
        this.colour = colour;
        this.hasBorder = hasBorder

        this.pressTime = 0;
        this.pressInProgress = false;
    }

    applyBorderLogic(pressed: boolean) {
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
    }

    draw(pressed: boolean) {

        if (this.hasBorder) {
            this.applyBorderLogic(pressed);
        }        

        if ((this.mouseOverButton() && !(pressed))) {
            this.p.rect(this.scaledX, this.scaledY, this.scaledW, this.scaledH, this.r); 
        } else {
            this.p.rect(this.x, this.y, this.w, this.h, 10);
        }
    }

    public mouseOverButton(): boolean {
        // TODO : make it recognise mouse over scaled button
        return this.p.mouseX > this.x && this.p.mouseX < this.x + this.w && this.p.mouseY > this.y && this.p.mouseY < this.y + this.h;
    }

    public getColour() {
        return this.colour;
    }

}