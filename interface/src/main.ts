import p5 from "p5";
import { SceneManager } from "./SceneManager";
import { IntroScene, GameScene, CutScene, EndScene } from "./scenes";
import * as p5s from "@fal-works/p5-scaler";
import "./style.css";
import { FPS } from "./constants";
import { SceneEffects } from "./SceneEffects";

let sceneManager: SceneManager;
export const scaler = p5s.fixedRatio({
    width: 1280,
    height: 720,
    parent: "#canvas",
});

const sketch = (p: p5) => {
    scaler.setP5Instance(p);

    p.setup = () => {
        const canvas = scaler.createCanvas();
        p5s.setParentElement(canvas, "#canvas");
        scaler.resizeCanvas();

        p.frameRate(FPS);
        SceneEffects.p = p;

        sceneManager = new SceneManager(p);
        sceneManager.addScene("intro", new IntroScene(p, sceneManager));
        sceneManager.addScene("game", new GameScene(p, sceneManager));
        sceneManager.addScene("end", new EndScene(p));

        sceneManager.addScene(
            "cutscene1",
            new CutScene(
                p,
                sceneManager,
                "/cutscenes/Cutscene_1.png",
                "cutscene2",
                "/voice/so_much_work_todo.wav"
            )
        );
        sceneManager.addScene(
            "cutscene2",
            new CutScene(
                p,
                sceneManager,
                "/cutscenes/Cutscene_2.png",
                "cutscene3",
                "/voice/finally_time_to_go_home.wav"
            )
        );
        sceneManager.addScene(
            "cutscene3",
            new CutScene(
                p,
                sceneManager,
                "/cutscenes/Cutscene_3.png",
                "game",
                "voice/hmm_what_to_watch_on_tv.wav"
            )
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

document.querySelector("#start")!.addEventListener("click", () => {
    (document.querySelector("#menu")! as HTMLDivElement).style.display = "none";
    new p5(sketch, document.getElementById("canvas")!);
});
