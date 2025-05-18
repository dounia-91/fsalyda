import React, { useRef } from "react";
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

  // Ouvre la sélection de fichiers
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Validation des fichiers (taille, type, nombre)
  const validateFiles = (files: File[]): boolean => {
    const maxSize = itemD.maxPicSize! * 1024 * 1024; // en octets
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
    } else {
      if (files.length > 1) {
        toast.error("Un seul fichier est autorisé.");
        return false;
      }
    }

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`Le fichier ${file.name} est trop volumineux. Taille max : ${itemD.maxPicSize}MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Le fichier ${file.name} doit être une image valide (jpeg, png, gif).`);
        return false;
      }
    }
    return true;
  };

  // Renommer fichiers en conservant le contenu, utile pour l’affichage et gestion interne
  const renameFiles = (files: File[], baseName: string): File[] => {
    return files.map((file, i) => new File([file], `${baseName}${files.length > 1 ? `_${i + 1}` : ""}`, { type: file.type }));
  };

  // Handler drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);

    if (!validateFiles(droppedFiles)) return;

    const renamedFiles = renameFiles(droppedFiles, "Uploaded_File");

    if (itemD.multiplePics) {
      setFormState(prev => ({
        ...prev,
        [itemD.newTitle]: [...(prev[itemD.newTitle] as File[] ?? []), ...renamedFiles],
      }));
    } else {
      setFormState(prev => ({ ...prev, [itemD.newTitle]: renamedFiles }));
    }
  };

  // Handler changement input fichiers multiples
  const handleMFIC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!validateFiles(files)) return;

    const renamedFiles = renameFiles(files, "Uploaded_File");

    setFormState(prev => ({
      ...prev,
      [itemD.newTitle]: [...(prev[itemD.newTitle] as File[] ?? []), ...renamedFiles],
    }));
  };

  // Handler changement input fichier unique
  const handleSFIC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!validateFiles(files)) return;

    const renamedFiles = renameFiles(files, "Uploaded_File");

    setFormState(prev => ({ ...prev, [itemD.newTitle]: renamedFiles }));
  };

  // Supprimer un fichier par index
  const handleRemoveFile = (index: number) => {
    setFormState(prev => {
      const currentFiles = [...(prev[itemD.newTitle] as File[] ?? [])];
      currentFiles.splice(index, 1);
      // Renommer après suppression pour garder une cohérence
      return {
        ...prev,
        [itemD.newTitle]: renameFiles(currentFiles, "Uploaded_File"),
      };
    });
  };

  return (
    <div className="w-full flex flex-col items-start justify-start space-y-2">
      <p
        className={`font-bold ${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        } text-${itemD.newColor}`}
      >
        {itemD.newTitle} :
      </p>

      {preview ? (
        <div className="w-full bg-white rounded-lg p-2 flex flex-wrap justify-center gap-5">
          {(formState[itemD.newTitle] as string[] ?? []).map((url, idx) => (
            <Image key={idx} src={url} alt={`Uploaded Photo ${idx + 1}`} width={400} height={400} />
          ))}
        </div>
      ) : (
        <div className="file-upload space-y-2">
          <input
            type="file"
            multiple={itemD.multiplePics}
            onChange={itemD.multiplePics ? handleMFIC : handleSFIC}
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/jpeg,image/png,image/gif"
          />
          <div
            className="drop-zone w-full h-40 bg-gray-100 p-2 rounded-lg overflow-scroll cursor-pointer"
            onClick={handleClick}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
          >
            {(formState[itemD.newTitle] as File[] ?? []).length > 0 ? (
              <div>
                <span>Déposez des fichiers ici ou cliquez pour sélectionner</span>
                <div className="flex flex-wrap gap-5 p-2">
                  {(formState[itemD.newTitle] as File[]).map((file, idx) => (
                    <div key={idx} className="relative w-[150px] h-auto">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-auto rounded"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                        aria-label={`Supprimer ${file.name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <span>Déposez des fichiers ici ou cliquez pour sélectionner</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
