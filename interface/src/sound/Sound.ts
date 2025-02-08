import * as Tone from "tone";

export class Sound {
    private freqMapping: Record<number, number> = {
        0: 261.63, // C4
        1: 329.63, // E4
        2: 392.0, // G4
        3: 523.25, // C5
    };

    private audioContext = new AudioContext();

    public async playSample(url: string) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Create a buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // nodes
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = 4.0;

        // Connect the source to the gain node
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Start playback
        source.start();
    }

    async playSound(sounds: number[], bpm: number) {
        const noteLength = 60 / bpm;

        for (let i = 0; i < sounds.length; i++) {
            await this.playSample("/notes/c3.mp3");
            await new Promise((r) => setTimeout(r, noteLength * 1000));
        }
    }
}
