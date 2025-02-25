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
    // const initState: FormState = {};
    // formItemDetails.map((itemD) => {
    //   if (itemD.title === "Date & Time") {
    //     initState[itemD.newTitle] = recordState[itemD.newTitle];
    //   } else if (itemD.title === "Check Box") {
    //     initState[itemD.newTitle] = itemD.checkBoxDefaultValue!;
    //   } else if (itemD.title === "List") {
    //     if (itemD.listMultipleSelection) {
    //       initState[itemD.newTitle] = itemD.listMulDefaultValue!;
    //     } else {
    //       initState[itemD.newTitle] = itemD.listDefaultValue!;
    //     }
    //   } else if (itemD.title === "Choice") {
    //     initState[itemD.newTitle] = itemD.listDefaultValue!;
    //   } else if (itemD.title === "Attached file") {
    //     initState[itemD.newTitle] = [];
    //   } else if (itemD.title === "Photo") {
    //     initState[itemD.newTitle] = [];
    //   } else if (itemD.title === "Voice Recorder") {
    //     initState[itemD.newTitle] = [];
    //   } else if (itemD.title === "Image") {
    //     initState[itemD.newTitle] = itemD.imageFileNames!;
    //   } else if (itemD.title === "Calculation") {
    //     initState[itemD.newTitle] = "0";
    //   } else if (itemD.title === "Table") {
    //     const emptyArray = Array.from(
    //       { length: itemD.tableMaxRows! },
    //       (i: number) => [
    //         i + 1,
    //         ...new Array(itemD.tableCols!.length - 1).fill(""),
    //       ]
    //     );
    //     emptyArray.forEach((row, index) => {
    //       row[0] = index + 1;
    //     });
    //     initState[itemD.newTitle] = emptyArray;
    //     initState[`${itemD.newTitle}RowCount`] = "1";
    //   } else {
    //     initState[itemD.newTitle] = "";
    //   }
    // });
    setFormState(recordState);
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
          if (itemD.title === "Input field") {
            return (
              <RenderInputField
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Text Area") {
            return (
              <RenderTextArea
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Date & Time") {
            return (
              <RenderDateTime
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Check Box") {
            return (
              <RenderCheckbox
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "List") {
            return (
              <RenderList
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Choice") {
            return (
              <RenderChoice
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Photo") {
            return (
              <RenderPhoto
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Voice Recorder") {
            return (
              <RenderVoiceRecorder
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Attached file") {
            return (
              <RenderAttachedFile
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Table") {
            return (
              <RenderTable
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                preview={true}
              />
            );
          }
          if (itemD.title === "Image") {
            return <RenderImage key={index} itemD={itemD} preview={true} />;
          }
          if (itemD.title === "Calculation") {
            return (
              <RenderCalculation
                key={index}
                itemD={itemD}
                formState={formState}
                setFormState={setFormState}
                formItemDetails={formItemDetails}
                preview={true}
              />
            );
          }
        })}
        <div className="w-full flex items-center justify-center text-white">
          <button
            type="button"
            className="bg-red-500 p-2 rounded-lg cursor-pointer"
            onClick={() => {
              setFormToFillTitle("");
              setFormItemDetails([]);
              setShowPreviewModal(false);
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
