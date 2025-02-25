import { FormItemDetails } from "@/types/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { FormState } from "@/types/types";

type Props = {
  itemD: FormItemDetails;
  formState: FormState;
  preview?: boolean;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
};

export default function RenderTable({
  itemD,
  formState,
  setFormState,
  preview,
}: Props) {
  const [rowCount, setRowCount] = useState(1);
  const rowArray = [];
  for (let i = 1; i <= rowCount; i++) {
    rowArray.push(i);
  }
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
      <div className="w-full bg-slate-400 rounded-lg p-2">
        <table className="w-full">
          <thead>
            <tr>
              {itemD.tableCols?.map((col, index) => (
                <th
                  key={index}
                  className={`w-1/${itemD.tableCols?.length} text-center border border-black`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rowArray.map((row) => {
              return (
                <tr key={row}>
                  {itemD.tableCols?.map((col, index) => {
                    if (index === 0) {
                      return (
                        <td
                          key={index}
                          className={`w-1/${itemD.tableCols?.length} text-center border border-black p-2`}
                        >
                          {row}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={index}
                        className={`w-1/${itemD.tableCols?.length} text-center border border-black p-2 overflow-hidden`}
                      >
                        {preview ? (
                          <span className={`text-${itemD.newColor}`}>
                            {
                              (formState[itemD.newTitle] as string[][])?.[
                                row - 1
                              ][index]
                            }
                          </span>
                        ) : (
                          <input
                            type="text"
                            className="w-full bg-gray-200 rounded-lg outline-none p-2"
                            id={`${col}${row}`}
                            defaultValue={
                              (formState[itemD.newTitle] as string[][])?.[
                                row - 1
                              ][index]
                            }
                            onChange={(e) => {
                              const updatedTableState: string[][] = [
                                ...(formState[itemD.newTitle] as string[][]),
                              ];
                              updatedTableState[row - 1][index] =
                                e.target.value;
                              setFormState({
                                ...formState,
                                [itemD.newTitle]: updatedTableState,
                              });
                            }}
                          />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!preview && (
        <button
          type="button"
          className="p-2 bg-black text-white rounded-lg"
          onClick={() => {
            if (rowCount === itemD.tableMaxRows) {
              return toast(
                `Maximum ${itemD.tableMaxRows} rows are allowed in ${itemD.newTitle}`,
                { type: "error" }
              );
            }
            setRowCount(rowCount + 1);
            setFormState((prev) => {
              return {
                ...prev,
                [`${itemD.newTitle}RowCount`]: String(rowCount + 1),
              };
            });
          }}
        >
          Add Row
        </button>
      )}
    </div>
  );
}
