import { useCallback, useRef, useEffect } from 'react';

// Sound URLs from reliable sources
const SOUND_URLS = {
  start: 'https://assets.mixkit.co/active_storage/sfx/2044/2044-preview.m4a', // Soft bell
  complete: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.m4a', // Success chime
  cancel: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.m4a', // Soft whoosh
  rain: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.m4a', // Rain ambient (loop)
};

interface UseSoundOptions {
  enabled: boolean;
  rainEnabled: boolean;
}

export function useSound({ enabled, rainEnabled }: UseSoundOptions) {
  const audioRefs = useRef<{
    start?: HTMLAudioElement;
    complete?: HTMLAudioElement;
    cancel?: HTMLAudioElement;
    rain?: HTMLAudioElement;
  }>({});

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Create audio elements
    audioRefs.current.start = new Audio(SOUND_URLS.start);
    audioRefs.current.complete = new Audio(SOUND_URLS.complete);
    audioRefs.current.cancel = new Audio(SOUND_URLS.cancel);
    audioRefs.current.rain = new Audio(SOUND_URLS.rain);

    // Configure rain sound for looping
    if (audioRefs.current.rain) {
      audioRefs.current.rain.loop = true;
      audioRefs.current.rain.volume = 0.3;
    }

    // Set volumes
    if (audioRefs.current.start) audioRefs.current.start.volume = 0.5;
    if (audioRefs.current.complete) audioRefs.current.complete.volume = 0.5;
    if (audioRefs.current.cancel) audioRefs.current.cancel.volume = 0.4;

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.src = '';
        }
      });
    };
  }, []);

  // Handle rain sound based on enabled state
  useEffect(() => {
    const rainAudio = audioRefs.current.rain;
    if (!rainAudio) return;

    if (rainEnabled && enabled) {
      rainAudio.play().catch(() => {
        // Autoplay blocked, user needs to interact first
      });
    } else {
      rainAudio.pause();
      rainAudio.currentTime = 0;
    }
  }, [rainEnabled, enabled]);

  const playStart = useCallback(() => {
    if (!enabled) return;
    const audio = audioRefs.current.start;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [enabled]);

  const playComplete = useCallback(() => {
    if (!enabled) return;
    const audio = audioRefs.current.complete;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [enabled]);

  const playCancel = useCallback(() => {
    if (!enabled) return;
    const audio = audioRefs.current.cancel;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  }, [enabled]);

  const setRainVolume = useCallback((volume: number) => {
    const rainAudio = audioRefs.current.rain;
    if (rainAudio) {
      rainAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    playStart,
    playComplete,
    playCancel,
    setRainVolume,
  };
}
