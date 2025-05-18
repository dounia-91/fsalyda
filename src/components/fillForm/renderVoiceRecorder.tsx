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
  const [audioUrl, setAudioUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (
      !preview &&
      (formState[itemD.newTitle] as Blob[]) &&
      (formState[itemD.newTitle] as Blob[]).length > 0
    ) {
      setRecordedChunks(formState[itemD.newTitle] as Blob[]);
      const blob = new Blob(recordedChunks, { type: "audio/webm;codecs=opus" });
      const audioUrl = URL.createObjectURL(blob);
      setAudioUrl(audioUrl);
    }
  }, [formState, itemD.newTitle, preview]);
  useEffect(() => {
    setRecordedChunks([]);
  }, [audioUrl]);
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm;codecs=opus",
      });
      setIsRecording(true);
      mediaRecorderRef.current.start(1000);
      mediaRecorderRef.current.ondataavailable = (e) => {
        setRecordedChunks((prevChunks) => [...prevChunks, e.data]);
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setFormState({ ...formState, [itemD.newTitle]: recordedChunks });
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
          {formState[itemD.newTitle] && (
            <audio src={formState[itemD.newTitle] as string} controls />
          )}
        </div>
      ) : (
        <div className="w-full flex items-center justify-start space-x-2">
          <button
            type="button"
            onClick={startRecording}
            disabled={isRecording}
            className={`p-2 rounded-lg text-white bg-green-500 disabled:bg-green-200`}
          >
            Record
          </button>
          <button
            type="button"
            onClick={stopRecording}
            disabled={!isRecording}
            className={`p-2 rounded-lg text-white bg-red-500 disabled:bg-red-200`}
          >
            Stop
          </button>
          {audioUrl && <audio ref={audioRef} src={audioUrl} controls />}
        </div>
      )}
    </div>
  );
}
