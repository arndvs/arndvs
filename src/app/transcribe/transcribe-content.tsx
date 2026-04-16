"use client";

import { Copy, Download, Lock, Mic, MicOff, RotateCcw, Upload } from "lucide-react";

import { useCallback, useEffect, useRef, useState } from "react";

import { type TranscribeApiSuccess, parseApiResponse } from "./transcribe-client-utils";

type Screen = "auth" | "main" | "transcribing" | "result";

function RecordingEqualizer() {
    return (
        <span className="ml-1 inline-flex items-end gap-0.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((index) => (
                <span
                    key={`eq-${index}`}
                    style={{
                        height: `${8 + (index % 3) * 3}px`,
                        animationDelay: `${index * 0.12}s`,
                    }}
                    className="w-0.5 animate-pulse rounded-full bg-current"
                />
            ))}
        </span>
    );
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / 1048576).toFixed(1)} MB`;
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);

    return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function TranscribeContent() {
    const [screen, setScreen] = useState<Screen>("auth");
    const [password, setPassword] = useState("");
    const [storedPassword, setStoredPassword] = useState("");
    const [error, setError] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [transcription, setTranscription] = useState("");
    const [summary, setSummary] = useState("");
    const [downloadName, setDownloadName] = useState("");
    const [copied, setCopied] = useState(false);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isDragOver, setIsDragOver] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    useEffect(() => {
        const saved = sessionStorage.getItem("transcribe_pw");
        if (saved) {
            setStoredPassword(saved);
            setScreen("main");
        }
    }, []);

    const handleLogin = useCallback(async () => {
        setError("");

        if (!password.trim()) {
            setError("Enter a passphrase");
            return;
        }

        try {
            const res = await fetch("/api/transcribe", {
                method: "POST",
                headers: {
                    "x-transcribe-password": password,
                    "x-transcribe-auth-check": "true",
                },
                body: new FormData(),
            });

            await parseApiResponse<{ success: boolean }>(res);

            sessionStorage.setItem("transcribe_pw", password);
            setStoredPassword(password);
            setScreen("main");
        } catch (err) {
            const message = err instanceof Error ? err.message : "Connection error";
            setError(message);
            if (message.toLowerCase().includes("unauthorized")) setPassword("");
        }
    }, [password]);

    const selectFile = useCallback((f: File) => {
        setFile(f);
        setError("");
    }, []);

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const f = e.target.files?.[0];
            if (f) selectFile(f);
        },
        [selectFile],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f) selectFile(f);
        },
        [selectFile],
    );

    const startRecording = useCallback(async () => {
        setError("");
        let stream: MediaStream | undefined;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4",
            });

            chunksRef.current = [];
            mediaRecorderRef.current = mediaRecorder;

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mediaRecorder.mimeType });
                const ext = mediaRecorder.mimeType.includes("webm") ? "webm" : "m4a";
                const recorded = new File([blob], `recording.${ext}`, {
                    type: mediaRecorder.mimeType,
                });

                selectFile(recorded);
                streamRef.current?.getTracks().forEach((t) => t.stop());

                if (timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
            };

            mediaRecorder.start(1000);
            setRecording(true);
            setRecordingTime(0);
            timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
        } catch {
            stream?.getTracks().forEach((t) => t.stop());
            setError("Microphone access denied");
        }
    }, [selectFile]);

    const stopRecording = useCallback(() => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    }, []);

    const transcribe = useCallback(async () => {
        if (!file) return;

        setError("");
        setScreen("transcribing");

        try {
            const formData = new FormData();
            formData.append("audio", file);

            const res = await fetch("/api/transcribe", {
                method: "POST",
                headers: { "x-transcribe-password": storedPassword },
                body: formData,
            });

            const data = await parseApiResponse<Partial<TranscribeApiSuccess>>(res);

            if (!data.text) throw new Error("Empty transcription");
            if (!data.summary) throw new Error("Missing transcription summary");
            if (!data.fileName) throw new Error("Missing transcription filename");

            setTranscription(data.text);
            setSummary(data.summary);
            setDownloadName(data.fileName);
            setScreen("result");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Transcription failed");
            setScreen("main");
        }
    }, [file, storedPassword]);

    const copyText = useCallback(async () => {
        await navigator.clipboard.writeText(transcription);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    }, [transcription]);

    const downloadTxt = useCallback(() => {
        const blob = new Blob([transcription], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");

        a.href = URL.createObjectURL(blob);
        a.download = downloadName || "transcription.txt";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, [downloadName, transcription]);

    const reset = useCallback(() => {
        setFile(null);
        setTranscription("");
        setSummary("");
        setDownloadName("");
        setError("");
        setRecordingTime(0);
        setScreen("main");
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const lock = useCallback(() => {
        sessionStorage.removeItem("transcribe_pw");
        setStoredPassword("");
        setPassword("");
        setFile(null);
        setTranscription("");
        setSummary("");
        setDownloadName("");
        setError("");
        setScreen("auth");
    }, []);

    return (
        <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* ── AUTH ── */}
                {screen === "auth" && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
                            <span className="text-foreground">Transcribe</span> / auth
                        </p>

                        <label
                            htmlFor="pass-input"
                            className="text-muted-foreground mb-2 block font-mono text-[11px] tracking-wider uppercase"
                        >
                            Passphrase
                        </label>
                        <input
                            id="pass-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleLogin();
                            }}
                            placeholder="enter passphrase"
                            autoComplete="current-password"
                            className="border-border bg-card text-foreground placeholder:text-muted-foreground/50 focus:border-ring mb-5 w-full rounded border px-3.5 py-3 font-mono text-sm transition-colors outline-none"
                        />

                        <button
                            type="button"
                            onClick={handleLogin}
                            className="bg-foreground text-background hover:bg-foreground/80 w-full rounded py-3 font-mono text-xs font-medium tracking-wider uppercase transition-colors"
                        >
                            Continue
                        </button>

                        {error && (
                            <p className="text-destructive mt-3 font-mono text-xs">{error}</p>
                        )}
                    </div>
                )}

                {/* ── MAIN ── */}
                {screen === "main" && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
                            <span className="text-foreground">Transcribe</span>
                        </p>

                        {/* drop zone */}
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => !recording && fileInputRef.current?.click()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !recording) fileInputRef.current?.click();
                            }}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragOver(true);
                            }}
                            onDragLeave={() => setIsDragOver(false)}
                            onDrop={handleDrop}
                            className={`bg-card mb-5 cursor-pointer rounded-md border border-dashed p-8 text-center transition-colors ${isDragOver ? "border-ring bg-card/80" : "border-border hover:border-muted-foreground/40"}`}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="audio/*,video/*,.mp3,.mp4,.m4a,.wav,.ogg,.webm,.flac,.aac"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Upload className="text-muted-foreground/40 mx-auto mb-3 size-7" />
                            <p className="text-muted-foreground font-mono text-xs">
                                <span className="text-foreground font-medium">
                                    Tap to choose audio
                                </span>{" "}
                                or drag here
                            </p>
                            {file && (
                                <p className="text-primary mt-2 font-mono text-xs break-all">
                                    {file.name} ({formatSize(file.size)})
                                </p>
                            )}
                        </div>

                        {/* record button */}
                        <button
                            type="button"
                            onClick={recording ? stopRecording : startRecording}
                            className={`mb-5 flex w-full items-center justify-center gap-2 rounded border py-3 font-mono text-xs tracking-wider uppercase transition-colors ${recording ? "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/20" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"}`}
                        >
                            {recording ? (
                                <>
                                    <MicOff className="size-3.5" />
                                    Stop Recording · {formatDuration(recordingTime)}
                                    <RecordingEqualizer />
                                </>
                            ) : (
                                <>
                                    <Mic className="size-3.5" />
                                    Record Audio
                                </>
                            )}
                        </button>

                        {/* transcribe button */}
                        <button
                            type="button"
                            onClick={transcribe}
                            disabled={!file || recording}
                            className="bg-foreground text-background hover:bg-foreground/80 disabled:bg-muted disabled:text-muted-foreground w-full rounded py-3 font-mono text-xs font-medium tracking-wider uppercase transition-colors disabled:cursor-not-allowed"
                        >
                            Transcribe
                        </button>

                        {error && (
                            <p className="text-destructive mt-3 font-mono text-xs">{error}</p>
                        )}

                        <div className="border-border mt-6 flex items-center justify-end border-t pt-4">
                            <button
                                type="button"
                                onClick={lock}
                                className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-mono text-[11px] transition-colors"
                            >
                                <Lock className="size-3" />
                                Lock
                            </button>
                        </div>
                    </div>
                )}

                {/* ── TRANSCRIBING ── */}
                {screen === "transcribing" && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
                            <span className="text-foreground">Transcribe</span> / processing
                        </p>

                        <div className="mb-4 flex items-center gap-2">
                            <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                            <span className="text-muted-foreground font-mono text-[11px]">
                                transcribing…
                            </span>
                        </div>

                        <div className="bg-border h-0.5 overflow-hidden rounded-full">
                            <div className="bg-foreground h-full w-2/5 animate-[slide_1.4s_ease-in-out_infinite] rounded-full" />
                        </div>
                    </div>
                )}

                {/* ── RESULT ── */}
                {screen === "result" && (
                    <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <p className="text-muted-foreground mb-8 font-mono text-xs tracking-widest uppercase">
                            <span className="text-foreground">Transcribe</span> / done
                        </p>

                        <div className="border-border bg-card text-muted-foreground mb-3 rounded-md border px-3 py-2 font-mono text-[11px] tracking-wide uppercase">
                            {summary} · {downloadName}
                        </div>

                        <div className="border-border bg-card text-foreground scrollbar-thin mb-4 max-h-[52vh] overflow-y-auto rounded-md border p-4 font-mono text-sm leading-relaxed">
                            {transcription}
                        </div>

                        <div className="mb-2 flex gap-2.5">
                            <button
                                type="button"
                                onClick={copyText}
                                className="bg-foreground text-background hover:bg-foreground/80 flex flex-1 items-center justify-center gap-2 rounded py-3 font-mono text-xs font-medium tracking-wider uppercase transition-colors"
                            >
                                <Copy className="size-3.5" />
                                {copied ? "Copied" : "Copy"}
                            </button>
                            <button
                                type="button"
                                onClick={downloadTxt}
                                className="border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground flex items-center justify-center gap-2 rounded border px-4 py-3 font-mono text-xs tracking-wider uppercase transition-colors"
                            >
                                <Download className="size-3.5" />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={reset}
                            className="border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground flex w-full items-center justify-center gap-2 rounded border py-3 font-mono text-xs tracking-wider uppercase transition-colors"
                        >
                            <RotateCcw className="size-3.5" />
                            Transcribe Another
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
