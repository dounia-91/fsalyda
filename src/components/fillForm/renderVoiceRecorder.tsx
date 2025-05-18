import { FormItemDetails } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { FormState } from "@/types/types";

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
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Lorsqu'on reçoit un état en preview, créer l'URL audio
  useEffect(() => {
    if (preview) {
      const storedAudio = formState[itemD.newTitle];
      if (storedAudio instanceof Blob) {
        // Si c'est un Blob direct (cas idéal)
        const url = URL.createObjectURL(storedAudio);
        setAudioUrl(url);
      } else if (Array.isArray(storedAudio) && storedAudio.length > 0) {
        // Si c'est un tableau de Blob (exemple enregistré en chunks)
        const blob = new Blob(storedAudio, { type: "audio/webm;codecs=opus" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else if (typeof storedAudio === "string") {
        // Si c'est déjà une URL string
        setAudioUrl(storedAudio);
      } else {
        setAudioUrl("");
      }
    }
  }, [formState, itemD.newTitle, preview]);

  // Nettoyer l'URL audio pour éviter les fuites mémoire
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      setIsRecording(true);
      setRecordedChunks([]); // Reset chunks au début de l'enregistrement
      mediaRecorderRef.current.start();

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setRecordedChunks((prev) => [...prev, e.data]);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(recordedChunks, { type: "audio/webm;codecs=opus" });
        setAudioUrl(URL.createObjectURL(blob));
        setFormState((prev) => ({
          ...prev,
          [itemD.newTitle]: blob,
        }));
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
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
        } font-semibold`}
      >
        {itemD.newTitle} :
      </p>
      {preview ? (
        <div>
          {audioUrl ? (
            <audio ref={audioRef} src={audioUrl} controls />
          ) : (
            <p className="text-gray-500">Aucun enregistrement audio disponible</p>
          )}
        </div>
      ) : (
        <div className="w-full flex items-center justify-start space-x-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className="p-2 rounded-lg text-white bg-green-500 disabled:bg-green-200"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={stopRecording}
            disabled={!isRecording}
            className="p-2 rounded-lg text-white bg-red-500 disabled:bg-red-200"
          >
            Arrêter
          </button>
          {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
        </div>
      )}
    </div>
  );
}
