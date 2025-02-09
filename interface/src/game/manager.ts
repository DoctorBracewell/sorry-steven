import p5 from "p5";
import { GameState, THEENUM } from "./gameState";
import { QueueHandler } from "./queueHandler";

export class Manager {
    secondsPast: number = 0;
    p: p5;
    next_choice: number;

    move_on: boolean;

    qh: QueueHandler;

    constructor(p: p5) {
        this.p = p;
        this.next_choice = this.get_next_choice_time();
        GameState.totalTaskTime = this.next_choice;
        this.qh = new QueueHandler();
        this.move_on = false;
    }

    update(): void {
        if (GameState.pause) {
            return;
        }

        this.secondsPast += this.p.deltaTime / 1000;
        GameState.setBPM(this.secondsPast);

        if (this.next_choice < this.secondsPast || this.move_on) {
            this.move_on = false;

            const choiceType = this.qh.sendNewChoice();

            let time_offset: number = 0;
            if (choiceType == THEENUM.Colours) {
                time_offset = 60 / GameState.bpm + 0.6; // To change
            } else if (choiceType == THEENUM.Vibrations) {
                time_offset = 240 / GameState.bpm + 0.6;
            } else {
                time_offset = 240 / GameState.bpm + 0.6; // To Change
            }

            this.next_choice = time_offset + this.get_next_choice_time();
            GameState.totalTaskTime = this.next_choice - this.secondsPast;
        }

        GameState.timeLeft -= 1 / 12;
        GameState.timeLeftOnTask = this.next_choice - this.secondsPast;
    }

    get_next_choice_time(): number {
        return this.secondsPast + Math.max(2 * (3 - GameState.bpm / 80), 0) + Math.random();
    }

    public send_input(input: any): boolean | null {
        let seq_complete: boolean;
        if (input == "we got any time left??") {
            if (!GameState.runOutOfTime) {
                return null;
            }
            seq_complete = false;
            GameState.runOutOfTime = false;
        } else {
            const t_seq_complete = this.qh.sendInput(input);
            if (t_seq_complete == null) {
                return null;
            }
            seq_complete = t_seq_complete;
            this.move_on = true;
        }

        const diff = Math.pow(GameState.bpm / 10 / 3.5, 2);
        if (seq_complete) {
            GameState.timeLeft = Math.min(GameState.timeLeft + diff, 100);
        } else {
            GameState.timeLeft -= diff;
        }

        return seq_complete;
    }
}
