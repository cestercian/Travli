import { Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { VoiceRecorder } from "./voice-recorder";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder = "Ask about the weather..." }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim() && !disabled) {
            onSend(input.trim());
            setInput("");
        }
    };

    const handleVoiceTranscript = (text: string) => {
        setInput(text);
        // Auto-submit after voice input
        if (text.trim() && !disabled) {
            onSend(text.trim());
            setInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className="w-full rounded-full border-2 border-slate-200 bg-white py-3 sm:py-4 pl-4 sm:pl-6 pr-24 sm:pr-28 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50 disabled:text-slate-400 transition-all"
                />
                <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-2">
                    <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={disabled} />
                    <button
                        type="submit"
                        disabled={disabled || !input.trim()}
                        className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 sm:p-3 text-white hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                        <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </form>
    );
}
