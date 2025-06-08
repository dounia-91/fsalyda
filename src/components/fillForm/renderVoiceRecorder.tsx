import { useEffect, useRef, useState } from "react";
import { FormItemDetails, FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderVoiceRecorder({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0); // durée en secondes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Format mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (
      !preview &&
      Array.isArray(formState[itemD.newTitle]) &&
      formState[itemD.newTitle].length > 0
    ) {
      const chunks = formState[itemD.newTitle] as Blob[];
      const blob = new Blob(chunks, { type: "audio/webm;codecs=opus" });
      const url = URL.createObjectURL(blob);
      setRecordedChunks(chunks);
      setAudioUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [formState, itemD.newTitle, preview]);

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "audio/webm;codecs=opus" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setFormState((prev) => ({
        ...prev,
        [itemD.newTitle]: recordedChunks,
      }));
      return () => URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
        clearInterval(intervalRef.current!);
        setRecordingTime(0);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      // Démarrage du timer
      setRecordingTime(0);
      intervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Erreur d'accès au micro :", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    // clearInterval sera appelé dans onstop du recorder
  };

  const deleteRecording = () => {
    setRecordedChunks([]);
    setAudioUrl("");
    setFormState((prev) => ({
      ...prev,
      [itemD.newTitle]: [],
    }));
    setRecordingTime(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const downloadRecording = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `${itemD.newTitle || "memo"}.webm`;
    a.click();
  };

  return (
    <div className="w-full flex flex-col items-start justify-start space-y-2">
      <p
        className={`w-full text-${itemD.newColor} ${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        }`}
      >
        {itemD.newTitle} :
      </p>

      {preview ? (
        <div>
          {typeof formState[itemD.newTitle] === "string" ? (
            <audio src={formState[itemD.newTitle] as string} controls />
          ) : null}
        </div>
      ) : (
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={startRecording}
              disabled={isRecording}
              className="p-2 rounded-lg text-white bg-green-500 disabled:bg-green-200 text-xl"
              title="Enregistrer"
            >
              🎤
            </button>
            <button
              type="button"
              onClick={stopRecording}
              disabled={!isRecording}
              className="p-2 rounded-lg text-white bg-red-500 disabled:bg-red-200 text-xl"
              title="Arrêter"
            >
              ⏹️
            </button>
            {/* Affichage durée */}
            {isRecording && (
              <span className="ml-2 font-mono text-lg">{formatTime(recordingTime)}</span>
            )}
            {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
          </div>

          {audioUrl && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={deleteRecording}
                className="p-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-black text-xl"
                title="Supprimer"
              >
                🗑️
              </button>
              <button
                type="button"
                onClick={downloadRecording}
                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xl"
                title="Télécharger"
              >
                ⬇️
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
