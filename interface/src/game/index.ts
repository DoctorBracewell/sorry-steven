
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

    private static sendNewChoice(): void {

        const enumSet: Set<any> = new Set([Colors, Sizes, Shapes]);

    }
    



}