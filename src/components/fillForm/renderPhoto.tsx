import { FormItemDetails } from "@/types/types";
import { useEffect, useState } from "react";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderPhoto({
  itemD,
  formState,
  preview,
  setFormState,
}: Props) {
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  useEffect(() => {
    if (preview) {
      const storedPhotos = formState[itemD.newTitle];
      if (Array.isArray(storedPhotos) && storedPhotos.length > 0) {
        // Si les photos sont des fichiers Blob, créer des URLs
        const urls = storedPhotos.map((photo: Blob | string) => {
          if (typeof photo === "string") return photo; // si URL déjà string
          return URL.createObjectURL(photo);
        });
        setPhotoUrls(urls);
      } else {
        setPhotoUrls([]);
      }
    }
    // Nettoyer les URLs quand le composant se démonte
    return () => {
      photoUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [formState, itemD.newTitle, preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFormState((prev) => ({
      ...prev,
      [itemD.newTitle]: files,
    }));
    const urls = files.map((file) => URL.createObjectURL(file));
    setPhotoUrls(urls);
  };

  return (
    <div className="w-full flex flex-col items-start space-y-2">
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
        <div className="flex flex-wrap gap-2">
          {photoUrls.length > 0 ? (
            photoUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`photo-preview-${idx}`}
                className="max-w-[150px] max-h-[150px] object-cover rounded-lg"
              />
            ))
          ) : (
            <p className="text-gray-500">Aucune photo disponible</p>
          )}
        </div>
      ) : (
        <input
          type="file"
          multiple={itemD.photoMultipleSelection}
          accept="image/*"
          onChange={handleFileChange}
          className="border p-1 rounded-md"
        />
      )}
    </div>
  );
}
