/**
 * Procedural Zen Water & Ripple Ambient Sound System
 * Powered by Web Audio API (Zero external assets, works reliably anywhere)
 */

class WaterAudioEngine {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private streamGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filter1: BiquadFilterNode | null = null;
  private filter2: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private volume: number = 0.85;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Generate pink/brown water stream noise buffer
  private createStreamNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const output = buffer.getChannelData(channel);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown/Pink filter
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 5.2; // High acoustic clarity gain boost
      }
    }
    return buffer;
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.isRunning) return;

      const ctx = this.ctx;

      // Master Gain
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, ctx.currentTime);
      this.masterGain.connect(ctx.destination);

      // 1. Water Stream Ambience
      const noiseBuffer = this.createStreamNoiseBuffer(ctx);
      this.noiseNode = ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.filter1 = ctx.createBiquadFilter();
      this.filter1.type = 'bandpass';
      this.filter1.frequency.setValueAtTime(360, ctx.currentTime);
      this.filter1.Q.setValueAtTime(1.6, ctx.currentTime);

      this.filter2 = ctx.createBiquadFilter();
      this.filter2.type = 'lowpass';
      this.filter2.frequency.setValueAtTime(750, ctx.currentTime);

      // Gentle LFO to modulate stream current like natural gentle water
      this.lfo = ctx.createOscillator();
      this.lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(120, ctx.currentTime);
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.filter1.frequency);
      this.lfo.start();

      this.streamGain = ctx.createGain();
      this.streamGain.gain.setValueAtTime(0.70, ctx.currentTime);

      this.noiseNode.connect(this.filter1);
      this.filter1.connect(this.filter2);
      this.filter2.connect(this.streamGain);
      this.streamGain.connect(this.masterGain);
      this.noiseNode.start();

      // 2. Zen Harmonic Tone (432 Hz warm singing bowl harmonic chord)
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.18, ctx.currentTime);
      this.droneGain.connect(this.masterGain);

      const freqs = [216, 324, 432, 648]; // Harmonic serene ratios
      this.droneOscs = freqs.map((f, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime);
        
        // Slight sub-detune for acoustic warmth
        const detuneGain = ctx.createGain();
        detuneGain.gain.value = 0.25 / (idx + 1);
        osc.connect(detuneGain);
        detuneGain.connect(this.droneGain!);
        osc.start();
        return osc;
      });

      this.isRunning = true;
    } catch (e) {
      console.warn('AudioContext autoplay policy or initialization:', e);
    }
  }

  public stop() {
    if (!this.ctx || !this.isRunning) return;
    try {
      if (this.masterGain) {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      }
      setTimeout(() => {
        try {
          this.noiseNode?.stop();
          this.noiseNode?.disconnect();
          this.lfo?.stop();
          this.lfo?.disconnect();
          this.droneOscs.forEach(o => {
            o.stop();
            o.disconnect();
          });
          this.droneOscs = [];
          this.isRunning = false;
        } catch {
          // ignore
        }
      }, 300);
    } catch {
      this.isRunning = false;
    }
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  // Trigger a soft liquid water ripple / droplet "plop" sound on mouse move / click
  public playRippleSound(pitchMultiplier = 1.0) {
    if (!this.ctx || !this.isRunning) return;
    try {
      const ctx = this.ctx;
      const now = ctx.currentTime;

      // Soft sine droplet
      const osc = ctx.createOscillator();
      const dropGain = ctx.createGain();

      const startFreq = (550 + Math.random() * 250) * pitchMultiplier;
      const endFreq = startFreq * 0.45;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.12);

      dropGain.gain.setValueAtTime(0.32 * this.volume, now);
      dropGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(dropGain);
      dropGain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // ignore
    }
  }
}

export const waterAudio = new WaterAudioEngine();
