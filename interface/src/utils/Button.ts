import p5 from "p5";
import { Colours } from "../game/gameState";

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
    private hasScale: boolean;

    private pressTime = 0;
    private pressInProgress = false;
    private scaleTime = 0;
    private scaleInProgress = false;

    public hovered: boolean;

    public data: any;

    constructor(
        p: p5,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        colour: Colours,
        hasBorder: boolean,
        hasScale: boolean = true,
        data: any = null
    ) {
        this.p = p;

        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.scaledW = this.w * 1.1;
        this.scaledH = this.h * 1.1;

        this.scaledX = this.x - (this.scaledW - this.w) / 2;
        this.scaledY = this.y - (this.scaledH - this.h) / 2;

        this.r = r;
        this.colour = colour;
        this.hasBorder = hasBorder;
        this.hasScale = hasScale;

        this.hovered = false;

        this.data = data;
    }

    applyBorderLogic(pressed: boolean) {
        if (pressed) {
            this.pressInProgress = true;
            this.pressTime = this.p.millis();
        }

        if (this.pressInProgress) {
            let gap = this.p.millis() - this.pressTime;

            if (gap < 120) {
                this.p.stroke(255, 255, 255, (gap / 120) * 255);
            } else if (gap > 120 && gap < 280) {
                this.p.stroke(255, 255, 255);
            } else if (gap > 280 && gap < 400) {
                this.p.stroke(255, 255, 255, ((400 - gap) / 120) * 255);
            } else {
                this.pressInProgress = false;
            }
            this.p.strokeWeight(3);
        }

        this.p.fill(this.colour);
    }

    draw(pressed: boolean) {
        this.p.strokeWeight(0);
        this.hovered = this.mouseOverButton();

        if (this.hasBorder) {
            this.applyBorderLogic(pressed);
        }

        if (this.mouseOverButton() && !pressed && this.hasScale) {
            this.p.rect(this.scaledX, this.scaledY, this.scaledW, this.scaledH, this.r);
        } else {
            this.p.rect(this.x, this.y, this.w, this.h, 10);
        }
    }

    public mouseOverButton(): boolean {
        // TODO : make it recognise mouse over scaled button
        return (
            this.p.mouseX > this.x &&
            this.p.mouseX < this.x + this.w &&
            this.p.mouseY > this.y &&
            this.p.mouseY < this.y + this.h
        );
    }

    public getColour() {
        return this.colour;
    }

    public setColour(colour: Colours) {
        this.colour = colour;
    }
}
