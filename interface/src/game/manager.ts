import p5 from "p5";
import { GameState } from "./gameState";

export class Manager {
  secondsPast: number = 0;
  p: p5;

  constructor(p: p5) {
    this.p = p;
  }

  update(): void {
    this.secondsPast += this.p.deltaTime / 1000;
    GameState.setBPM(this.secondsPast);
  }


}
