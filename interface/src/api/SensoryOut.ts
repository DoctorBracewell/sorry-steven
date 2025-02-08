import p5 from "p5";
import "p5/lib/addons/p5.sound";

export class SensoryOut {
    private highFreq = 880; // high frequency (A5)
    private lowFreq = 440; // low frequency (A4)

    private osc: p5.Oscillator;


    constructor(){
        this.osc = new p5.Oscillator();
        this.osc.setType("sine");
        this.osc.amp(0.5);
    }

    playSound(sequence: (0 | 1)[], bpm: number) {

        // convert bpm to ms per beat
        const duration = (60 / bpm) * 1000;

        let index = 0;

        // play sequence
        const playNext = () => {
            if (index >= sequence.length) {
                this.osc.stop(0);
                return;
            }

            this.osc.freq(sequence[index] === 1 ? this.highFreq : this.lowFreq);
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
