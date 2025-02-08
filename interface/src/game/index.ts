import { SERVER_URL } from "../constants";


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

    private static bpm: number = 60;
    
    private static queue = [];

    private static previousChoice = null;

    private static onBeatCount = 4;
    private static beatCount = 8;

    private static soundTypeCount = 2;
    private static soundCounts = 4

    private static sendNewChoice(): void {



        let possibleChoices = ["sound", "coulor", "vibe"];
        const choices = possibleChoices.filter(choice => choice !== this.previousChoice);
        
        const choice = choices[Math.floor(Math.random() * choices.length)];

        if (choice == "vibe") {

            this.addNewVibration();

        } else if (choice == "coulor") {

        } else if (choice == "sound") {

        }

    }

    private static addNewSounds() {

        

    }

    public static addNewVibration() {

        let beats = Array(this.beatCount).fill(0);

        const shuffled = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7]);
        const on_beats = shuffled.slice(0, this.onBeatCount);
        on_beats.forEach(on_beat => beats[on_beat] = 1);

        console.log(shuffled);

        const payload = {
            sequence: beats,
            bpm: this.bpm,
        };

        fetch(SERVER_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json" // Ensure the server knows you're sending JSON
            },
            body: JSON.stringify(payload)
        })

    }

    private static addNewCoulors() {

        const values = Object.values(Coulors);

        // for (let i = 0; i < n; i++) {
        //     const coulor = values[Math.floor(Math.random() * values.length)];
        //     this.queue.push(coulor);
        // }

    }


}