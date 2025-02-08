import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { SceneEffects } from "../SceneEffects";
import { Sound } from "../Sound";
import { Game } from "../game";
import { Button } from "../utils/Button"


export class GameScene implements Scene {
  private p: p5;
  private SM: SceneManager;

  //private colourOrder: Coulors[] = [];
  private buttons: Button[] = []


  constructor(p: p5, sceneManager: SceneManager) {
    this.p = p;
    this.SM = sceneManager;
  }

  setup(): void {
    // create buttons

  }

  draw(): void {
    // change all this stuff 

    // this.p.background(0);

    // this.p.push();
    // this.colours.forEach((colour, index) => {
    //   this.p.fill(colour);
    //   this.p.rect(50 + index * 100, 150, 80, 80);
    // });
  }

  mousePressed(): void {

    // change all this stuff

    // for (let i = 0; i < this.colours.length; i++) {
    //   if (this.p.mouseX > 50 + i * 100 && this.p.mouseX < 130 + i * 100 && this.p.mouseY > 150 && this.p.mouseY < 230) {
    //     this.clickOrder.push(this.colours[i]);
    //     console.log("Click Order:", this.clickOrder.join(" → "));
    //   }
    // }
  }

  keyPressed(): void {
    Game.addNewVibration()

    const testSound = new Sound();
    testSound.playSound([0, 1, 2, 3, 2, 1, 0], 200);
  }
}