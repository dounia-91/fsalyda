import { useEffect, useRef, useState } from "react";
import { FormItemDetails, FormState } from "@/types/types";
import { uploadFileToS3 } from "@/lib/s3config";
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const getPresignedUrl = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: 'fsalyda-stockage-2025',
    Key: key,
  });
  return await getSignedUrl(s3 as any, command, { expiresIn: 3600 });
};

export default function RenderVoiceRecorder({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [s3Key, setS3Key] = useState<string | null>(null);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (
      !preview &&
      Array.isArray(formState[itemD.newTitle]) &&
      (formState[itemD.newTitle] as any[]).length > 0
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
    const value = formState[itemD.newTitle];
    if (typeof value === "string" && value.startsWith("https://")) {
      setAudioUrl(value);
    } else if (Array.isArray(value) && value.length > 0) {
      const blob = new Blob(value as Blob[], { type: "audio/webm;codecs=opus" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    }
  }, [formState, itemD.newTitle]);

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

      recorder.onstop = async () => {
        setRecordedChunks(chunks);
        clearInterval(intervalRef.current!);
        setRecordingTime(0);

        const blob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const key = `uploads/recording-${Date.now()}.webm`;
        try {
          await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: key,
            Body: blob,
          }));
          setS3Key(key);
        } catch (err) {
          console.error('Failed to upload to S3:', err);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);

      setRecordingTime(0);
      intervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (error) {
      console.error("Erreur d'accès au micro :", error);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const fetchFromS3 = async (key: string) => {
    try {
      const response = await s3.send(new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
      }));
      const blob = await response.Body?.transformToByteArray();
      if (blob) {
        const url = URL.createObjectURL(new Blob([blob], { type: 'audio/webm;codecs=opus' }));
        setAudioUrl(url);
      }
    } catch (err) {
      console.error('Failed to fetch from S3:', err);
    }
  };

  useEffect(() => {
    if (s3Key) {
      fetchFromS3(s3Key);
    }
  }, [s3Key]);

  const deleteRecording = () => {
    setRecordedChunks([]);
    setAudioUrl(null);
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
      <p className={`w-full text-${itemD.newColor} ${itemD.size === "smaller"
        ? "text-md"
        : itemD.size === "normal"
          ? "text-lg"
          : "text-xl"
        }`}>
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
