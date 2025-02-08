import p5 from 'p5';
import { SceneManager } from './SceneManager';
import {
  IntroScene,
  GameScene
} from './scenes';
import { CutScene } from './scenes/CutScenes';


let sceneManager: SceneManager;

const sketch = (p: p5) => {

  p.preload = () => {
    // console.log("BOB");
    // sceneManager.preload();
  }

  p.setup = () => {
    p.createCanvas(800, 600);
    sceneManager = new SceneManager(p);
    sceneManager.addScene('intro', new IntroScene(p, sceneManager));
    sceneManager.addScene('game', new GameScene(p, sceneManager));

    sceneManager.addScene('cutscene1', new CutScene(p, sceneManager, '/cutscenes/crim.jpg', 'cutscene2'));
    sceneManager.addScene('cutscene2', new CutScene(p, sceneManager, '/cutscenes/jam.jpg', 'cutscene3'));
    sceneManager.addScene('cutscene3', new CutScene(p, sceneManager, '/cutscenes/waste.jpg', 'intro'));


    sceneManager.setScene('cutscene1');
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
