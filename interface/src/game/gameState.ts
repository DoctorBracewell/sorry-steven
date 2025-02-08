

export enum Colours {
    Red = "RED",
    Yellow = "YELLOW",
    Pink = "PINK",
    Green = "GREEN"
}
  
export class GameState {
    public static bpm: number = 135;
    public static onBeatCount: number = 4;
    public static beatCount: number = 8;
    public static soundTypeCount: number = 2;
    public static soundCounts: number = 4;
    public static coloursCount: number = 4;

    public static pause: boolean = false;



    public static setBPM(t: number) {

        if (t < 50) {
            this.bpm = 90 + 1/5 * t;
        } else if (t < 120) {
            this.bpm = 100 + 1/3.5 * (t - 50)
        } else {
            this.bpm = 120 + 1/2 * (t - 120)
        }

    }

}
  