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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 🟢 Charger un enregistrement existant dans le formState
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

      return () => URL.revokeObjectURL(url); // nettoyage
    }
  }, [formState, itemD.newTitle, preview]);

  // 🟢 Quand `recordedChunks` change, mettre à jour l’URL audio
  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "audio/webm;codecs=opus" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Enregistrer dans formState
      setFormState((prev) => ({
        ...prev,
        [itemD.newTitle]: recordedChunks,
      }));

      return () => URL.revokeObjectURL(url); // nettoyer
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
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error("Erreur d'accès au micro :", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
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
        <div className="w-full flex items-center justify-start space-x-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="p-2 rounded-lg text-white bg-green-500 disabled:bg-green-200"
          >
            Record
          </button>
          <button
            type="button"
            onClick={stopRecording}
            disabled={!isRecording}
            className="p-2 rounded-lg text-white bg-red-500 disabled:bg-red-200"
          >
            Stop
          </button>
          {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
        </div>
      )}
    </div>
  );
}
