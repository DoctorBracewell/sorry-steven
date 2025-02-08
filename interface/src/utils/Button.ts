import { Coulors} from "../config"


export class Button {
    private x: number;
    private y: number;
    private size: number;
    private colour: Coulors;

    constructor(x: number, y: number, size: number, colour: Coulors) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.colour = colour;
    }

    draw() {
        
    }

}