import p5 from 'p5';
import { SceneManager } from './SceneManager';
import {
  IntroScene,
  GameScene
} from './scenes';


let sceneManager: SceneManager;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600);
    sceneManager = new SceneManager(p);
    sceneManager.addScene('intro', new IntroScene(p, sceneManager));
    sceneManager.addScene('game', new GameScene(p, sceneManager));
    sceneManager.setScene('intro');
  };

  p.draw = () => {
    sceneManager.update();
  };

  p.keyPressed = () => {
    sceneManager.handleKeyPressed();
  };

  p.mousePressed = () => {
    sceneManager.handleMousePressed();
  };
};

new p5(sketch);
