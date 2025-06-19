import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { deleteFileFromS3 } from "@/lib/s3config";

interface FileUploadProps {
  imgFiles: File[];
  setImgFiles: (imgFiles: File[]) => void;
}

// Define a type to hold both File and its S3 key
interface UploadedFile {
  file: File;
  s3Key: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ imgFiles, setImgFiles }) => {


  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);


  //   const url = "https://fsalyda-stockage-2025.s3.amazonaws.com/uploads/e7f1e134-158b-4580-92a9-b45ea08412a2_Uploaded_Image_1";
  // const filename = "Uploaded_Image_1.jpg"; // or .png, .gif, etc.
  // const mimeType = "image/jpeg"; // set the correct type


  async function urlToFile(key: string, filename: string, mimeType: string, s3Key: string): Promise<UploadedFile> {
    try {
      const response = await fetch(`https://fsalyda-stockage-2025.s3.amazonaws.com/${key}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }
      const blob = await response.blob();
      const file = new File([blob], filename, { type: mimeType });
      return { file, s3Key };
    } catch (err) {
      console.error("Failed to fetch or convert file:", err);
      // Optionally, you can return a placeholder File or handle this differently
      throw err;
    }
  }

  useEffect(() => {
    // If imgFiles is an array of URLs (strings), convert them to UploadedFile objects
    if (imgFiles.length > 0 && typeof imgFiles[0] === "string") {
      Promise.all(
        imgFiles.map((url, idx) =>
          urlToFile(url.toString() as string, `Uploaded_Image_${idx + 1}.jpg`, "image/jpeg", url.toString())
        )
      ).then(setFiles);
    } else if (imgFiles.length > 0 && imgFiles[0] instanceof File) {
      // If already File objects, wrap them as UploadedFile objects with empty s3Key
      setFiles((imgFiles as File[]).map(file => ({ file, s3Key: "" })));
    } else {
      setFiles([]);
    }
  }, [imgFiles]);

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
    const newFiles = [...droppedFiles];
    droppedFiles.forEach(async (file, index) => {
      const newName = `Uploaded_Image_${files.length + index + 1}`;
      const blob = new Blob([file], { type: file.type });
      newFiles.splice(index, 1, new File([blob], newName, { type: file.type }));
    });
    if (validateFiles(newFiles)) {
      setFiles([...files, ...newFiles.map(file => ({ file, s3Key: "" }))]);
      setImgFiles([...imgFiles, ...newFiles]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const droppedFiles = Array.from(e.target.files!);
    const newFiles = [...droppedFiles];
    droppedFiles.forEach(async (file, index) => {
      const newName = `Uploaded_Image_${files.length + index + 1}`;
      const blob = new Blob([file], { type: file.type });
      newFiles.splice(index, 1, new File([blob], newName, { type: file.type }));
    });
    if (validateFiles(newFiles)) {
      setFiles([...files, ...newFiles.map(file => ({ file, s3Key: "" }))]);
      setImgFiles([...imgFiles, ...newFiles]);
    }
  };

  const validateFiles = (files: File[]) => {
    const maxSize = 2 * 1024 * 1024; // 2 MB in bytes
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    for (const file of files) {
      if (file.size > maxSize) {
        toast(`File ${file.name} is too large. Maximum size is 2MB.`, {
          type: "error",
        });
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        toast(`File ${file.name} is not an image.`, { type: "error" });
        return false;
      }
    }
    return true;
  };

  return (
    <div className="file-upload space-y-2">
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
      />
      <div
        className="drop-zone h-40 bg-gray-100 mr-2 p-2 rounded-lg overflow-scroll"
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {files.length === 0 ? (
          <span>Drag and drop files here, or click to select files</span>
        ) : (
          <div>
            <span>Drag and drop files here, ordd click to select files </span>
            <div className="flex items-center justify-center flex-wrap gap-5 p-2">
              {files.map(({ file, s3Key }, index) => {
            // <Image key={index} src={`https://fsalyda-stockage-2025.s3.amazonaws.com/${key}`} alt="image" width={400} height={200} />
                
                return (
                <Image
                  key={index}
                  src={URL.createObjectURL(file)}
                  alt={"uploaded image" + index}
                  width={100}
                  height={100}
                  className="w-[150px] h-auto"
                />
              )})}
            </div>
          </div>
        )}
      </div>
      <ul className="space-y-1">
        {files.map(({ file, s3Key }, index) => (
          <li
            key={index}
            className="flex items-center justify-between border border-green-500 rounded-lg p-1 mr-2"
          >
            <span>
              {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </span>
            <i
              className="fa fa-trash"
              onClick={async () => {
                console.log("handle click", s3Key);
                const { success, message } = await deleteFileFromS3(s3Key);
                console.log("delete operate -> ", success);
                
                // Use s3Key for deletion from S3
                // Example: call your backend API to delete using s3Key
                const newFiles = files.filter((_, i) => i !== index);
                setFiles(newFiles);
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
