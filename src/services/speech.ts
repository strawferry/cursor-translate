export class SpeechService {
  private synthesis: SpeechSynthesis;
  private voices: Map<string, SpeechSynthesisVoice>;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.voices = new Map();
    this.initVoices();
  }

  private initVoices() {
    // 初始化时加载可用的语音
    const updateVoices = () => {
      this.synthesis.getVoices().forEach(voice => {
        if (voice.lang.startsWith('zh') || voice.lang.startsWith('en')) {
          this.voices.set(voice.lang, voice);
        }
      });
    };

    // 某些浏览器需要等待voices加载
    if (this.synthesis.getVoices().length) {
      updateVoices();
    }
    this.synthesis.onvoiceschanged = updateVoices;
  }

  speak(text: string, lang: 'en' | 'zh') {
    // 停止当前正在播放的语音
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'zh' ? 'zh-CN' : 'en-US';
    
    // 尝试使用对应语言的声音
    const voice = this.voices.get(utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }

    this.synthesis.speak(utterance);
  }

  stop() {
    this.synthesis.cancel();
  }
}

// 创建单例实例
export const speechService = typeof window !== 'undefined' ? new SpeechService() : null; 