"use client";

import React, { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputProps {
  onResult: (text: string) => void;
  lang?: string;
}

export default function VoiceInput({ onResult, lang = "id-ID" }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = lang;

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            onResult(transcript);
          }
          setIsListening(false);
        };

        rec.onerror = (err: any) => {
          console.warn("Voice recognition error:", err);
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        setRecognition(rec);
      }
    }
  }, [lang, onResult]);

  if (!isSupported) return null;

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (err) {
        console.error("Failed to start recognition:", err);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`btn-premium flex-center ${isListening ? "pulse-red" : ""}`}
      style={{
        padding: "8px 12px",
        fontSize: "0.85rem",
        backgroundColor: isListening ? "#ef4444" : "var(--color-emerald-600)",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "var(--radius-md)"
      }}
      title={isListening ? "Merekam suara... Klik untuk berhenti" : "Input dengan Suara (Voice-to-Text)"}
    >
      {isListening ? <MicOff size={16} /> : <Mic size={16} />}
      <span>{isListening ? "Mendengarkan..." : "Dikte Suara"}</span>
    </button>
  );
}
