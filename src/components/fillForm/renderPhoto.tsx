"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Trash2, Pencil, Download } from "lucide-react"

type RenderPhotoProps = {
  file: File | undefined
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
  const [tempName, setTempName] = useState(file?.name || "")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempName(e.target.value)
  }

  const handleNameSave = () => {
    setIsEditing(false)
    if (file && tempName !== file.name) {
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

  const downloadImage = () => {
    if (!previewUrl) return
    const a = document.createElement("a")
    a.href = previewUrl
    a.download = tempName
    a.click()
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative border rounded-xl shadow-md p-2 bg-white w-40 flex flex-col items-center gap-2 group"
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

      <div className="flex items-center justify-between w-full text-sm">
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
          <div className="truncate w-full">{tempName}</div>
        )}
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="ml-1 text-gray-500 hover:text-black"
            title="Renommer"
          >
            <Pencil size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between w-full px-1">
        <span className="text-xs text-gray-500">
          {(file?.size ? file.size / 1024 : 0).toFixed(1)} ko
        </span>
        <button
          onClick={downloadImage}
          className="text-blue-500 hover:text-blue-700"
          title="Télécharger"
        >
          <Download size={16} />
        </button>
      </div>

      <button
        onClick={() => removeFile(index)}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        aria-label="Supprimer la photo"
        type="button"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}

