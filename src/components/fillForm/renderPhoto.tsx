"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Trash2 } from "lucide-react"

type RenderPhotoProps = {
  file: File
  index: number
  updateName: (index: number, newName: string) => void
  removeFile: (index: number) => void
  moveFile: (fromIndex: number, toIndex: number) => void
}

export default function RenderPhoto({
  file,
  index,
  updateName,
  removeFile,
  moveFile,
}: RenderPhotoProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tempName, setTempName] = useState(file.name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value)
  }

  const handleNameSave = () => {
    setIsEditing(false)
    if (tempName !== file.name) {
      updateName(index, tempName)
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", index.toString())
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData("text/plain"), 10)
    moveFile(fromIndex, index)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave()
    }
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative border rounded-lg shadow-md p-2 bg-white w-40 flex flex-col items-center gap-2"
    >
      {previewUrl && (
        <Image
          src={previewUrl}
          alt="preview"
          width={160}
          height={160}
          className="rounded-lg object-cover h-32 w-32"
        />
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          value={tempName}
          onChange={handleNameChange}
          onBlur={handleNameSave}
          onKeyDown={handleKeyDown}
          className="w-full text-sm border-b outline-none"
          autoFocus
        />
      ) : (
        <div
          className="w-full text-sm truncate cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          {tempName}
        </div>
      )}

      <button
        onClick={() => removeFile(index)}
        className="absolute top-1 right-1 text-red-500"
        aria-label="Remove photo"
        type="button"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

