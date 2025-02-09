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

    public hovered: boolean;

    public data: any;
    private img: p5.Image | null;
    private pressedImg: p5.Image | null;

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
        data: any = null,
        img: p5.Image | null = null,
        pressedImg: p5.Image | null = null
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
        this.img = img;
        this.pressedImg = pressedImg;
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
        this.hovered = this.mouseOverButton();

        if (this.img === null) {
            this.p.strokeWeight(0);

            if (this.hasBorder) {
                this.applyBorderLogic(pressed);
            }

            if (this.mouseOverButton() && !pressed && this.hasScale) {
                this.p.rect(this.scaledX, this.scaledY, this.scaledW, this.scaledH, this.r);
            } else {
                this.p.rect(this.x, this.y, this.w, this.h, 10);
            }
        } else {
            if (pressed) {
                this.pressInProgress = true;
                this.pressTime = this.p.millis();
            }

            this.p.noSmooth();
            this.p.imageMode(this.p.CENTER);

            if (this.pressInProgress) {
                let gap = this.p.millis() - this.pressTime;

                if (gap < 75) {
                    if (this.pressedImg !== null) {
                    this.p.image(this.pressedImg, this.x, this.y, this.w, this.h);
                    }
                } else {
                    this.pressInProgress = false;
                    this.p.image(this.img, this.x, this.y, this.w, this.h);
                }
            } else {
                this.p.image(this.img, this.x, this.y, this.w, this.h);
            }
        }
    }

    public mouseOverButton(): boolean {
        // TODO : make it recognise mouse over scaled button
        if (this.img === null) {
            return (
                this.p.mouseX > this.x &&
                this.p.mouseX < this.x + this.w &&
                this.p.mouseY > this.y &&
                this.p.mouseY < this.y + this.h
            );
        } else {
            return (
                this.p.mouseX > this.x - this.w / 2 &&
                this.p.mouseX < this.x + this.w / 2 &&
                this.p.mouseY > this.y - this.h / 2 &&
                this.p.mouseY < this.y + this.h / 2
            );
        }
    }

    public getColour() {
        return this.colour;
    }

    public setColour(colour: Colours) {
        this.colour = colour;
    }
}
