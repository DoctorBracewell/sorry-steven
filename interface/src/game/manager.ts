import p5 from "p5";
import { GameState, THEENUM } from "./gameState";
import { QueueHandler } from "./queueHandler";

export class Manager {

    secondsPast: number = 0;
    p: p5;
    next_choice: number;

    qh: QueueHandler;

    constructor(p: p5) {
        this.p = p;
        this.next_choice = this.get_next_choice_time();
        GameState.totalTaskTime = this.next_choice;
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
            GameState.totalTaskTime = this.next_choice - this.secondsPast;
        }

        GameState.timeLeft -= 0.001; 
        GameState.timeLeftOnTask = this.next_choice - this.secondsPast;

    }

    get_next_choice_time(): number {

        return this.secondsPast + Math.max(3 - GameState.bpm / 80, 0) + Math.random();

    }

    public send_input(input: any): boolean | null {
        const seq_complete = this.qh.sendInput(input);
        if (seq_complete == null) {
            return null;
        }

        const diff = Math.pow((GameState.bpm / 10) / 3.5, 2)
        if (seq_complete) {
            GameState.timeLeft = Math.min(GameState.timeLeft + diff, 100);
        } else {
            GameState.timeLeft -= diff;
        }

        return seq_complete;
    }


}
