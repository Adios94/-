
/**
 * Simple Audio Service for Super Producer XP
 * This service handles basic UI sound effects.
 */

class AudioService {
  private isMuted: boolean = false;

  playStartup() {
    this.logSound('XP Startup');
  }

  playClick() {
    this.logSound('Click');
  }

  playSuccess() {
    this.logSound('Success');
  }

  playGlitch() {
    this.logSound('Glitch');
  }

  private logSound(name: string) {
    if (!this.isMuted) {
      console.log(`[AudioService] Playing sound: ${name}`);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const audio = new AudioService();
