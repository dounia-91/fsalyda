import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderTextArea({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  return (
    <div
      className={`w-full flex ${
        !preview
          ? "h-30 flex-col items-start justify-start space-y-2"
          : "items-center justify-start"
      }`}
    >
      <label
        htmlFor={itemD.newTitle}
        className={`${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        } font-bold text-${itemD.newColor}`}
      >
        {itemD.newTitle} :
      </label>
      {preview ? (
        <span
          className={`text-${itemD.newColor} outline-none rounded-lg p-2 ${
            itemD.size === "smaller"
              ? "text-md"
              : itemD.size === "normal"
              ? "text-lg"
              : "text-xl"
          }`}
        >
          {formState[itemD.newTitle] as string}
        </span>
      ) : (
        <textarea
          id={itemD.newTitle}
          rows={4}
          cols={10}
          defaultValue={formState[itemD.newTitle] as string}
          placeholder={itemD.placeholder}
          onChange={(e) =>
            setFormState({ ...formState, [itemD.newTitle]: e.target.value })
          }
          className={`w-full bg-gray-200 outline-none rounded-lg p-2 ${
            itemD.size === "smaller"
              ? "text-md"
              : itemD.size === "normal"
              ? "text-lg"
              : "text-xl"
          }`}
        />
      )}
    </div>
  );
}
