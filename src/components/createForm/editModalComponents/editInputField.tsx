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

export default function EditInputField({
  itemD,
  formItemDetails,
  setFormItemDetails,
  setEditedName,
  setItemToEditName,
}: Props) {
  const [title, setTitle] = useState(itemD.newTitle!);
  const [type, setType] = useState(itemD.type!);
  const [required, setRequired] = useState(itemD.required!);
  const [itemPlaceholder, setItemPlaceholder] = useState(itemD.placeholder!);
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
  return (
    <form
      id="editItemD"
      className="w-full h-[512px] flex flex-col pb-5 space-y-2 overflow-auto"
    >
      <p className="text-lg font-bold">Title :</p>
      <input
        id="titleInput"
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
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
      >
        <option value="text">Text</option>
        <option value="password">Password</option>
        <option value="email">Email</option>
        <option value="url">Website Url</option>
        <option value="tel">Phone Number</option>
        <option value="number">Number or Decimal</option>
        <option value="color">Color Picker</option>
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
      <p className="mt-2 text-lg font-bold">Placeholder Text :</p>
      <input
        className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
        type="text"
        defaultValue={itemPlaceholder}
        onChange={(e) => setItemPlaceholder(e.target.value)}
      />
      <p className="mt-2 text-lg font-bold">Size of the item :</p>
      <select
        value={itemSize}
        onChange={(e) => setItemSize(e.target.value)}
        className="bg-gray-100 p-2 rounded-lg outline-none mr-2"
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
            setItemPlaceholder(itemD.placeholder!);
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
              placeholder: itemPlaceholder,
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
