import { FormItemDetails } from "@/types/types";
import RenderList from "./fillForm/renderList";
import { useEffect, useState } from "react";
import RenderChoice from "./fillForm/renderChoice";
import RenderPhoto from "./fillForm/renderPhoto";
import RenderVoiceRecorder from "./fillForm/renderVoiceRecorder";
import RenderAttachedFile from "./fillForm/renderAttachedFile";
import RenderTable from "./fillForm/renderTable";
import RenderImage from "./fillForm/renderImage";
import RenderCalculation from "./fillForm/renderCalculation";
import RenderInputField from "./fillForm/renderInputField";
import RenderTextArea from "./fillForm/renderTextArea";
import RenderDateTime from "./fillForm/renderDate&Time";
import RenderCheckbox from "./fillForm/renderCheckbox";
import { FormState } from "@/types/types";

type Props = {
  showPreviewModal: boolean;
  setShowPreviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  recordState: FormState;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: React.Dispatch<React.SetStateAction<FormItemDetails[]>>;
  formToFillTitle: string;
  setFormToFillTitle: React.Dispatch<React.SetStateAction<string>>;
};

export default function PreviewFilledForm({
  showPreviewModal,
  setShowPreviewModal,
  formItemDetails,
  recordState,
  setFormItemDetails,
  formToFillTitle,
  setFormToFillTitle,
}: Props) {
  const [formState, setFormState] = useState<FormState>({});

  useEffect(() => {
    const initState: FormState = {};

    formItemDetails.forEach((itemD) => {
      const value = recordState[itemD.newTitle];

      if (itemD.title === "Voice Recorder" && Array.isArray(value)) {
        // Convert Blob[] en URL audio
        initState[itemD.newTitle] = URL.createObjectURL(
          new Blob(value, { type: "audio/webm;codecs=opus" })
        );
      } else if (itemD.title === "Photo" && Array.isArray(value)) {
        // Convertir chaque fichier image en URL
        initState[itemD.newTitle] = value.map((file: File | Blob | string) =>
          typeof file === "string" ? file : URL.createObjectURL(file)
        );
      } else {
        // Pour les autres types, garder la valeur telle quelle
        initState[itemD.newTitle] = value;
      }
    });

    setFormState(initState);
  }, [formItemDetails, recordState]);

  return (
    <div
      className={`${
        showPreviewModal ? "" : "hidden"
      } fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center`}
    >
      <div className="min-w-md max-w-[90vw] max-h-[80vh] bg-gradient-to-br from-blue-300 to-blue-500 p-6 rounded-lg shadow-lg flex flex-col items-start justify-start space-y-2 overflow-scroll">
        <h1 className="w-full text-center text-2xl font-bold">
          {formToFillTitle}
        </h1>

        {formItemDetails.map((itemD, index) => {
          switch (itemD.title) {
            case "Input field":
              return (
                <RenderInputField
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Text Area":
              return (
                <RenderTextArea
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Date & Time":
              return (
                <RenderDateTime
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Check Box":
              return (
                <RenderCheckbox
