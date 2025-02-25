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

export default function EditChoice({
  itemD,
  formItemDetails,
  setFormItemDetails,
  setEditedName,
  setItemToEditName,
}: Props) {
  const [title, setTitle] = useState(itemD.newTitle!);
  const [listItems, setListItems] = useState(itemD.listItems!);
  const [listSelVal, setListSelVal] = useState(itemD.listDefaultValue!);
  const [required, setRequired] = useState(itemD.required!);
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
      className="w-full h-[530px] flex flex-col pb-5 space-y-2 overflow-auto"
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
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="requiredInput"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
        />
        <label className="text-lg font-bold" htmlFor="requiredInput">
          Entry required
        </label>
      </div>
      <p className="mt-2 text-lg font-bold">
        List items{" "}
        <span className="text-sm">
          (example: &quot;item1&quot;,&quot;item2&quot;,...)
        </span>{" "}
        :
      </p>
      <input
        id="listItems"
        className="bg-gray-100 rounded-lg outline-none p-2 mr-2"
        defaultValue={`"${listItems?.join('","')}"`}
        onChange={(e) => {
          let str = e.target.value;
          if (str.length > 2) {
            if (str.charAt(str.length - 1) === ",") {
              str = str.slice(0, -1);
            }
            setListItems(str.slice(1, -1).split('","'));
          } else {
            setListItems([]);
          }
        }}
      />
      <p className="mt-2 text-lg font-bold">Default Value :</p>

      <select
        className="bg-gray-100 rounded-lg outline-none p-2 mr-2"
        value={listSelVal}
        onChange={(e) => setListSelVal(e.target.value)}
      >
        {listItems?.length > 0 ? (
          <>
            <option value="">No Default Value</option>
            {listItems.map((item, index) => {
              return (
                <option key={index} value={item}>
                  {item}
                </option>
              );
            })}
          </>
        ) : (
          <option value="">No items in list</option>
        )}
      </select>
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
            setListItems(itemD.listItems!);
            setListSelVal(itemD.listDefaultValue!);
            setRequired(itemD.required!);
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
            if (listItems.length === 0) {
              toast("List Items are Required", { type: "error" });
              return;
            }
            const newItemD: FormItemDetails = {
              ...itemD,
              newTitle: title,
              required: required,
              listItems: listItems,
              listDefaultValue: listSelVal,
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
