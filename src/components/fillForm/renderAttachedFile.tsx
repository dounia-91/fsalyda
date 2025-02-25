import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";
import { useRef } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import Link from "next/link";

type Props = {
  itemD: FormItemDetails;
  preview?: boolean;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderAttachedFile({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (validateFiles(droppedFiles)) {
      const newFiles = [...droppedFiles];
      droppedFiles.forEach((file, index) => {
        const newName =
          droppedFiles.length === 1
            ? "Uploaded File"
            : `Uploaded File ${
                (formState[itemD.newTitle] as File[])?.length + index + 1
              }`;
        const blob = new Blob([file], { type: file.type });
        newFiles.splice(
          index,
          1,
          new File([blob], newName, { type: file.type })
        );
      });
      if (itemD.multipleAttachments) {
        setFormState({
          ...formState,
          [itemD.newTitle]: [
            ...(formState[itemD.newTitle] as File[]),
            ...newFiles,
          ],
        });
      } else {
        setFormState({
          ...formState,
          [itemD.newTitle]: [...newFiles],
        });
      }
    }
  };
  const handleMFIC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const droppedFiles = Array.from(e.target.files!);
    if (validateFiles(droppedFiles)) {
      const newFiles = [...droppedFiles];
      droppedFiles.forEach((file, index) => {
        const newName = `Uploaded_File_${
          (formState[itemD.newTitle] as File[])?.length + index + 1
        }`;
        const blob = new Blob([file], { type: file.type });
        newFiles.splice(
          index,
          1,
          new File([blob], newName, { type: file.type })
        );
      });
      setFormState({
        ...formState,
        [itemD.newTitle]: [
          ...(formState[itemD.newTitle] as File[]),
          ...newFiles,
        ],
      });
    }
  };
  const handleSFIC = (e: React.ChangeEvent<HTMLInputElement>) => {
    const droppedFiles = Array.from(e.target.files!);
    if (validateFiles(droppedFiles)) {
      const newName = `Uploaded_File`;
      const blob = new Blob([droppedFiles[0]], { type: droppedFiles[0].type });
      droppedFiles[0] = new File([blob], newName, {
        type: droppedFiles[0].type,
      });
      setFormState({
        ...formState,
        [itemD.newTitle]: [...droppedFiles],
      });
    }
  };
  const validateFiles = (files: File[]): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    if (!itemD.multipleAttachments && files.length > 1) {
      toast("Only 1 file upload is allowed", { type: "error" });
      return false;
    }
    for (const file of files) {
      if (file.size > maxSize) {
        toast(`File ${file.name} is too large. Maximum size is 2MB.`, {
          type: "error",
        });
        return false;
      }
    }
    return true;
  };
  return (
    <div className="w-full flex flex-col items-start justify-start space-y-2">
      <p
        className={`${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        } font-bold text-${itemD.newColor}`}
      >
        {itemD.newTitle} :
      </p>
      {preview ? (
        <ul className="w-full bg-white rounded-lg p-2 flex flex-col space-y-1">
          {(formState[itemD.newTitle] as string[])?.map((url, index) => {
            return (
              <li
                key={index}
                className="w-full flex items-center justify-between border border-black rounded-lg p-1"
              >
                <Link href={url} target="_blank">
                  <span>{`Uploaded_file_${index + 1}`}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="file-upload space-y-2">
          {itemD.multipleAttachments ? (
            <input
              name="MultipleAttachedFileUpload"
              type="file"
              multiple
              onChange={handleMFIC}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          ) : (
            <input
              name="singleAttachedFileUpload"
              type="file"
              onChange={handleSFIC}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
          )}
          <div
            className="drop-zone w-full h-40 bg-gray-100 p-2 rounded-lg overflow-scroll"
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {(formState[itemD.newTitle] as File[]) ? (
              <div>
                <span>Drag and drop files here, or click to select files</span>
                <div className="flex items-center justify-center flex-wrap gap-5 p-2">
                  {(formState[itemD.newTitle] as File[]).map((file, index) => {
                    return (
                      <Image
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        width={100}
                        height={100}
                        className="w-[150px] h-auto"
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <span>Drag and drop files here, or click to select files</span>
            )}
          </div>
          <ul className="space-y-1">
            {(formState[itemD.newTitle] as File[])?.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between border border-black rounded-lg p-1"
              >
                <span>
                  {`${file.name} (${(file.size / 1024).toFixed(2)} KB)`}
                </span>
                <i
                  className="fa fa-trash"
                  onClick={() => {
                    const i = (formState[itemD.newTitle] as File[])?.indexOf(
                      file
                    );
                    const newFiles = [...(formState[itemD.newTitle] as File[])];
                    newFiles.splice(i, 1);
                    newFiles.forEach((file, ind) => {
                      const newName = `Uploaded File ${ind + 1}`;
                      const blob = new Blob([file], { type: file.type });
                      newFiles.splice(
                        ind,
                        1,
                        new File([blob], newName, { type: file.type })
                      );
                    });
                    setFormState({
                      ...formState,
                      [itemD.newTitle]: [...newFiles],
                    });
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
