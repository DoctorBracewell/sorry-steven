import p5 from 'p5';

export interface Scene {
  preload?(): void;
  setup(): void;
  draw(): void;
  keyPressed?(): void;
  mousePressed?(): void;
}

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private transitioning: boolean = false;
  private fadeAlpha: number = 0;
  private fadeSpeed: number = 5; // Higher value = faster fade

  constructor(private p: p5) {}

  addScene(name: string, scene: Scene): void {
    this.scenes.set(name, scene);
  }

  setScene(name: string): void {
    if (this.transitioning) return;

    const scene = this.scenes.get(name);
    if (!scene) {
      console.error(`Scene "${name}" not found.`);
      return;
    }

    this.transitioning = true;
    this.fadeOut(() => {
      this.currentScene = scene;
      this.currentScene.setup();
      this.fadeIn(() => {
        this.transitioning = false;
      });
    });
  }

  preload(): void {
    if (this.currentScene?.preload) {
      this.currentScene.preload();
    }
  }

  update(): void {
    if (this.currentScene) {
      this.currentScene.draw();
    }

    // Draw the fade effect
    if (this.fadeAlpha > 0) {
      this.p.fill(0, this.fadeAlpha);
      this.p.noStroke();
      this.p.rect(0, 0, this.p.width, this.p.height);
    }
  }

  private fadeOut(callback: () => void): void {
    this.fadeAlpha = 0;
    const fadeInterval = setInterval(() => {
      this.fadeAlpha += this.fadeSpeed;
      if (this.fadeAlpha >= 255) {
        this.fadeAlpha = 255;
        clearInterval(fadeInterval);
        callback();
      }
    }, 16); // Roughly 60 FPS
  }

  private fadeIn(callback: () => void): void {
    const fadeInterval = setInterval(() => {
      this.fadeAlpha -= this.fadeSpeed;
      if (this.fadeAlpha <= 0) {
        this.fadeAlpha = 0;
        clearInterval(fadeInterval);
        console.log("FADED IN");
        callback();
      }
    }, 16);
  }

  handleKeyPressed(): void {
    if (this.currentScene?.keyPressed) {
      this.currentScene.keyPressed();
    }
  }

  handleMousePressed(): void {
    if (this.currentScene?.mousePressed) {
      this.currentScene.mousePressed();
    }
  }
}
