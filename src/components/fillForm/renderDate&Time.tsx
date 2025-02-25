import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderDateTime({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  if (itemD.defaultTime === "Now") {
    itemD.defaultTime = `${new Date(
      new Date().getTime()
    ).toLocaleTimeString()}`;
    const arr = itemD.defaultTime.split(":");
    if (arr[2].includes("AM")) {
      itemD.defaultTime = `${arr[0].padStart(2, "0")}:${arr[1].padStart(
        2,
        "0"
      )}`;
    } else {
      arr[0] = String(parseInt(arr[0]) + 12);
      itemD.defaultTime = `${arr[0].padStart(2, "0")}:${arr[1].padStart(
        2,
        "0"
      )}`;
    }
  }
  switch (itemD.defaultDate) {
    case "Today":
      itemD.defaultDate = `${new Date().getFullYear()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${new Date().getDate().toString().padStart(2, "0")}`;
      break;
    case "Yesterday":
      itemD.defaultDate = `${new Date().getFullYear()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${(new Date().getDate() - 1)
        .toString()
        .padStart(2, "0")}`;
      break;
    case "Tomorrow":
      itemD.defaultDate = `${new Date().getFullYear()}-${(
        new Date().getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${(new Date().getDate() + 1)
        .toString()
        .padStart(2, "0")}`;
      break;
    case "1st day of the week":
      const firstDayOfTheWeek = new Date();
      firstDayOfTheWeek.setDate(
        new Date().getDate() -
          (new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
      );
      itemD.defaultDate = firstDayOfTheWeek.toLocaleDateString();
      const fdow = itemD.defaultDate.split("/");
      itemD.defaultDate = `${fdow[2]}-${fdow[0].padStart(
        2,
        "0"
      )}-${fdow[1].padStart(2, "0")}`;
      break;
    case "1st day of the month":
      itemD.defaultDate = `${new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      ).toLocaleDateString()}`;
      const fdom = itemD.defaultDate.split("/");
      itemD.defaultDate = `${fdom[2]}-${fdom[0].padStart(
        2,
        "0"
      )}-${fdom[1].padStart(2, "0")}`;
      break;
    case "Last day of the month":
      itemD.defaultDate = `${new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      ).toLocaleDateString()}`;
      const ar = itemD.defaultDate.split("/");
      itemD.defaultDate = `${ar[2]}-${ar[0].padStart(2, "0")}-${ar[1].padStart(
        2,
        "0"
      )}`;
      break;
    case "Last day of previous month":
      itemD.defaultDate = `${new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        0
      ).toLocaleDateString()}`;
      const arr = itemD.defaultDate.split("/");
      itemD.defaultDate = `${arr[2]}-${arr[0].padStart(
        2,
        "0"
      )}-${arr[1].padStart(2, "0")}`;
      break;
    case "A week from today":
      itemD.defaultDate = `${new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString()}`;
      const arry = itemD.defaultDate.split("/");
      itemD.defaultDate = `${arry[2]}-${arry[0].padStart(
        2,
        "0"
      )}-${arry[1].padStart(2, "0")}`;
      break;
    case "In a year's time":
      itemD.defaultDate = `${new Date(
        new Date().getFullYear() + 1,
        new Date().getMonth(),
        new Date().getDate()
      ).toLocaleDateString()}`;
      const year = itemD.defaultDate.split("/");
      itemD.defaultDate = `${year[2]}-${year[0].padStart(
        2,
        "0"
      )}-${year[1].padStart(2, "0")}`;
      break;
  }
  return (
    <div
      className={`w-full flex ${
        !preview
          ? "flex-col items-start justify-start space-y-2"
          : "items-center justify-start space-x-2"
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
        <input
          id={itemD.newTitle}
          type={itemD.type}
          defaultValue={formState[itemD.newTitle] as string}
          onChange={(e) => {
            setFormState({ ...formState, [itemD.newTitle]: e.target.value });
          }}
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
