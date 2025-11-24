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
        <div className="w-full">
            <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto py-2 sm:py-4 px-4">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                        className="w-full rounded-full border border-slate-300 bg-slate-50 py-3 sm:py-4 pl-4 sm:pl-6 pr-24 sm:pr-28 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 shadow-md focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:bg-slate-50 disabled:text-slate-400 transition-all dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:placeholder:text-slate-500 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 dark:disabled:border-slate-700"
                    />
                    <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-2">
                        <VoiceRecorder onTranscript={handleVoiceTranscript} disabled={disabled} />
                        <button
                            type="submit"
                            disabled={disabled || !input.trim()}
                            className="rounded-full bg-slate-900 p-2.5 sm:p-3 text-white hover:bg-black disabled:bg-slate-400 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:scale-95"
                        >
                            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
