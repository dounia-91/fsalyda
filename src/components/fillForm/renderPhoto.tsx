import { FormItemDetails, FormState } from "@/types/types";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  setFormState: (state: FormState) => void;
  preview?: boolean;
};

export default function RenderPhoto({ itemD, formState, setFormState, preview = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  // Crée les URLs des fichiers pour affichage
  useEffect(() => {
    if (preview) {
      const storedPhotos = formState[itemD.newTitle];
      if (Array.isArray(storedPhotos) && storedPhotos.length > 0) {
        const urls = storedPhotos.map((photo: Blob | string) =>
          typeof photo === "string" ? photo : URL.createObjectURL(photo)
        );
        setPhotoUrls(urls);

        return () => {
          urls.forEach((url) => URL.revokeObjectURL(url));
          setPhotoUrls([]);
        };
      }
    } else {
      setPhotoUrls([]);
    }
  }, [formState, itemD.newTitle, preview]);

  // Validation des fichiers uploadés
  const validateFiles = (files: File[]) => {
    const maxSize = (itemD.maxPicSize ?? 2) * 1024 * 1024; // en octets
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (itemD.multiplePics) {
      if (files.length < (itemD.minPics ?? 1)) {
        toast.error(`Minimum ${itemD.minPics} photos doivent être téléchargées.`);
        return false;
      }
      if (files.length > (itemD.maxPics ?? 10)) {
        toast.error(`Maximum ${itemD.maxPics} photos autorisées.`);
        return false;
      }
    } else if (files.length > 1) {
      toast.error("Seul un fichier est autorisé.");
      return false;
    }
    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`Fichier ${file.name} trop volumineux. Max ${itemD.maxPicSize}MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Fichier ${file.name} n'est pas une image valide.`);
        return false;
      }
    }
    return true;
  };

  // Gestion du changement de fichier (upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (!validateFiles(files)) return;

    // Renommer les fichiers uploadés (optionnel)
    const renamedFiles = files.map((file, i) => {
      const newName = itemD.multiplePics ? `Uploaded_File_${(formState[itemD.newTitle]?.length ?? 0) + i + 1}` : "Uploaded_File";
      const blob = new Blob([file], { type: file.type });
      return new File([blob], newName, { type: file.type });
    });

    // Mettre à jour l'état en fonction du mode multiple ou simple
    setFormState({
      ...formState,
      [itemD.newTitle]: itemD.multiplePics
        ? [...(formState[itemD.newTitle] ?? []), ...renamedFiles]
        : renamedFiles,
    });
  };

  // Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!validateFiles(droppedFiles)) return;

    const renamedFiles = droppedFiles.map((file, i) => {
      const newName = itemD.multiplePics ? `Uploaded_File_${(formState[itemD.newTitle]?.length ?? 0) + i + 1}` : "Uploaded_File";
      const blob = new Blob([file], { type: file.type });
      return new File([blob], newName, { type: file.type });
    });

    setFormState({
      ...formState,
      [itemD.newTitle]: itemD.multiplePics
        ? [...(formState[itemD.newTitle] ?? []), ...renamedFiles]
        : renamedFiles,
    });
  };

  // Click sur la zone pour ouvrir la sélection fichier
  const handleClick = () => fileInputRef.current?.click();

  // Supprimer une photo de la liste
  const handleRemovePhoto = (index: number) => {
    if (!Array.isArray(formState[itemD.newTitle])) return;
    const newFiles = [...(formState[itemD.newTitle] as File[])];
    newFiles.splice(index, 1);
    setFormState({
      ...formState,
      [itemD.newTitle]: newFiles,
    });
  };

  return (
    <div className="w-full flex flex-col items-start space-y-2">
      <p className={`font-semibold text-${itemD.newColor} ${
          itemD.size === "smaller" ? "text-md" : itemD.size === "normal" ? "text-lg" : "text-xl"
        }`}>
        {itemD.newTitle} :
      </p>

      {preview ? (
        <div className="w-full bg-white rounded-lg p-2 flex flex-wrap justify-center gap-5">
          {photoUrls.length > 0 ? (
            photoUrls.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt={`Photo uploadée ${idx + 1}`}
                className="max-w-[150px] max-h-[150px] object-cover rounded-lg"
              />
            ))
          ) : (
            <p className="text-gray-500">Aucune photo disponible</p>
          )}
        </div>
      ) : (
        <div>
          <input
            type="file"
            multiple={itemD.multiplePics}
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <div
            className="drop-zone w-full h-40 bg-gray-100 p-2 rounded-lg overflow-auto cursor-pointer"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {Array.isArray(formState[itemD.newTitle]) && formState[itemD.newTitle].length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {(formState[itemD.newTitle] as File[]).map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-[150px] h-[150px] object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">Glissez et déposez les fichiers ici ou cliquez pour sélectionner</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
