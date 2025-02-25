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

export default function EditPhoto({
  itemD,
  formItemDetails,
  setFormItemDetails,
  setEditedName,
  setItemToEditName,
}: Props) {
  const [title, setTitle] = useState(itemD.newTitle!);
  const [required, setRequired] = useState(itemD.required!);
  const [mulPics, setMulPics] = useState(itemD.multiplePics!);
  const [minPics, setMinPics] = useState(itemD.minPics!);
  const [maxPics, setMaxPics] = useState(itemD.maxPics!);
  const [maxPicSize, setMaxPicSize] = useState(itemD.maxPicSize!);
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
    <form id="editItemD" className="w-full flex flex-col pb-5 space-y-2">
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
      <div className="mt-2 flex items-center justify-start space-x-2 text-lg">
        <input
          className="w-[20px] h-[20px]"
          type="checkbox"
          id="mulPicsAllowed"
          checked={mulPics}
          onChange={(e) => setMulPics(e.target.checked)}
        />
        <label className="text-lg font-bold" htmlFor="mulPicsAllowed">
          Several Pictures Allowed
        </label>
      </div>
      {mulPics && (
        <>
          <p className="text-lg font-bold">Minimum number of photos :</p>
          <input
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
            type="number"
            defaultValue={minPics}
            onChange={(e) => setMinPics(parseInt(e.target.value))}
          />
          <p className="text-lg font-bold">Maximum number of photos :</p>
          <input
            className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
            type="number"
            defaultValue={maxPics}
            onChange={(e) => setMaxPics(parseInt(e.target.value))}
          />
        </>
      )}

      <p className="text-lg font-bold">
        Maximum size of {mulPics ? "photos" : "photo"} in MegaBytes :
      </p>
      <input
        className="bg-gray-100 outline-none p-2 rounded-lg mr-2"
        type="number"
        max={2}
        defaultValue={maxPicSize}
        onChange={(e) => setMaxPicSize(parseInt(e.target.value))}
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
            setRequired(itemD.required!);
            setMulPics(itemD.multiplePics!);
            setMinPics(itemD.minPics!);
            setMaxPics(itemD.maxPics!);
            setMaxPicSize(itemD.maxPicSize!);
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
              required: required,
              multiplePics: mulPics,
              minPics: minPics,
              maxPics: maxPics,
              maxPicSize: maxPicSize,
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
