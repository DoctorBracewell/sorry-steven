import { SERVER_URL } from "../constants";


enum Coulors {
    Red = "RED",
    Yellow = "YELLOW",
    Pink = "PINK",
    Green = "GREEN"
}

enum Sound {
    Small = 0,
    Medium = 1
}

enum Vibration {
    Series = 0
}

enum THEENUM {
    Sound,
    Coulors
}

export class Game {

    private static bpm: number = 100;
    
    private static queue = [];

    private static previousChoice = null;

    private static onBeatCount = 4;
    private static beatCount = 8;

    private static sendNewChoice(): void {

        const enumSet: Set<any> = new Set([Coulors, Sound, Vibration]);
        if (this.previousChoice !== null) {
            enumSet.delete(this.previousChoice);
        }

        const enumsArray = Array.from(enumSet);
        const choice = enumsArray[Math.floor(Math.random() * enumsArray.length)];

        if (choice == Vibration) {

            this.addNewVibration();

        } else if (choice == Sound) {

        } else if (choice == Coulors) {

        }

    }

    private static addNewSounds() {}

    public static addNewVibration() {

        let beats = Array(this.beatCount).fill(0);

        const shuffled = [0, 1, 2, 3, 4, 5, 6, 7].sort(() => 0.5 - Math.random());
        const on_beats = shuffled.slice(0, this.beatCount);
        on_beats.forEach(on_beat => beats[on_beat] = 1)

        const payload = {
            sequence: JSON.stringify(on_beats),
            bpm: this.bpm.toString(),
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