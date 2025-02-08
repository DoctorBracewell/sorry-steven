import p5 from "p5";
import "p5/lib/addons/p5.sound";

export class SensoryOut {
    private freqMapping: Record<number, number>  = {
        0: 261.63, // C4
        1: 329.63, // E4
        2: 392.00, // G4
        3: 523.25  // C5
    };

    private osc: p5.Oscillator;

    constructor(){
        this.osc = new p5.Oscillator();
        this.osc.setType("sine");
        this.osc.amp(0.5);
    }

    playSound(sequence: (0 | 1 | 2 | 3)[], bpm: number) {

        // convert bpm to ms per beat
        const duration = (60 / bpm) * 1000;

        let index = 0;

        // play sequence
        const playNext = () => {
            if (index >= sequence.length) {
                this.osc.stop(0);
                return;
            }

            this.osc.freq(this.freqMapping[sequence[index]]);
            this.osc.start()

            setTimeout(() => {
                this.osc.stop(0);
                index++;
                playNext();
            }, duration);
        };

        playNext();
    }
}
