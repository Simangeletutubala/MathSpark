/**
 * SpeechService handles text-to-speech functionality using the Web Speech API.
 * Optimized for South African primary school learners (Grade 4).
 */
class SpeechService {
  private static instance: SpeechService;
  private synthesis: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private speakingListeners: Set<(isSpeaking: boolean) => void> = new Set();
  private _isSpeaking: boolean = false;

  private constructor() {
    this.synthesis = typeof window !== 'undefined' ? window.speechSynthesis : null as any;
    if (this.synthesis) {
      this.initializeVoice();
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private initializeVoice() {
    if (!this.synthesis) return;
    const loadVoices = () => {
      const voices = this.synthesis.getVoices();
      // Look for child-friendly or South African/English voices
      this.voice = voices.find(v => v.lang.includes('en-ZA')) 
        || voices.find(v => v.lang.includes('en-GB') && (v.name.includes('Natural') || v.name.includes('Google')))
        || voices.find(v => v.lang.includes('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')))
        || voices.find(v => v.lang.includes('en'))
        || voices[0] || null;
    };

    if (this.synthesis.onvoiceschanged !== undefined) {
      this.synthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }

  public subscribeSpeaking(listener: (isSpeaking: boolean) => void): () => void {
    this.speakingListeners.add(listener);
    listener(this._isSpeaking);
    return () => this.speakingListeners.delete(listener);
  }

  private setSpeaking(val: boolean) {
    this._isSpeaking = val;
    this.speakingListeners.forEach(fn => fn(val));
  }

  public get isSpeaking(): boolean {
    return this._isSpeaking;
  }

  public formatMathForSpeech(text: string): string {
    if (!text) return '';
    return text
      .replace(/R\s*([0-9]+)/gi, '$1 Rands')
      .replace(/([0-9]+)\s*c\b/gi, '$1 cents')
      .replace(/(\d+)\s*\/\s*(\d+)/g, (_match, num, den) => {
        if (num === '1' && den === '2') return 'one half';
        if (num === '1' && den === '4') return 'one quarter';
        if (num === '3' && den === '4') return 'three quarters';
        if (num === '1' && den === '3') return 'one third';
        if (num === '2' && den === '3') return 'two thirds';
        return `${num} over ${den}`;
      })
      .replace(/×/g, ' times ')
      .replace(/÷/g, ' divided by ')
      .replace(/\s\+\s/g, ' plus ')
      .replace(/\s-\s/g, ' minus ')
      .replace(/=/g, ' equals ')
      .replace(/□/g, ' the missing number ')
      .replace(/\bcm\b/gi, ' centimetres')
      .replace(/\bkg\b/gi, ' kilograms')
      .replace(/\bml\b/gi, ' millilitres')
      .replace(/🇿🇦/g, 'South Africa')
      .replace(/💡/g, 'Hint: ')
      .replace(/✨|🚀|⭐|🎉|🏆|💪|🧠|✋|💖|🌟/g, ' ');
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.synthesis) return;
    this.stop();

    const formatted = this.formatMathForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(formatted);
    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Child-friendly settings: slightly slower pace and warm pitch for clarity
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    utterance.lang = 'en-ZA';

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      this.setSpeaking(false);
    };

    this.synthesis.speak(utterance);
  }

  public toggle(text: string) {
    if (this._isSpeaking) {
      this.stop();
    } else {
      this.speak(text);
    }
  }

  public stop() {
    if (!this.synthesis) return;
    this.synthesis.cancel();
    this.setSpeaking(false);
  }
}

export const speechService = SpeechService.getInstance();

