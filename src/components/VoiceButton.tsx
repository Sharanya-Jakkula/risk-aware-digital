/**
 * VoiceButton — Google-mic style voice input button.
 *
 * States:
 *  idle      → blue mic icon
 *  listening → animated ripple rings + colour bars (Google-mic style)
 *
 * Uses the Web Speech API (SpeechRecognition).
 * Falls back gracefully when the browser doesn't support it.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";

// ── Minimal local Web Speech API types (not in every TS DOM lib version) ──
interface ISpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): { transcript: string };
  [index: number]: { transcript: string };
}
interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: ISpeechRecognitionResult;
}
interface ISpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: ISpeechRecognitionResultList;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((e: ISpeechRecognitionEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
interface ISpeechRecognitionCtor {
  new (): ISpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition?: ISpeechRecognitionCtor;
    webkitSpeechRecognition?: ISpeechRecognitionCtor;
  }
}

interface VoiceButtonProps {
  /** Called with the final transcript when speech ends */
  onResult: (transcript: string) => void;
  /** Called while the user is still speaking (interim) — optional */
  onInterim?: (interim: string) => void;
  disabled?: boolean;
  className?: string;
}

const SUPPORTED =
  typeof window !== "undefined" &&
  !!(window.SpeechRecognition || window.webkitSpeechRecognition);

type State = "idle" | "listening" | "error";

export default function VoiceButton({
  onResult,
  onInterim,
  disabled = false,
  className = "",
}: VoiceButtonProps) {
  const [state, setState] = useState<State>("idle");
  const [interim, setInterim] = useState("");
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setState("idle");
    setInterim("");
  }, []);

  const startListening = useCallback(() => {
    if (!SUPPORTED) return;

    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SRClass();
    rec.lang = "en-IN"; // good default for India; user can change
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => {
      setState("listening");
      setInterim("");
    };

    rec.onresult = (e: ISpeechRecognitionEvent) => {
      let finalText = "";
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const part = e.results[i][0].transcript;
        if (e.results[i].isFinal) finalText += part;
        else interimText += part;
      }
      if (interimText) {
        setInterim(interimText);
        onInterim?.(interimText);
      }
      if (finalText) {
        setInterim(finalText);
        onResult(finalText.trim());
        setTimeout(() => {
          setState("idle");
          setInterim("");
        }, 400);
      }
    };

    rec.onerror = () => {
      setState("error");
      setTimeout(() => setState("idle"), 2000);
    };

    rec.onend = () => {
      if (state === "listening") setState("idle");
      setInterim("");
    };

    recognitionRef.current = rec;
    rec.start();
  }, [onResult, onInterim, state]);

  const handleClick = () => {
    if (!SUPPORTED) return;
    if (state === "listening") {
      stopListening();
    } else {
      startListening();
    }
  };

  const isListening = state === "listening";
  const isError = state === "error";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !SUPPORTED}
      aria-label={isListening ? "Stop listening" : "Start voice input"}
      title={
        !SUPPORTED
          ? "Voice input not supported in this browser"
          : isListening
          ? "Tap to stop"
          : "Tap to speak"
      }
      className={[
        "inline-flex items-center gap-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "px-3 py-2 text-sm font-semibold",
        isListening
          ? "bg-red-500 text-white"
          : isError
          ? "bg-orange-500 text-white"
          : "bg-secondary text-secondary-foreground hover:opacity-90",
        (disabled || !SUPPORTED)
          ? "opacity-50 cursor-not-allowed"
          : "cursor-pointer",
        className,
      ].join(" ")}
    >
      {isListening ? (
        // Sound-bar visualiser (4 bars)
        <span className="flex items-end gap-[2px] h-3">
          <span className="w-[2px] h-full rounded-full bg-white origin-bottom animate-voice-bar-1" />
          <span className="w-[2px] h-full rounded-full bg-white origin-bottom animate-voice-bar-2" />
          <span className="w-[2px] h-full rounded-full bg-white origin-bottom animate-voice-bar-3" />
          <span className="w-[2px] h-full rounded-full bg-white origin-bottom animate-voice-bar-4" />
        </span>
      ) : isError ? (
        <MicOff size={16} />
      ) : (
        <Mic size={16} />
      )}
    </button>
  );
}
