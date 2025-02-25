import { FormItemDetails } from "@/types/types";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemD: FormItemDetails;
  formItemDetails: FormItemDetails[];
  setFormItemDetails: (formItemDetails: FormItemDetails[]) => void;
  setEditedName: (name: string) => void;
  setItemToEditName: (id: string) => void;
};

export default function EditDateTime({
  itemD,
  formItemDetails,
  setFormItemDetails,
  setEditedName,
  setItemToEditName,
}: Props) {
  const [title, setTitle] = useState(itemD.newTitle!);
  const [type, setType] = useState(itemD.type!);
  const [required, setRequired] = useState(itemD.required!);
  const [dateSelVal, setDateSelVal] = useState(itemD.defaultDate!);
  const [timeSelVal, setTimeSelVal] = useState(itemD.defaultTime!);
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
  useEffect(() => {
    if (type === "time" || type === "datetime-local") {
      const selectElement = document.getElementById("timeInput")!;
      for (let i = 0; i <= 23; i++) {
        for (let j = 0; j < 60; j += 5) {
          const timeString = `${i.toString().padStart(2, "0")}:${j
            .toString()
            .padStart(2, "0")}`;
          const option = document.createElement("option");
          option.value = timeString;
          option.textContent = timeString;
          selectElement.appendChild(option);
        }
      }
    }
  }, [type]);
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
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="datetime-local">Date & Time</option>
        <option value="date">Date</option>
        <option value="time">Time</option>
      </select>
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="requiredInput"
          defaultChecked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Entry required
        </label>
      </div>
      {type !== "time" && (
        <>
          <p className="mt-2 text-lg font-bold">Default Date :</p>
          <select
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
            value={dateSelVal}
            onChange={(e) => setDateSelVal(e.target.value)}
          >
            <option value="">No Date</option>
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="1st day of the week">1st day of the week</option>
            <option value="1st day of the month">1st day of the month</option>
            <option value="Last day of the month">Last day of the month</option>
            <option value="Last day of previous month">
              Last day of previous month
            </option>
            <option value="A week from today">A week from today</option>
            <option value="In a year's time">In a year&apos;s time</option>
          </select>
        </>
      )}
      {type !== "date" && (
        <>
          <p className="mt-2 text-lg font-bold">Default Time :</p>
          <select
            id="timeInput"
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
            value={timeSelVal}
            onChange={(e) => setTimeSelVal(e.target.value)}
          >
            <option value="">No Time</option>
            <option value="Now">Now</option>
          </select>
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
            setType(itemD.type!);
            setRequired(itemD.required!);
            setDateSelVal(itemD.defaultDate!);
            setTimeSelVal(itemD.defaultTime!);
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
            const newItemD: FormItemDetails = {
              ...itemD,
              newTitle: title,
              type: type,
              required: required,
              defaultDate: dateSelVal,
              defaultTime: timeSelVal,
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
