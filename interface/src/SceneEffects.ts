import p5 from 'p5';

export class SceneEffects {

    private static shakeAmount = 0;

    static pulse(p: p5, intensity: number, speed: number, baseSize: number): number {
        const pulse = baseSize + Math.sin(p.frameCount * speed) * intensity;
        return pulse > 0 ? pulse : 0;
    }

    static setShake(amount: number): void {
        this.shakeAmount = amount;
    }

    static applyShake(p: p5): void {
        if (this.shakeAmount > 0) {
            const shakeX = p.random(-this.shakeAmount, this.shakeAmount);
            const shakeY = p.random(-this.shakeAmount, this.shakeAmount);
            p.translate(shakeX, shakeY);
        
            // Reduce shake over time
            this.shakeAmount *= 0.98; // Lower factor = slower decay
            if (this.shakeAmount < 0.5) {
                this.shakeAmount = 0;
            }
        }
    }
}
