import p5 from "p5";
import { SceneManager, Scene } from "../SceneManager"

export class IntroScene implements Scene {
  private p: p5;
  private SM: SceneManager;

  constructor(p: p5, sceneManager: SceneManager) {
    this.p = p;
    this.SM = sceneManager;
  }

  setup(): void {
    this.p.background(50);
    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(32);
    this.p.text('Welcome to the Sad Game. Press any key to continue.', this.p.width / 2, this.p.height / 2);
  }

  draw(): void {
    this.p.background(50);
    this.p.fill(255);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(32);
    this.p.text('Welcome to the Sad Game. Press any key to continue.', this.p.width / 2, this.p.height / 2);
  }

  keyPressed(): void {
    console.log('Switching to Game Scene.');
    this.SM.setScene('game');
  }
}
