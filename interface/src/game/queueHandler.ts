import { SERVER_URL } from "../constants";
import { soundManager } from "../sound/SoundManager";
import { Colours, THEENUM, GameState } from "./gameState";
import { checkVibe } from "./vibrationChecker";
import { SceneEffects } from "../SceneEffects";


function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export class QueueHandler {
    private queue: [THEENUM, any[]][] = [];

    private userBeats: number[] = [];


    constructor() {}

    public sendNewChoice(): THEENUM {
        let possibleChoices = [THEENUM.Sound, THEENUM.Colours, THEENUM.Vibrations];
        const choices = possibleChoices.filter((choice) => choice !== GameState.taskType);

        const choice = choices[Math.floor(Math.random() * choices.length)];

        if (this.queue.length > 0) {
            GameState.runOutOfTime = true;
        }

        if (choice == THEENUM.Vibrations) {
            this.addNewVibration();
            GameState.taskType = THEENUM.Vibrations;
        } else if (choice == THEENUM.Colours) {
            this.addNewColours();
            GameState.taskType = THEENUM.Colours;
        } else if (choice == THEENUM.Sound) {
            this.addNewSounds();
            GameState.taskType = THEENUM.Sound;
        }

        return GameState.taskType;
    }

    private addNewSounds() {
        const sounds: number[] = [];

        const indexes = shuffleArray([...Array(GameState.soundTypeCount).keys()]);

        for (let i = 0; i < GameState.soundCounts; i++) {
            sounds.push(Math.floor(Math.random() * (GameState.soundTypeCount)));
        }
        for (let i = 0; i < indexes.length; i++) {
            sounds[indexes[i]] = i;
        }

        soundManager.playNotes(sounds, GameState.bpm);

        this.queue.push([THEENUM.Sound, sounds]);
    }

    private addNewVibration() {
        let beats = Array(GameState.beatCount).fill(0);
        beats[0] = 1;

        const shuffled = shuffleArray([1, 2, 3, 4, 5, 6, 7]);
        const on_beats = shuffled.slice(0, GameState.onBeatCount - 1);
        on_beats.forEach((on_beat) => (beats[on_beat] = 1));

        const payload = {
            sequence: beats,
            bpm: GameState.bpm,
        };

        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        this.queue.push([THEENUM.Vibrations, beats]);
    }

    private addNewColours() {
        const possibleColours = Object.values(Colours) as Colours[];
        const colours: Colours[] = [];

        for (let i = 0; i < GameState.coloursCount; i++) {
            const colour = possibleColours[Math.floor(Math.random() * possibleColours.length)];
            colours.push(colour);
        }

        // Send colours
        SceneEffects.colourSequence = [...colours];
        SceneEffects.bpm = GameState.bpm;

        this.queue.push([THEENUM.Colours, colours]);
    }

    public sendInput(input: any): boolean | null {

        if (this.queue.length == 0) {
            return false;
        }

        const [curr_type, curr_seq] = this.queue[0];

        switch (curr_type) {
            case THEENUM.Colours:
                if (
                    (input == Colours.Red && curr_seq[0] == Colours.Red) ||
                    (input == Colours.Yellow && curr_seq[0] == Colours.Yellow) ||
                    (input == Colours.Green && curr_seq[0] == Colours.Green) ||
                    (input == Colours.Pink && curr_seq[0] == Colours.Pink)
                ) {
                    const finalElem = this.popQueue();
                    if (finalElem) return true;
                } else {
                    this.queue.shift();
                    return false;
                }
                break;
            case THEENUM.Sound:
                if (
                    this.arraysAreEqual(input, this.queue[0][1])
                ) {
                    this.queue.shift();
                    return true;
                } else {
                    this.queue.shift();
                    return false;
                }
            case THEENUM.Vibrations:
                if (input == " ") {
                    this.userBeats.push(Date.now() / 1000);
                    const beatsNeeded = this.queue[0][1].reduce((acc, curr) => acc + curr, 0);
                    if (this.userBeats.length == beatsNeeded) {

                        const success = checkVibe(this.userBeats, this.queue[0][1]);
                        this.userBeats = [];
                        return success;
                    } // Can't lose multiple lives in less than a second (i-frames)
                }
                break;
            default:
                break;
        }
        return null;
    }

    private popQueue(): boolean {
        this.queue[0][1].shift();
        if (this.queue[0][1].length == 0) {
            this.queue.shift();
            return true;
        }
        return false;
    }

    private arraysAreEqual(arr1: any[], arr2: any[]): boolean {
        if (arr1.length !== arr2.length) return false;
        return arr1.every((value, index) => value === arr2[index]);
      }
}
