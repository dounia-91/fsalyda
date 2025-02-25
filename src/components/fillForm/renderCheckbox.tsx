import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderCheckbox({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  return (
    <div className="w-full flex items-center justify-start space-x-2">
      <input
        id={itemD.newTitle}
        type="checkbox"
        disabled={preview}
        defaultChecked={formState[itemD.newTitle] as boolean}
        onChange={(e) => {
          if (e.target.checked) {
            setFormState({ ...formState, [itemD.newTitle]: true });
          } else {
            setFormState({ ...formState, [itemD.newTitle]: false });
          }
        }}
        className={`bg-gray-200 rounded-lg ${
          itemD.size === "smaller"
            ? "w-4 h-4"
            : itemD.size === "normal"
            ? "w-6 h-6"
            : "w-8 h-8"
        }`}
      />
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
        {itemD.newTitle}
      </label>
    </div>
  );
}
