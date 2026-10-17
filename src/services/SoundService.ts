export class SoundService {
  private static play(freq: number, type: OscillatorType = 'sine', duration: number = 0.1) {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio not supported or blocked', e);
    }
  }

  static playCorrect() {
    this.play(523.25, 'sine', 0.1); // C5
    setTimeout(() => this.play(659.25, 'sine', 0.1), 100); // E5
    setTimeout(() => this.play(783.99, 'sine', 0.2), 200); // G5
  }

  static playIncorrect() {
    this.play(220, 'sawtooth', 0.2); // A3
    setTimeout(() => this.play(196, 'sawtooth', 0.3), 150); // G3
  }

  static playLevelUp() {
    [440, 554, 659, 880].forEach((f, i) => {
      setTimeout(() => this.play(f, 'square', 0.15), i * 100);
    });
  }

  static playTap(pitchIndex: number = 0) {
    const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
    const freq = notes[pitchIndex % notes.length] || 523.25;
    this.play(freq, 'sine', 0.08);
  }
}
