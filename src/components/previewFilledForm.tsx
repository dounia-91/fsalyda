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

      if (itemD.title === "Voice Recorder") {
        // Stocke les URLs directement
        initState[itemD.newTitle] = Array.isArray(value) ? value : [value];
      } else if (itemD.title === "Photo") {
        // Stocke les URLs directement
        initState[itemD.newTitle] = Array.isArray(value) ? value : [value];
      } else {
        // Stocke les autres valeurs telles quelles
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
      onClick={() => setShowPreviewModal(false)}
    >
      <div
        className="min-w-md max-w-[90vw] max-h-[80vh] bg-gradient-to-br from-blue-300 to-blue-500 p-6 rounded-lg shadow-lg flex flex-col items-start justify-start space-y-2 overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Choice":
              return (
                <RenderChoice
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "List":
              return (
                <RenderList
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Photo":
              return (
                <RenderPhoto
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Voice Recorder":
              return (
                <RenderVoiceRecorder
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Attached File":
              return (
                <RenderAttachedFile
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Table":
              return (
                <RenderTable
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Image":
              return (
                <RenderImage
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            case "Calculation":
              return (
                <RenderCalculation
                  key={index}
                  itemD={itemD}
                  formState={formState}
                  setFormState={setFormState}
                  preview={true}
                />
              );
            default:
              return (
                <div key={index} className="text-red-500">
                  Type de champ inconnu : {itemD.title}
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}
