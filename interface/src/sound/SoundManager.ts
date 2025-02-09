import { GameState } from "../game/gameState";

export class SoundManager {
    private audioContext = new AudioContext();
    private static labelToNote: Record<number, string> = {
        0: "c3",
        2: "e3",
        1: "g3",
        3: "c4",
    };

    public async playSample(url: string, volume: number = 1.0, loop = false) {
        if (this.audioContext.state === "suspended") {
            await this.audioContext.resume(); // Resume if suspended
        }

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

        // Create a buffer source
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop;

        // nodes
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;

        // Connect the source to the gain node
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Start playback
        source.start();

        return source;
    }

    async playNotes(notes: number[], bpm: number) {
        const noteLength = 60 / bpm;

        for (const note of notes) {
            await this.playSample(`/notes/${SoundManager.labelToNote[note]}.mp3`, 1.7);
            await new Promise((r) => setTimeout(r, noteLength * 1000));
        }
    }

    async manageMusic() {
        const start = await this.playSample("/music/start.wav", 0.6);
        start.addEventListener("ended", async () => {
            const loop = await this.playSample("/music/loop.wav", 0.6, true);
            setInterval(() => {
                console.log(GameState.bpm);
                loop.playbackRate.value = (GameState.bpm + 30) / 120;
            }, 100);
        });
    }
}

export const soundManager = new SoundManager();
