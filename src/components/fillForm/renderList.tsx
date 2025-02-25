import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderList({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
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
      <ul
        className={`w-full ${
          itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
            ? "text-lg"
            : "text-xl"
        } text-${itemD.newColor} space-y-2`}
      >
        {itemD.listMultipleSelection
          ? itemD.listItems!.map((li, index) => {
              return (
                <li
                  key={index}
                  className="w-full flex items-center justify-start space-x-2"
                >
                  <input
                    type="checkbox"
                    className={`bg-gray-200 rounded-lg ${
                      itemD.size === "smaller"
                        ? "w-4 h-4"
                        : itemD.size === "normal"
                        ? "w-6 h-6"
                        : "w-8 h-8"
                    }`}
                    disabled={preview}
                    defaultChecked={(
                      formState[itemD.newTitle] as string[]
                    )?.includes(li)}
                    name={itemD.newTitle}
                    id={li}
                    value={li}
                    onChange={(e) => {
                      if (e.target.checked) {
                        const mulDefaultValues = [
                          ...(formState[itemD.newTitle] as string[]),
                        ];
                        mulDefaultValues.splice(index, 1, li);
                        setFormState({
                          ...formState,
                          [itemD.newTitle]: mulDefaultValues,
                        });
                      } else {
                        const mulDefaultValues = [
                          ...(formState[itemD.newTitle] as string[]),
                        ];
                        mulDefaultValues.splice(index, 1, "");
                        setFormState({
                          ...formState,
                          [itemD.newTitle]: mulDefaultValues,
                        });
                      }
                    }}
                  />
                  <label
                    htmlFor={li}
                    className={`${
                      itemD.size === "smaller"
                        ? "text-md"
                        : itemD.size === "normal"
                        ? "text-lg"
                        : "text-xl"
                    } text-${itemD.newColor}`}
                  >
                    {li}
                  </label>
                </li>
              );
            })
          : itemD.listItems!.map((li, index) => {
              return (
                <li
                  key={index}
                  className="w-full flex items-center justify-start space-x-2"
                >
                  <input
                    type="radio"
                    className={`${
                      itemD.size === "smaller"
                        ? "w-4 h-4"
                        : itemD.size === "normal"
                        ? "w-5 h-5"
                        : "w-6 h-6"
                    } text-blue-600 bg-gray-100`}
                    disabled={preview}
                    checked={(formState[itemD.newTitle!] as string) === li}
                    name={itemD.newTitle}
                    id={li}
                    value={li}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormState({
                          ...formState,
                          [itemD.newTitle]: li,
                        });
                      } else {
                        setFormState({
                          ...formState,
                          [itemD.newTitle]: "",
                        });
                      }
                    }}
                  />
                  <label
                    htmlFor={li}
                    className={`${
                      itemD.size === "smaller"
                        ? "text-md"
                        : itemD.size === "normal"
                        ? "text-lg"
                        : "text-xl"
                    } text-${itemD.newColor}`}
                  >
                    {li}
                  </label>
                </li>
              );
            })}
      </ul>
    </div>
  );
}
