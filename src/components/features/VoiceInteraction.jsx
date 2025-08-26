import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceInteraction({ onVoiceCommand, onTranscriptChange }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true);
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        onTranscriptChange?.(fullTranscript);

        if (finalTranscript) {
          onVoiceCommand?.(finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check if speech synthesis is supported
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [onVoiceCommand, onTranscriptChange]);

  const toggleListening = () => {
    if (!isSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      setTranscript("");
    }
  };

  const speakText = (text) => {
    if (!synthRef.current) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MicOff className="h-5 w-5" />
            Voice Interaction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Voice interaction is not supported in your browser. Please use
            Chrome, Edge, or Safari for voice features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Voice Interaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Voice Recording Section */}
        <div className="text-center space-y-4">
          <Button
            onClick={toggleListening}
            size="lg"
            variant={isListening ? "destructive" : "default"}
            className={cn(
              "w-20 h-20 rounded-full transition-all",
              isListening && "animate-pulse"
            )}
          >
            {isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>

          <div className="space-y-2">
            <Badge variant={isListening ? "default" : "secondary"}>
              {isListening ? "Listening..." : "Ready to listen"}
            </Badge>

            {isListening && (
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-100"
                  style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="space-y-2">
            <h3 className="font-medium">Transcript:</h3>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">{transcript}</p>
            </div>
          </div>
        )}

        {/* Text-to-Speech Section */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-medium">Text-to-Speech</h3>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                speakText("How can I help you with your legal questions today?")
              }
              disabled={isSpeaking}
              variant="outline"
              size="sm"
            >
              {isSpeaking ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Sample Response
            </Button>

            {isSpeaking && (
              <Button onClick={stopSpeaking} variant="destructive" size="sm">
                <VolumeX className="h-4 w-4" />
                Stop
              </Button>
            )}
          </div>

          {isSpeaking && (
            <Badge variant="secondary" className="w-fit">
              <Volume2 className="h-3 w-3 mr-1" />
              Speaking...
            </Badge>
          )}
        </div>

        {/* Quick Commands */}
        <div className="space-y-3 border-t pt-4">
          <h3 className="font-medium text-sm">Quick Voice Commands:</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Upload document",
              "Check deadlines",
              "Compare documents",
              "Risk analysis",
            ].map((command) => (
              <Button
                key={command}
                variant="outline"
                size="sm"
                onClick={() => onVoiceCommand?.(command)}
                className="text-xs"
              >
                "{command}"
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
