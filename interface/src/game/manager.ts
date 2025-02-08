import p5 from "p5";
import { GameState } from "./gameState";
import { QueueHandler, THEENUM } from "./queueHandler";

export class Manager {

    secondsPast: number = 0;
    p: p5;
    next_choice: number;

    qh: QueueHandler;

    constructor(p: p5) {
        this.p = p;
        this.next_choice = this.get_next_choice_time();
        this.qh = new QueueHandler();
    }

    update(): void {
        if (GameState.pause) {
            return;
        }

        this.secondsPast += this.p.deltaTime / 1000;
        GameState.setBPM(this.secondsPast);

        if (this.next_choice < this.secondsPast) {

            const choiceType = this.qh.sendNewChoice();

            let time_offset: number = 0;
            if (choiceType == THEENUM.Colours) {
                time_offset = 240 / GameState.bpm; // To change
            } else if (choiceType == THEENUM.Vibrations) {
                time_offset = 240 / GameState.bpm;
            } else {
                time_offset = 240 / GameState.bpm; // To Change
            }

            this.next_choice = time_offset + this.get_next_choice_time();
        }

    }

    get_next_choice_time(): number {

        return this.secondsPast + Math.max(3 - GameState.bpm / 80, 0) + Math.random();

    }


}
