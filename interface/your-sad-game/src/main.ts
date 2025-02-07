import p5 from 'p5';

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600);
    p.background(0);
    p.fill(255);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(32);
    p.text('Welcome to Your Futile Game', p.width / 2, p.height / 2);
  };

  p.draw = () => {
    // Infinite loop—just like your thoughts late at night.
  };
};

new p5(sketch);
