"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, AlertCircle, Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { transcribeAudio } from "@/lib/ai";

interface VoiceRecorderProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const recordingStartTimeRef = useRef<number | null>(null);
    const maxAudioLevelRef = useRef(0);
    const skipProcessingRef = useRef(false);
    const { language, t } = useLanguage();

    // Analyze audio input for visual feedback
    const analyzeAudio = (stream: MediaStream) => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 256;
        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateLevel = () => {
            if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(average);
                maxAudioLevelRef.current = Math.max(maxAudioLevelRef.current, average);
                animationFrameRef.current = requestAnimationFrame(updateLevel);
            }
        };

        updateLevel();
    };

    const startRecording = async () => {
        try {
            setError(null);
            skipProcessingRef.current = false;
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Reset audio level tracking before analysis
            maxAudioLevelRef.current = 0;

            // Start audio analysis
            analyzeAudio(stream);

            // Use webm format with opus codec for better compatibility and smaller size
            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';

            const mediaRecorder = new MediaRecorder(stream, { mimeType });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const cleanupAfterStop = async () => {
                    stream.getTracks().forEach((track) => track.stop());
                    if (animationFrameRef.current) {
                        cancelAnimationFrame(animationFrameRef.current);
                        animationFrameRef.current = null;
                    }
                    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
                        await audioContextRef.current.close();
                        audioContextRef.current = null;
                    }
                };

                if (skipProcessingRef.current) {
                    await cleanupAfterStop();
                    setIsProcessing(false);
                    setAudioLevel(0);
                    skipProcessingRef.current = false;
                    return;
                }

                const audioBlob = new Blob(chunksRef.current, { type: mimeType });
                await cleanupAfterStop();

                // Use the loudest sample observed during the session to confirm the user actually spoke.
                // Normalizing the max level keeps the heuristic stable across devices.
                const normalizedPeakLevel = Math.min(maxAudioLevelRef.current / 100, 1);

                // Check if audio blob is too small (likely no speech)
                // Require both a tiny payload and barely any audio energy before rejecting the attempt.
                // This prevents false-negatives on quiet environments while still blocking empty inputs.
                const noSpeechDetected =
                    audioBlob.size < 1000 && normalizedPeakLevel < 0.08;

                if (noSpeechDetected) {
                    setError(language === "ja" ? "音声が検出されませんでした。もう一度お試しください。" : "No speech detected. Please try again.");
                    setIsRecording(false);
                    setIsProcessing(false);
                    setAudioLevel(0);
                    return;
                }

                // Process the audio
                setIsProcessing(true);
                try {
                    const transcript = await transcribeAudio(audioBlob, language);

                    // Validate transcript
                    if (!transcript || transcript.trim().length === 0) {
                        setError(language === "ja" ? "音声を認識できませんでした。もう一度お試しください。" : "Could not recognize speech. Please try again.");
                        return;
                    }

                    // Check if transcript is too short or seems invalid
                    if (transcript.trim().length < 2) {
                        setError(language === "ja" ? "音声が短すぎます。もう一度はっきりと話してください。" : "Speech too short. Please speak clearly.");
                        return;
                    }

                    onTranscript(transcript);
                } catch (err) {
                    console.error("Transcription error:", err);
                    setError(language === "ja" ? "音声の文字起こしに失敗しました。もう一度お試しください。" : "Failed to transcribe audio. Please try again.");
                } finally {
                    setIsProcessing(false);
                    setAudioLevel(0);
                }
            };

            mediaRecorder.start();
            recordingStartTimeRef.current = Date.now();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError(t("permissionDenied"));
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            // Check minimum recording duration (at least 500ms)
            const recordingDuration = recordingStartTimeRef.current
                ? Date.now() - recordingStartTimeRef.current
                : 0;

            if (recordingDuration < 500) {
                setError(
                    language === "ja"
                        ? "録音時間が短すぎます。もう一度お試しください。"
                        : "Recording too short. Please try again."
                );
                skipProcessingRef.current = true;
                mediaRecorderRef.current.stop();
                setIsRecording(false);
                return;
            }

            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.stop();
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().catch(console.error);
                audioContextRef.current = null;
            }
        };
    }, [isRecording]);

    const errorDialog = error ? (
        <div
            className="fixed inset-x-0 top-6 z-[100000] flex justify-center px-4"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex w-full max-w-md items-start gap-4 rounded-3xl border border-slate-300 bg-white/90 p-4 shadow-lg shadow-slate-500/10 backdrop-blur">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-800">
                    <AlertCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">
                        {language === "ja" ? "エラー" : "Error"}
                    </p>
                    <p className="text-sm text-slate-600 mt-0.5">{error}</p>
                </div>
                <button
                    onClick={() => {
                        setError(null);
                        setIsRecording(false);
                        setIsProcessing(false);
                    }}
                    className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-slate-800"
                >
                    {language === "ja" ? "閉じる" : "Close"}
                </button>
            </div>
        </div>
    ) : null;

    const recordingOverlay = (isRecording || isProcessing) ? (
        <>
            <style jsx global>{`
        body {
          overflow: hidden !important;
        }
      `}</style>

            {/* Backdrop */}
            <div className="fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm animate-fade-in" />

            {/* Dynamic Island / Recording UI */}
            <div className="fixed bottom-8 left-4 right-4 z-[99999] flex justify-center pointer-events-none animate-slide-up">
                <div className="pointer-events-auto w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl ring-1 ring-black/5">
                    <div className="flex flex-col items-center gap-6">

                        {/* Status & Visualizer */}
                        <div className="flex items-center justify-between w-full px-2">
                            <div className="flex items-center gap-4">
                                <div className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300 ${isRecording ? 'bg-black' : 'bg-slate-100'
                                    }`}>
                                    {isRecording ? (
                                        <>
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-black opacity-20"></span>
                                            <Mic className="h-6 w-6 text-white relative z-10" />
                                        </>
                                    ) : (
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
                                    )}
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">
                                        {isRecording ? t("voiceRecording") : t("voiceProcessing")}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                        {isRecording
                                            ? (language === "ja" ? "日本語・English 対応" : "Speak now...")
                                            : (language === "ja" ? "処理中..." : "Processing...")}
                                    </span>
                                </div>
                            </div>

                            {/* Mini Waveform */}
                            {isRecording && (
                                <div className="flex items-center gap-1 h-8">
                                    {[...Array(5)].map((_, i) => {
                                        const normalizedLevel = Math.min(audioLevel / 100, 1);
                                        return (
                                            <div
                                                key={i}
                                                className="w-1 bg-black rounded-full transition-all duration-75"
                                                style={{
                                                    height: `${8 + (normalizedLevel * 24 * Math.random())}px`,
                                                    opacity: 0.5 + (normalizedLevel * 0.5)
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        {isRecording && (
                            <button
                                onClick={stopRecording}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-black py-4 text-white font-semibold shadow-lg shadow-black/30 hover:bg-slate-900 active:scale-95 transition-all"
                            >
                                <Square className="h-5 w-5 fill-current" />
                                {language === "ja" ? "録音を停止" : "Stop Recording"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    ) : null;

    return (
        <>
            {errorDialog}
            {recordingOverlay}

            <button
                type="button"
                onClick={startRecording}
                disabled={disabled || isRecording || isProcessing}
                className="rounded-full p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 hover:scale-110"
                title={language === "ja" ? "クリックして話す (日本語・English対応)" : "Click to speak (Japanese & English supported)"}
                aria-label={t("clickToSpeak")}
            >
                <Mic className="h-5 w-5" />
            </button>
        </>
    );
}
