import { FormItemDetails } from "@/types/types";
import React, { useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemD: FormItemDetails;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: (formItemDetails: FormItemDetails[]) => void;
  setEditedName: (name: string) => void;
  setItemToEditName: (id: string) => void;
};

export default function EditCalculation({
  itemD,
  formItemDetails,
  setFormItemDetails,
  setEditedName,
  setItemToEditName,
}: Props) {
  const [title, setTitle] = useState(itemD.newTitle!);
  const [calcType, setCalcType] = useState(itemD.type!);
  const [input1, setInput1] = useState(itemD.calcInput1!);
  const [typeOfI1, setTypeOfI1] = useState(itemD.typeOfI1!);
  const [input2, setInput2] = useState(itemD.calcInput2!);
  const [itemSize, setItemSize] = useState(itemD.size!);
  const [itemColor, setItemColor] = useState(itemD.newColor!);
  const [arrowUp, setArrowUp] = useState(false);
  const colorOptions = [
    "white",
    "red-500",
    "blue-500",
    "green-500",
    "orange-500",
    "indigo-500",
    "yellow-500",
  ];
  const calcItemDetails = formItemDetails.filter((item) => {
    return (
      item.title === "Input field" ||
      item.title === "Text Area" ||
      item.title === "Date & Time"
      // (item.title === "Calculation" && item.id !== itemD.id)
    );
  });

  return (
    <form
      id="editItemD"
      className="w-full flex flex-col pb-5 space-y-2 overflow-auto"
    >
      <p className="text-lg font-bold">Title :</p>
      <input
        className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
        type="text"
        defaultValue={title}
        onChange={(e) => {
          let error = "";
          formItemDetails.map((item) => {
            if (itemD.id !== item.id) {
              if (item.newTitle === e.target.value) {
                error =
                  "There is already a feild with this title, Please choose a different title";
              }
            }
          });
          if (error !== "") {
            toast(error, { type: "error" });
            return;
          }
          setTitle(e.target.value);
        }}
      />
      <p className="mt-2 text-lg font-bold">Type :</p>
      <select
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
        value={calcType}
        onChange={(e) => {
          setCalcType(e.target.value);
          setInput1("");
          setTypeOfI1("");
        }}
      >
        <option value="add">Addition</option>
        <option value="sub">Subtraction</option>
        <option value="mul">Multiplication</option>
        <option value="div">Division</option>
        <option value="per">Percentage</option>
      </select>
      <p className="mt-2 text-lg font-bold">Calculation Input 1 :</p>
      <select
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
        value={input1}
        onChange={(e) => {
          setInput1(e.target.value);
          if (e.target.value === "") {
            setTypeOfI1("");
            return;
          }
          calcItemDetails.map((item) => {
            if (item.newTitle === e.target.value) {
              setTypeOfI1(item.type ?? "");
            }
          });
        }}
      >
        {calcItemDetails.length > 0 ? (
          <>
            <option value="">No field</option>
            {calcItemDetails.map((item, index) => {
              if (
                item.title === "Date & Time" &&
                (calcType === "mul" || calcType === "div" || calcType === "per")
              ) {
                return null;
              } else {
                return (
                  <option key={index} value={item.newTitle}>
                    {item.newTitle}
                  </option>
                );
              }
            })}
          </>
        ) : (
          <option value="">No fields in form to perform Calculation</option>
        )}
      </select>
      {calcType !== "per" ? (
        (calcType === "add" || calcType === "sub") &&
        (typeOfI1 === "datetime-local" ||
          typeOfI1 === "date" ||
          typeOfI1 === "time") ? (
          <>
            <p className="mt-2 text-lg font-bold">
              Calculation Input 2 custom value :
            </p>
            <p className="mt-2 text-sm text-green-500">
              Please specify the number with its unit. (eg. 2 days | 1 month | 1
              year | 2 hours| 05:30 hours | 5 mins)
            </p>
            <input
              className="bg-gray-100 p-2 rounded-lg outline-none"
              type="text"
              defaultValue={
                Number.isNaN(parseFloat(input2)) ? "0 days" : input2
              }
              onChange={(e) => setInput2(e.target.value)}
            />
          </>
        ) : (
          <div className="p-2 rounded-lg outline-none mr-2 border border-black flex flex-col">
            <p className="mt-2 text-lg font-bold">Calculation Input 2 :</p>
            <select
              className="bg-gray-100 p-2 rounded-lg outline-none"
              value={Number.isNaN(parseFloat(input2)) ? input2 : ""}
              onChange={(e) => setInput2(e.target.value)}
            >
              {calcItemDetails.length > 0 ? (
                <>
                  <option value="">No Field</option>
                  {calcItemDetails.map((item, index) => {
                    if (item.title === "Date & Time") {
                      return null;
                    } else {
                      return (
                        <option key={index} value={item.newTitle}>
                          {item.newTitle}
                        </option>
                      );
                    }
                  })}
                </>
              ) : (
                <option value="">
                  No fields in form to perform Calculation
                </option>
              )}
            </select>
            <span className="mt-2 text-sm font-bold text-center">OR</span>
            <p className="mt-2 text-sm font-bold">
              Calculation Input 2 custom value :
            </p>
            <input
              className="bg-gray-100 p-2 rounded-lg outline-none"
              type="text"
              value={Number.isNaN(parseFloat(input2)) ? "0" : input2}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setInput2(e.target.value)}
            />
          </div>
        )
      ) : (
        <>
          <p className="mt-2 text-lg font-bold">Percentage Value :</p>
          <input
            type="number"
            className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
            defaultValue={Number.isNaN(parseFloat(input2)) ? "0" : input2}
            onChange={(e) => setInput2(e.target.value)}
          />
        </>
      )}
      <p className="mt-2 text-lg font-bold">Size of the item :</p>
      <select
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
        value={itemSize}
        onChange={(e) => setItemSize(e.target.value)}
      >
        <option value="normal">Normal</option>
        <option value="smaller">Smaller</option>
        <option value="bigger">Bigger</option>
      </select>
      <p className="mt-2 text-lg font-bold">Color :</p>
      <div className="bg-gray-100 rounded-lg mr-2">
        <div
          className="flex items-center justify-between p-2"
          onClick={() => setArrowUp(true)}
        >
          <span className={`w-[95%] h-6 bg-${itemColor} px-2`}></span>
          <i
            className={`fa-solid fa-chevron-down text-xs transform ${
              arrowUp ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
        <ul
          className={`flex flex-col space-y-1 px-2 pb-2 ${
            arrowUp ? "" : "hidden"
          }`}
        >
          {colorOptions.map((color, index) => {
            return (
              <li
                key={index}
                className={`w-full h-6 bg-${color}`}
                onClick={() => {
                  setItemColor(color);
                  setArrowUp(false);
                }}
              />
            );
          })}
        </ul>
      </div>
      <div className="w-full flex items-center justify-end space-x-2 pr-2">
        <div
          className="bg-white text-indigo-900 border border-indigo-900 p-2 rounded-lg cursor-pointer"
          onClick={() => {
            setTitle(itemD.newTitle!);
            setCalcType(itemD.type!);
            setInput1(itemD.calcInput1!);
            setTypeOfI1(itemD.typeOfI1!);
            setInput2(itemD.calcInput2!);
            setItemSize(itemD.size!);
            setItemColor(itemD.newColor!);
            document.getElementById("editModal")!.classList.add("hidden");
          }}
        >
          Cancel
        </div>
        <button
          type="submit"
          className="bg-indigo-900 border border-indigo-900 text-white p-2 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            if (title === "") {
              toast("Title is Required", { type: "error" });
              return;
            }
            if (input1 === "") {
              toast("Calculation Input 1 is Required", { type: "error" });
              return;
            }
            if (input2 === "" || input2 === "0" || parseFloat(input2) === 0) {
              toast("Calculation Input 2 is Required", { type: "error" });
              return;
            }
            const newItemD: FormItemDetails = {
              ...itemD,
              newTitle: title,
              type: calcType,
              calcInput1: input1,
              typeOfI1: typeOfI1,
              calcInput2: input2,
              size: itemSize,
              newColor: itemColor,
            };
            const index = formItemDetails.indexOf(itemD);
            const newFormItemDetails = [...formItemDetails];
            newFormItemDetails.splice(index, 1, newItemD);
            setFormItemDetails(newFormItemDetails);
            if (itemD.newTitle !== title) {
              setEditedName(title);
              setItemToEditName(`s${itemD.id}`);
            }
            document.getElementById("editModal")!.classList.add("hidden");
          }}
        >
          Confirm
        </button>
      </div>
    </form>
  );
}
