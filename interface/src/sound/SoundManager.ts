import { GameState } from "../game/gameState";

export class SoundManager {
    private audioContext = new AudioContext();
    private static labelToNote: Record<number, string> = {
        0: "c3",
        2: "e3",
        1: "g3",
        3: "c4",
    };
    private static SFX: string[] = [
        "help_high",
        "im_so_stressed",
        "is_it_a_colour",
        "is_that_my_phone_ringing",
        "laugh",
        "scream_1",
        "scream_2",
        "scream_3",
    ];

    private currentSFX: boolean = false;

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

        // this.currentSFX = true;

        // let t = null;

        for (const note of notes) {
            await this.playSample(`/notes/${SoundManager.labelToNote[note]}.mp3`, 5);
            await new Promise((r) => setTimeout(r, noteLength * 1000));
        }

        // t?.addEventListener("ended", () => {
        //     this.currentSFX = false;
        // });
    }

    public ending() {
        this.playSample("/voice/scream_1.wav");
        this.playSample("/voice/laugh.wav");
    }

    async manageMusic() {
        const start = await this.playSample("/music/start.wav", 0.2);
        start.addEventListener("ended", async () => {
            const loop = await this.playSample("/music/loop.wav", 0.2, true);

            const interval = setInterval(async () => {
                if (GameState.timeLeft < 0) {
                    loop.stop();
                    clearInterval(interval);
                    return;
                }

                if (!this.currentSFX && Math.random() < 0.1) {
                    this.currentSFX = true;

                    const s = await this.playSample(
                        `/voice/${
                            SoundManager.SFX[
                                Math.floor(Math.random() * (SoundManager.SFX.length - 1))
                            ]
                        }.wav`,
                        0.2
                    );

                    s.addEventListener("ended", () => {
                        this.currentSFX = false;
                    });
                }

                loop.playbackRate.value = (GameState.bpm + 30) / 120;
            }, 100);
        });
    }
}

export const soundManager = new SoundManager();
