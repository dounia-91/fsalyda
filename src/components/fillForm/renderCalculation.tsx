import { FormItemDetails } from "@/types/types";
import { FormState } from "@/types/types";
import { useCallback, useEffect } from "react";

type Props = {
  itemD: FormItemDetails;
  formItemDetails: FormItemDetails[];
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderCalculation({
  itemD,
  formState,
  setFormState,
}: Props) {
  const calcInput1 = formState[itemD.calcInput1!] ?? "";
  const calcInput2 = formState[itemD.calcInput2!] ?? "";
  const calculateResult = useCallback(() => {
    if (!formState[itemD.calcInput1!]) {
      return null;
    }
    let cal1: string | number;
    let cal2: string | number;
    cal1 = formState[itemD.calcInput1!] as string;
    if (Number.isNaN(parseFloat(itemD.calcInput2!))) {
      cal2 = formState[itemD.calcInput2!] as string;
    } else {
      cal2 = itemD.calcInput2! as string;
    }
    if (
      itemD.typeOfI1 === "datetime-local" ||
      itemD.typeOfI1 === "date" ||
      itemD.typeOfI1 === "time"
    ) {
      let cal1arr: string[] = [];
      let cal1Date = 0;
      let cal1Month = 0;
      let cal1Year = 0;
      let cal1Hour = 0;
      let cal1Min = 0;
      let cal2arr: string[] = [];
      let cal2Hour = 0;
      let cal2Min = 0;
      let cal2Date = 0;
      let cal2Month = 0;
      let cal2Year = 0;
      if (itemD.typeOfI1 === "datetime-local") {
        cal1arr = cal1.split("T");
        const cal1DateArr = cal1arr[0].split("-");
        const cal1TimeArr = cal1arr[1].split(":");
        cal1Date = parseInt(cal1DateArr[2]);
        cal1Month = parseInt(cal1DateArr[1]);
        cal1Year = parseInt(cal1DateArr[0]);
        cal1Hour = parseInt(cal1TimeArr[0]);
        cal1Min = parseInt(cal1TimeArr[1]);

        if (
          cal2.toLowerCase().includes("years") ||
          cal2.toLowerCase().includes("year")
        ) {
          cal2Year = parseInt(cal2);
        } else if (
          cal2.toLowerCase().includes("months") ||
          cal2.toLowerCase().includes("month")
        ) {
          cal2Month = parseInt(cal2);
        } else if (
          cal2.toLowerCase().includes("days") ||
          cal2.toLowerCase().includes("day")
        ) {
          cal2Date = parseInt(cal2);
        } else if (
          cal2.toLowerCase().includes("hours") ||
          cal2.toLowerCase().includes("hour")
        ) {
          if (cal2.toLowerCase().includes(":")) {
            cal2arr = cal2.split(":");
            cal2Hour = parseInt(cal2arr[0]);
            cal2Min = parseInt(cal2arr[1]);
          } else {
            cal2Hour = parseInt(cal2);
          }
        } else if (
          cal2.toLowerCase().includes("mins") ||
          cal2.toLowerCase().includes("min")
        ) {
          cal2Min = parseInt(cal2);
        } else {
          return `Can not perform calculation on ${cal1} and ${cal2}`;
        }
        if (itemD.type === "add") {
          const inputDate = new Date(
            cal1Year,
            cal1Month,
            cal1Date,
            cal1Hour,
            cal1Min
          );
          const calculatedDate = new Date(
            inputDate.getFullYear() + cal2Year,
            inputDate.getMonth() + cal2Month - 1,
            inputDate.getDate() + cal2Date,
            inputDate.getHours() + cal2Hour,
            inputDate.getMinutes() + cal2Min
          );
          const resultArr = new Date(calculatedDate)
            .toLocaleString()
            .split(",");
          const date = resultArr[0];
          const time = resultArr[1].trim();
          const resultDate = date.split("/");
          const resultTime = time.split(":");
          if (resultTime[2].includes("PM")) {
            resultTime[0] = String(parseInt(resultTime[0]) + 12).padStart(
              2,
              "0"
            );
          } else {
            if (resultTime[0] === "12") {
              resultTime[0] = String(parseInt(resultTime[0]) - 12).padStart(
                2,
                "0"
              );
            } else {
              resultTime[0] = String(parseInt(resultTime[0])).padStart(2, "0");
            }
          }
          resultTime[1] = resultTime[1].padStart(2, "0");
          return `${resultDate[2]}-${resultDate[0].padStart(
            2,
            "0"
          )}-${resultDate[1].padStart(2, "0")}T${resultTime[0]}:${
            resultTime[1]
          }`;
        } else {
          const inputDate = new Date(
            cal1Year,
            cal1Month,
            cal1Date,
            cal1Hour,
            cal1Min
          );
          const calculatedDate = new Date(
            inputDate.getFullYear() - cal2Year,
            inputDate.getMonth() - cal2Month - 1,
            inputDate.getDate() - cal2Date,
            inputDate.getHours() - cal2Hour,
            inputDate.getMinutes() - cal2Min
          );
          const resultArr = new Date(calculatedDate)
            .toLocaleString()
            .split(",");
          const date = resultArr[0];
          const time = resultArr[1];
          const resultDate = date.split("/");
          const resultTime = time.split(":");
          if (resultTime[2].includes("PM")) {
            resultTime[0] = String(parseInt(resultTime[0]) + 12).padStart(
              2,
              "0"
            );
          } else {
            resultTime[0] = resultTime[0].padStart(2, "0");
          }
          resultTime[1] = resultTime[1].padStart(2, "0");
          return `${resultDate[2]}-${resultDate[0].padStart(
            2,
            "0"
          )}-${resultDate[1].padStart(2, "0")}T${resultTime[0]}:${
            resultTime[1]
          }`;
        }
      } else if (itemD.typeOfI1 === "date") {
        cal1arr = cal1.split("-");
        cal1Year = parseInt(cal1arr[0]);
        cal1Month = parseInt(cal1arr[1]);
        cal1Date = parseInt(cal1arr[2]);
        if (
          cal2.toLowerCase().includes("years") ||
          cal2.toLowerCase().includes("year")
        ) {
          cal2Year = parseInt(cal2);
        } else if (
          cal2.toLowerCase().includes("months") ||
          cal2.toLowerCase().includes("month")
        ) {
          cal2Month = parseInt(cal2);
        } else if (
          cal2.toLowerCase().includes("days") ||
          cal2.toLowerCase().includes("day")
        ) {
          cal2Date = parseInt(cal2);
        } else {
          return `Can not perform calculation on ${cal1} and ${cal2}`;
        }
        if (itemD.type === "add") {
          const inputDate = new Date(cal1Year, cal1Month, cal1Date);
          const calculatedDate = new Date(
            inputDate.getFullYear() + cal2Year,
            inputDate.getMonth() + cal2Month - 1,
            inputDate.getDate() + cal2Date
          );
          const result = new Date(calculatedDate)
            .toLocaleDateString()
            .split("/");
          return `${result[2]}-${result[0].padStart(
            2,
            "0"
          )}-${result[1].padStart(2, "0")}`;
        } else {
          const inputDate = new Date(cal1Year, cal1Month, cal1Date);
          const calculatedDate = new Date(
            inputDate.getFullYear() - cal2Year,
            inputDate.getMonth() - cal2Month - 1,
            inputDate.getDate() - cal2Date
          );
          const result = new Date(calculatedDate)
            .toLocaleDateString()
            .split("/");
          return `${result[2]}-${result[0].padStart(
            2,
            "0"
          )}-${result[1].padStart(2, "0")}`;
        }
      } else if (itemD.typeOfI1 === "time") {
        cal1arr = cal1.split(":");
        cal1Hour = parseInt(cal1arr[0]);
        cal1Min = parseInt(cal1arr[1]);
        if (
          cal2.toLowerCase().includes("hours") ||
          cal2.toLowerCase().includes("hour")
        ) {
          if (cal2.toLowerCase().includes(":")) {
            cal2arr = cal2.split(":");
            cal2Hour = parseInt(cal2arr[0]);
            cal2Min = parseInt(cal2arr[1]);
          } else {
            cal2Hour = parseInt(cal2);
          }
        } else if (
          cal2.toLowerCase().includes("mins") ||
          cal2.toLowerCase().includes("min")
        ) {
          cal2Min = parseInt(cal2);
        } else {
          return `Can not perform calculation on ${cal1} and ${cal2}`;
        }
        if (itemD.type === "add") {
          if (cal1Min + cal2Min >= 60) {
            cal1Min = cal1Min - 60;
            cal1Hour = cal1Hour + 1;
          }
          if (cal1Hour + cal2Hour >= 24) {
            cal1Hour = cal1Hour - 24;
          }
          return `${String(cal1Hour + cal2Hour).padStart(2, "0")}:${String(
            cal1Min + cal2Min
          ).padStart(2, "0")}`;
        } else {
          if (cal1Min - cal2Min < 0) {
            cal1Min = 60 + cal1Min;
            cal1Hour = cal1Hour - 1;
          }
          if (cal1Hour - cal2Hour < 0) {
            cal1Hour = 24 + cal1Hour;
          }
          return `${String(cal1Hour - cal2Hour).padStart(2, "0")}:${String(
            cal1Min - cal2Min
          ).padStart(2, "0")}`;
        }
      }
    }
    cal1 = parseFloat(cal1);
    cal2 = parseFloat(cal2);
    if (itemD.type === "add") {
      return String(cal1 + cal2);
    } else if (itemD.type === "sub") {
      return String(cal1 - cal2);
    } else if (itemD.type === "mul") {
      return String(cal1 * cal2);
    } else if (itemD.type === "div") {
      return String(cal1 / cal2);
    } else {
      return String((cal1 * cal2) / 100);
    }
  }, [
    calcInput1,
    calcInput2,
    itemD.calcInput1,
    itemD.calcInput2,
    itemD.type,
    itemD.typeOfI1,
  ]);

  useEffect(() => {
    const result = calculateResult();
    if (result) {
      setFormState((prevFormState) => {
        return { ...prevFormState, [itemD.newTitle]: result };
      });
    }
  }, [calculateResult, itemD.newTitle, setFormState]);
  return (
    <div className="w-full flex items-center justify-start space-x-2">
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
      <span className={`text-${itemD.newColor}`}>
        {formState[itemD.newTitle] as string}
      </span>
    </div>
  );
}
