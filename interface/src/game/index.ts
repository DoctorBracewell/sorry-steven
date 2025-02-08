import { SERVER_URL } from "../constants";
import { Sound } from "../Sound";


enum Coulors {
    Red = "RED",
    Yellow = "YELLOW",
    Pink = "PINK",
    Green = "GREEN"
}

enum THEENUM {
    Sound,
    Coulors
}

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

export class Game {

    private static bpm: number = 160;
    
    private static queue = [];

    private static previousChoice: string = "";

    private static onBeatCount = 4;
    private static beatCount = 8;

    private static soundTypeCount = 2;
    private static soundCounts = 4

    private static coulorsCount = 4;

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
        for (let i = 0; i < this.soundCounts; i++) {
            sounds.push(Math.floor(Math.random() * (this.soundTypeCount + 1)));
        }

        let media_player = new Sound();
        media_player.playSound(sounds, this.bpm);

    }

    public static addNewVibration() {

        let beats = Array(this.beatCount).fill(0);
        beats[0] = 1;

        const shuffled = shuffleArray([1, 2, 3, 4, 5, 6, 7]);
        const on_beats = shuffled.slice(0, this.onBeatCount - 1);
        on_beats.forEach(on_beat => beats[on_beat] = 1);

        const payload = {
            sequence: beats,
            bpm: this.bpm,
        };

        fetch(SERVER_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })

    }

    private static addNewCoulors() {

        const possibleCoulors = Object.values(Coulors);

        const coulors: string[] = [];
        
        for (let i = 0; i < this.coulorsCount; i++) {
            const coulor = possibleCoulors[Math.floor(Math.random() * possibleCoulors.length)];
            coulors.push(coulor);
        }

        // Send coulors

    }

    public static sendInput(input: string) {}

}