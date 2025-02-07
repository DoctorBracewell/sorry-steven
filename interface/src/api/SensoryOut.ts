import p5 from "p5";
import "p5/lib/addons/p5.sound";

export class SensoryOut {

    playSound(){
        const highFreq = 880; // high frequency (A5)
        //const lowFreq = 440; // low frequency (A4)

        // convert bpm to ms per beat
        //const interval = (60 / bpm) * 1000;


        let osc = new p5.Oscillator();
        osc.setType("sine");
        osc.freq(highFreq);
        osc.amp(0.5);
        osc.start();

        setTimeout(() => {
            osc.stop(0);
        }, 1000);

    }

    // showColours(){

    // }

    // sendVibrations(){

    // }
}
