import p5 from "p5";
import { SceneManager } from "./SceneManager";
import { IntroScene, GameScene } from "./scenes";
import { CutScene } from "./scenes/CutScenes";
import * as p5s from "@fal-works/p5-scaler";
import "./style.css";

let sceneManager: SceneManager;
const scaler = p5s.variableRatio({
    parent: document.getElementById("canvas")!,
    height: 0,
});

const sketch = (p: p5) => {
    scaler.setP5Instance(p);

    p.setup = () => {
        const canvas = scaler.createCanvas();
        p5s.setParentElement(canvas, "#canvas");

        sceneManager = new SceneManager(p);
        sceneManager.addScene("intro", new IntroScene(p, sceneManager));
        sceneManager.addScene("game", new GameScene(p, sceneManager));

        sceneManager.addScene(
            "cutscene1",
            new CutScene(p, sceneManager, "/cutscenes/crim.jpg", "cutscene2")
        );
        sceneManager.addScene(
            "cutscene2",
            new CutScene(p, sceneManager, "/cutscenes/jam.jpg", "cutscene3")
        );
        sceneManager.addScene(
            "cutscene3",
            new CutScene(p, sceneManager, "/cutscenes/waste.jpg", "intro")
        );

        sceneManager.setScene("game");
    };

    p.draw = () => {
        sceneManager.update();
    };

    p.keyPressed = () => {
        sceneManager.handleKeyPressed();
    };

    p.touchStarted = () => {
        sceneManager.handleMousePressed();
    };
};

new p5(sketch);
