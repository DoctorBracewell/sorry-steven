import { SERVER_URL } from "../constants";
import { Sound } from "../Sound";
import { Coulors, bpm, soundCounts, soundTypeCount, coulorsCount, onBeatCount, beatCount } from "../config";

enum THEENUM {
    Sound,
    Coulors,
    Vibrations
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export class Game {
    
    private static queue: [THEENUM, any[]][] = [];

    private static previousChoice: string = "";

    private static userBeats: number[] = [];

    private static sendNewChoice(): void {

        let possibleChoices = ["sound", "coulor", "vibe"];
        const choices = possibleChoices.filter(choice => choice !== this.previousChoice);
        
        const choice = choices[Math.floor(Math.random() * choices.length)];

        if (choice == "vibe") {

            this.addNewVibration();
            this.previousChoice = "vibe";

        } else if (choice == "coulor") {

            this.addNewCoulors();
            this.previousChoice = "coulor";

        } else if (choice == "sound") {

            this.addNewSounds();
            this.previousChoice = "sound";

        }

    }

    private static addNewSounds() {

        const sounds: number[] = [];
        for (let i = 0; i < soundCounts; i++) {
            sounds.push(Math.floor(Math.random() * (soundTypeCount + 1)));
        }

        let media_player = new Sound();
        media_player.playSound(sounds, bpm);

        this.queue.push(
            [THEENUM.Sound, sounds]
        );

    }

    public static addNewVibration() {

        let beats = Array(beatCount).fill(0);
        beats[0] = 1;

        const shuffled = shuffleArray([1, 2, 3, 4, 5, 6, 7]);
        const on_beats = shuffled.slice(0, onBeatCount - 1);
        on_beats.forEach(on_beat => beats[on_beat] = 1);

        const payload = {
            sequence: beats,
            bpm: bpm,
        };

        fetch(SERVER_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        this.queue.push(
            [THEENUM.Vibrations, beats]
        );

    }

    private static addNewCoulors() {

        const possibleCoulors = Object.values(Coulors);

        const coulors: string[] = [];
        
        for (let i = 0; i < coulorsCount; i++) {
            const coulor = possibleCoulors[Math.floor(Math.random() * possibleCoulors.length)];
            coulors.push(coulor);
        }

        // Send coulors

        this.queue.push(
            [THEENUM.Coulors, coulors]
        );

    }

    public static sendInput(input: string): boolean {

        const [curr_type, curr_seq] = this.queue[0];

        switch (curr_type) {
            case THEENUM.Coulors:
                if (
                    input == "q" && curr_seq[0] == Coulors.Red
                    || input == "w" && curr_seq[0] == Coulors.Yellow
                    || input == "e" && curr_seq[0] == Coulors.Green
                    || input == "r" && curr_seq[0] == Coulors.Pink
                ) {
                    this.popQueue();
                    return true;
                }
                break;
            case THEENUM.Sound:
                if (
                    input == "a" && curr_seq[0] == 0
                    || input == "s" && curr_seq[0] == 1
                    || input == "d" && curr_seq[0] == 2
                    || input == "f" && curr_seq[0] == 3
                ) {
                    this.popQueue();
                    return true;
                }
                break;
            case THEENUM.Vibrations:
                if (input == " ") {
                    this.userBeats.push(Date.now() / 1000);
                    const beatsNeeded = this.queue[0][1].reduce((acc, curr) => acc + curr, 0);
                    if (this.userBeats.length == beatsNeeded) {
                        // Check if correct

                        this.userBeats = [];
                    } // Can't lose multiple lives in less than a second (i-frames)
                    return true;
                }
                break;
            default:
                break;
        }

        return false;

    }

    private static popQueue() {
        this.queue[0][1].shift();
        if (this.queue[0][1].length == 0) {
            this.queue.shift();
        }
    }

}