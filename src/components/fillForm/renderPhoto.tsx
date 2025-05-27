import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FormItemDetails, FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderPhoto({ itemD, formState, setFormState, preview }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSize = itemD.maxPicSize! * 1024 * 1024; // Octets
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  const fieldName = itemD.newTitle;

  // Nettoyage des URL créées
  useEffect(() => {
    return () => {
      const files = formState[fieldName] as File[] | undefined;
      files?.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [formState[fieldName]]);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const validateFiles = (files: File[]) => {
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
      toast.error("Un seul fichier est autorisé.");
      return false;
    }

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} est trop volumineux. Max : ${itemD.maxPicSize}MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Fichier ${file.name} invalide (jpeg, png, gif uniquement).`);
        return false;
      }
    }
    return true;
  };

  const renameFiles = (files: File[], baseName: string): File[] => {
    return files.map((file, i) => {
      const renamed = new File([file], `${baseName}${files.length > 1 ? `_${i + 1}` : ""}`, { type: file.type });
      (renamed as any).preview = URL.createObjectURL(renamed);
      return renamed;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (!validateFiles(droppedFiles)) return;
    const renamed = renameFiles(droppedFiles, "Uploaded_File");

    setFormState((prev) => ({
      ...prev,
      [fieldName]: itemD.multiplePics
        ? [...(prev[fieldName] as File[] ?? []), ...renamed]
        : renamed,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    e.target.value = ""; // permet re-upload même fichier
    if (!validateFiles(files)) return;

    const renamed = renameFiles(files, "Uploaded_File");

    setFormState((prev) => ({
      ...prev,
      [fieldName]: itemD.multiplePics
        ? [...(prev[fieldName] as File[] ?? []), ...renamed]
        : renamed,
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormState((prev) => {
      const currentFiles = [...(prev[fieldName] as File[] ?? [])];
      URL.revokeObjectURL((currentFiles[index] as any).preview);
      currentFiles.splice(index, 1);
      return {
        ...prev,
        [fieldName]: renameFiles(currentFiles, "Uploaded_File"),
      };
    });
  };

  const titleSize =
    itemD.size === "smaller" ? "text-md" : itemD.size === "normal" ? "text-lg" : "text-xl";

  return (
    <div className="w-full flex flex-col items-start space-y-2">
      <p className={`font-bold ${titleSize} text-${itemD.newColor}`}>
        {itemD.newTitle} :
      </p>

      {preview ? (
        <div className="w-full bg-white rounded-lg p-2 flex flex-wrap justify-center gap-5">
          {(formState[fieldName] as string[] ?? []).map((url, idx) => (
            <Image key={idx} src={url} alt={`Uploaded Photo ${idx + 1}`} width={400} height={400} />
          ))}
        </div>
      ) : (
        <div className="file-upload space-y-2">
          <input
            type="file"
            multiple={itemD.multiplePics}
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/jpeg,image/png,image/gif"
          />
          <div
            className="drop-zone w-full h-40 bg-gray-100 p-2 rounded-lg overflow-auto cursor-pointer"
            onClick={handleClick}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {(formState[fieldName] as File[] ?? []).length > 0 ? (
              <div className="flex flex-wrap gap-5 p-2">
                {(formState[fieldName] as File[]).map((file, idx) => (
                  <div key={idx} className="relative w-[150px] h-auto">
                    <Image
                      src={(file as any).preview}
                      alt={file.name}
                      width={150}
                      height={150}
                      className="rounded"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(idx);
                      }}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      aria-label={`Supprimer le fichier ${file.name}`}
                      title={`Supprimer ${file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-600">Déposez des fichiers ici ou cliquez pour sélectionner</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
