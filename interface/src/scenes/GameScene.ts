import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager";
import { SceneEffects } from "../SceneEffects";

export class GameScene implements Scene {
  private p: p5;
  private SM: SceneManager;

  constructor(p: p5, sceneManager: SceneManager) {
    this.p = p;
    this.SM = sceneManager;
  }

  setup(): void {
    SceneEffects.setShake(0);
  }

  draw(): void {

    this.p.background(0);

    this.p.push();
    SceneEffects.applyShake(this.p);

    this.p.fill(255);
    this.p.ellipse(this.p.width / 2, this.p.height / 2, 100, 100);

    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(32);
    this.p.text('Game Scene. Click to return to Intro.', this.p.width / 2, this.p.height / 2);

    this.p.pop();
  }

  mousePressed(): void {
    console.log('Switching to Intro Scene.');
    this.SM.setScene('intro');
  }

  keyPressed(): void {
    console.log("SHAKE");
    SceneEffects.setShake(40);
  }
}