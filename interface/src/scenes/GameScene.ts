import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { SceneEffects } from "../SceneEffects";
import { Sound } from "../Sound";
import { Game } from "../game";
import { Button } from "../utils/Button"
import { Colours} from "../gameState"



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
    let index = 0;
    for (const c in Colours) {
      this.buttons.push(new Button(this.p, 200 + (index * 100), 200, 50, Colours[c as keyof typeof Colours]));
      console.log("button: " + c);
      index++;
    }

  }

  draw(): void {
    this.buttons.forEach((btn) => btn.draw(false));
  }

  mousePressed(): void {

    this.buttons.forEach((btn) => {
      if (btn.mouseOverButton()) {
        btn.draw(true);
        console.log(btn.getColour());
      }
    })

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