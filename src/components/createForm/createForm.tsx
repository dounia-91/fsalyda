import React, { ReactElement, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FormItemDetails } from "@/types/types";
import { Loader2 } from "lucide-react";
// import { uploadImagesToCloudinary } from "@/lib/upload";
import { useRouter } from "next/navigation";
import FormItem from "./formItem";
import EditInputField from "./editModalComponents/editInputField";
import EditCalculation from "./editModalComponents/editCalculation";
import EditImage from "./editModalComponents/editImage";
import EditTable from "./editModalComponents/editTable";
import EditAttachedFile from "./editModalComponents/editAttachedFile";
import EditVoiceRecorder from "./editModalComponents/editVoiceRecorder";
import EditPhoto from "./editModalComponents/editPhoto";
import EditChoice from "./editModalComponents/editChoice";
import EditList from "./editModalComponents/editList";
import EditCheckBox from "./editModalComponents/editCheckBox";
import EditDateTime from "./editModalComponents/editDate&Time";
import EditTextArea from "./editModalComponents/editTextArea";
import DeleteModal from "./deleteModal";
import SelectUserAccessModal from "./selectUserAccessModal";
import { uploadFileToS3 } from "@/lib/s3config";

type Props = {
  eFormItemDetails: FormItemDetails[];
  eFormItems: ReactElement[];
  eFormItemsLength: number;
  eFormName: string;
  eCompanyName: string;
  eUsersWithAccess: string[];
  role: string;
  creatorEmail: string;
  setShowModifyFormModal: React.Dispatch<React.SetStateAction<boolean>> | null;
};

export default function CreateForm({
  eFormItemDetails,
  eFormItems,
  eFormItemsLength,
  eFormName,
  eCompanyName,
  eUsersWithAccess,
  role,
  creatorEmail,
  setShowModifyFormModal,
}: Props) {
  const router = useRouter();
  const [formItemDetails, setFormItemDetails] = useState<FormItemDetails[]>([]);
  const [formItems, setFormItems] = useState<ReactElement[]>([]);
  const [formItemsLength, setFormItemsLength] = useState(0);
  const [formName, setFormName] = useState("");
  const [selectedFormItem, setSelectedFormItem] = useState("");
  const [itemToDelete, setItemToDelete] = useState("");
  const [itemToCopy, setItemToCopy] = useState("");
  const [itemToEditName, setItemToEditName] = useState("");
  const [editedName, setEditedName] = useState("");
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [showSUAM, setShowSUAM] = useState(false);
  const [usersWithAccess, setUsersWithAccess] = useState<string[]>([]);

  useEffect(() => {
    setFormItemDetails(eFormItemDetails);
    const newFormItems: ReactElement[] = [];
    eFormItems.forEach((item) => {
      const newItem = (
        <FormItem
          key={item.key}
          id={item.props.id}
          title={item.props.title}
          color={item.props.color}
          icon={item.props.icon}
          formItemDetails={eFormItemDetails}
          setItemToCopy={setItemToCopy}
          setItemToDelete={setItemToDelete}
          setSelectedFormItem={setSelectedFormItem}
          setItemToEditName={setItemToEditName}
          setEditedName={setEditedName}
        />
      );
      newFormItems.push(newItem);
    });
    setFormItems(newFormItems);
    setFormItemsLength(eFormItemsLength);
    setFormName(eFormName);
    setUsersWithAccess(eUsersWithAccess);
  }, [eFormItemDetails, eFormItems, eFormItemsLength, eFormName, eCompanyName]);

  const fields = [
    { icon: "fas fa-font", label: "Input field", color: "text-teal-500" },
    { icon: "fas fa-align-left", label: "Text Area", color: "text-teal-500" },
    {
      icon: "fas fa-calendar-alt",
      label: "Date & Time",
      color: "text-teal-500",
    },
    { icon: "fas fa-check-square", label: "Check Box", color: "text-teal-500" },
    { icon: "fas fa-list", label: "List", color: "text-teal-500" },
    { icon: "fas fa-check-circle", label: "Choice", color: "text-teal-500" },
    { icon: "fas fa-camera", label: "Photo", color: "text-purple-500" },
    {
      icon: "fas fa-microphone",
      label: "Voice Recorder",
      color: "text-purple-500",
    },
    {
      icon: "fas fa-file-alt",
      label: "Attached file",
      color: "text-purple-500",
    },
    { icon: "fas fa-table", label: "Table", color: "text-green-500" },
    { icon: "fas fa-image", label: "Image", color: "text-gray-500" },
    { icon: "fas fa-calculator", label: "Calculation", color: "text-red-500" },
  ];

  const createFormItem = (icon: string, label: string, color: string) => {
    const title = label;
    formItemDetails.map((itemD) => {
      if (itemD.newTitle === label) {
        label = label + 1;
      }
    });
    const newFormItem = (
      <FormItem
        key={formItemsLength}
        id={formItemsLength.toString()}
        title={label}
        color={color}
        icon={icon}
        formItemDetails={formItemDetails}
        setItemToCopy={setItemToCopy}
        setItemToDelete={setItemToDelete}
        setSelectedFormItem={setSelectedFormItem}
        setItemToEditName={setItemToEditName}
        setEditedName={setEditedName}
      />
    );
    let newFormItemDetail: FormItemDetails = {
      title: title,
      newTitle: label,
      id: formItemsLength.toString(),
      size: "normal",
      color: color,
      newColor: "white",
      icon: icon,
    };
    if (label.includes("Input field")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "text",
        required: true,
        placeholder: "Default Text",
      };
    } else if (label.includes("Text Area")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        placeholder: "Default Text",
      };
    } else if (label.includes("Date & Time")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "datetime-local",
        defaultDate: "",
        defaultTime: "",
        required: true,
      };
    } else if (label.includes("Check Box")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        checkBoxDefaultValue: false,
        required: true,
      };
    } else if (label.includes("List")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        listItems: [],
        listMultipleSelection: false,
        listMulDefaultValue: [],
        listDefaultValue: "",
      };
    } else if (label.includes("Choice")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        listItems: [],
        listDefaultValue: "",
      };
    } else if (label.includes("Photo")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        multiplePics: false,
        minPics: 0,
        maxPics: 1,
        maxPicSize: 2,
      };
    } else if (label.includes("Voice Recorder")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
      };
    } else if (label.includes("Attached file")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        multipleAttachments: false,
      };
    } else if (label.includes("Table")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        required: true,
        tableCols: ["S.No."],
        tableMaxRows: 5,
      };
    } else if (label.includes("Image")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        imageFiles: [],
        imageFileNames: [],
        imageFileURLs: [],
      };
    } else if (label.includes("Calculation")) {
      newFormItemDetail = {
        ...newFormItemDetail,
        type: "add",
        calcInput1: "",
        calcInput2: "",
        typeOfI1: "",
      };
    }
    setFormItems([...formItems, newFormItem]);
    setFormItemDetails([...formItemDetails, newFormItemDetail]);
    setFormItemsLength(formItemsLength + 1);
  };
  const editFormItemName = useCallback(() => {
    const nfid = [...formItemDetails];
    const nfidArray = nfid.filter(
      (item) => item.id === itemToEditName.slice(1)
    );
    const nfi = [...formItems];
    const nfiArray = nfi.filter((item) => item.key === itemToEditName.slice(1));
    const item = nfiArray[0];
    const copy = React.cloneElement(item, {
      key: item.key,
      id: item.props.id,
      icon: item.props.icon,
      title: editedName,
      color: item.props.color,
    });
    const i = nfi.indexOf(item);
    nfi.splice(i, 1, copy);
    const itemD = nfidArray[0];
    itemD.newTitle = editedName;
    const index = nfid.indexOf(itemD);
    nfid.splice(index, 1, itemD);
    setFormItems(nfi);
    setFormItemDetails(nfid);
    setItemToEditName("");
    setEditedName("");
  }, [
    itemToEditName,
    setItemToEditName,
    editedName,
    setEditedName,
    formItems,
    setFormItems,
    formItemDetails,
    setFormItemDetails,
  ]);
  useEffect(() => {
    if (itemToEditName !== "" && editedName !== "") {
      editFormItemName();
    }
  }, [itemToEditName, editedName, editFormItemName]);
  const duplicateFormItem = useCallback(() => {
    const fiToCopy = formItems.filter(
      (item) => item.key === selectedFormItem.slice(1)
    );
    const index = formItems.indexOf(fiToCopy[0]);
    const ficopy = React.cloneElement(fiToCopy[0], {
      key: formItemsLength.toString(),
      id: formItemsLength.toString(),
      icon: fiToCopy[0].props.icon,
      title: `(copy) ${fiToCopy[0].props.title}`,
      color: fiToCopy[0].props.color,
      formItemDetails: formItemDetails,
    });
    const newFormItems = [...formItems];
    newFormItems.splice(index + 1, 0, ficopy);
    const fidToCopy = formItemDetails.filter(
      (itemD) => itemD.id === selectedFormItem.slice(1)
    );
    const i = formItemDetails.indexOf(fidToCopy[0]);
    const fidcopy = {
      ...fidToCopy[0],
      newTitle: `(copy) ${fidToCopy[0].newTitle}`,
      id: formItemsLength.toString(),
    };
    const newFormItemDetails = [...formItemDetails];
    newFormItemDetails.splice(i + 1, 0, fidcopy);
    setFormItemDetails(newFormItemDetails);
    setFormItems(newFormItems);
    setFormItemsLength(formItemsLength + 1);
  }, [formItems, selectedFormItem, formItemDetails, formItemsLength]);
  useEffect(() => {
    if (itemToCopy !== "") {
      duplicateFormItem();
      setItemToCopy("");
    }
  }, [itemToCopy, duplicateFormItem]);
  const deleteFormItem = () => {
    const newItems = formItems.filter((item) => item.key !== itemToDelete);
    const nfid = formItemDetails.filter((itemD) => itemD.id !== itemToDelete);
    setFormItemDetails(nfid);
    setFormItems(newItems);
    document.getElementById("deleteModal")!.classList.add("hidden");
    setItemToDelete("");
  };
  const unselectFormItem = useCallback((e: MouseEvent) => {
    if (
      ((e.target as HTMLElement) !== document.getElementById("leftPanel")! &&
        (e.target as HTMLElement).closest("#leftPanel")) ||
      (e.target as HTMLElement).closest("#upButton") ||
      (e.target as HTMLElement).closest("#downButton") ||
      (e.target as HTMLElement).closest("#editModal")
    ) {
      document.removeEventListener("click", unselectFormItem);
      return;
    } else {
      if (document.getElementById("leftPanel")) {
        const fItems = Array.from(
          document.getElementById("leftPanel")!.children
        );
        fItems.forEach((item) => {
          item.classList.remove("bg-orange-100");
        });
        setSelectedFormItem("");
      }
      document.removeEventListener("click", unselectFormItem);
    }
  }, []);
  useEffect(() => {
    if (selectedFormItem !== "") {
      const fItems = Array.from(document.getElementById("leftPanel")!.children);
      fItems.forEach((item) => {
        item.classList.remove("bg-orange-100");
      });
      document.getElementById(selectedFormItem)?.classList.add("bg-orange-100");
      document.addEventListener("click", unselectFormItem);
    }
  }, [selectedFormItem, unselectFormItem]);

  const validateFormBeforeSave = () => {
    if (setShowModifyFormModal && formName !== eFormName) {
      toast("Form Name can't be modified", { type: "error" });
      return false;
    }
    if (formName.length === 0) {
      toast("Form Name is Required", { type: "error" });
      return false;
    }
    if (formItems.length === 0) {
      toast("Atleast one form field is Required", {
        type: "error",
      });
      return false;
    }
    const validationErrors: string[] = [];
    formItemDetails.map((itemD) => {
      if (itemD.title === "Input field") {
        if (itemD.type === "") {
          validationErrors.push(`Type of ${itemD.newTitle} is Required`);
        }
      } else if (itemD.title === "Date & Time") {
        if (itemD.type === "") {
          validationErrors.push(`Type of ${itemD.newTitle} is Required`);
        }
      } else if (itemD.title === "List") {
        if (itemD.listItems!.length === 0) {
          validationErrors.push(
            `There should be atlest one list item in ${itemD.newTitle}`
          );
        }
      } else if (itemD.title === "Choice") {
        if (itemD.listItems!.length === 0) {
          validationErrors.push(
            `There should be atlest one item to choose in ${itemD.newTitle}`
          );
        }
      } else if (itemD.title === "Photo") {
        if (itemD.maxPicSize === 0) {
          validationErrors.push(
            `Maximum size of Photo is required in ${itemD.newTitle}`
          );
        }
        if (itemD.multiplePics) {
          if (itemD.maxPics === 0) {
            validationErrors.push(
              `Maximum number of Photos is required in ${itemD.newTitle}`
            );
          }
        }
      } else if (itemD.title === "Table") {
        if (
          itemD.tableCols!.length === 0 ||
          (itemD.tableCols!.length === 1 && itemD.tableCols![0] === "S.No.")
        ) {
          validationErrors.push(
            `There should be atleast one column in ${itemD.newTitle}`
          );
        }
      } else if (itemD.title === "Image") {
        if (itemD.imageFiles!.length === 0) {
          validationErrors.push(
            `There should be atleast one image in ${itemD.newTitle}`
          );
        }
      } else if (itemD.title === "Calculation") {
        if (itemD.type === "") {
          validationErrors.push(`Type of ${itemD.newTitle} is required`);
        }
        if (itemD.calcInput1 === "") {
          validationErrors.push(
            `Calculation input 1 is required in ${itemD.newTitle}`
          );
        }
        if (itemD.calcInput2 === "" || itemD.calcInput2 === "0") {
          validationErrors.push(
            `Calculation input 2 is required in ${itemD.newTitle}`
          );
        }
      }
    });
    if (validationErrors.length > 0) {
      toast(validationErrors.join(",\n"), { type: "error" });
      return false;
    }
    return true;
  };
  const saveFormToDatabase = async () => {
    setIsSavingForm(true);
    for (const itemD of formItemDetails) {
      if (itemD.title === "Image") {
        for (let i = 0; i < itemD.imageFiles!.length; i++) {
          const file = itemD.imageFiles![i];
          if (!file || !(file instanceof Blob)) {
          } else {
            const { success, url } = await uploadFileToS3(file);
            
            if (success) {
              itemD.imageFileURLs!.splice(i, 1, url!);
              itemD.imageFiles!.splice(i, 1);
            }
          }
        }
      }
    }
    try {
      let response;
      if (!setShowModifyFormModal) {
        response = await axios.post("/api/saveForm", {
          formName,
          formItemDetails,
          formItems,
          formItemsLength,
          companyName: eCompanyName,
          usersWithAccess,
          creatorEmail,
        });
      } else {
        response = await axios.post("/api/modifyForm", {
          formName,
          formItemDetails,
          formItems,
          formItemsLength,
          companyName: eCompanyName,
          usersWithAccess,
          creatorEmail,
        });
      }
      if (response.data.success) {
        toast(response.data.message, { type: "success" });
        if (!setShowModifyFormModal) {
          if (role === "user") {
            router.push(`/dashboard/myForms`);
          } else {
            router.push(`/${role}Dashboard/myForms`);
          }
        } else {
          setShowModifyFormModal(false);
        }
      } else {
        toast(response.data.message, { type: "error" });
      }
    } catch (error) {
      console.log(error);
      toast("Error saving the form, Please try again", {
        type: "error",
      });
    } finally {
      setIsSavingForm(false);
    }
  };
  return (
    <>
      <h1
        className={`w-full ${eFormName === "" ? "text-black" : "text-white"
          } text-center text-3xl font-bold p-5`}
      >
        {eFormName === "" ? "Create a form" : `Edit ${eFormName}`}
      </h1>
      <div className="w-full bg-gray-100 p-4 rounded-lg space-y-2 overflow-auto max-sm:text-xs max-sm:mb-5">
        <div className="w-full flex max-sm:flex-col items-center p-4 bg-white rounded-lg">
          <div className="max-sm:w-full w-1/2 flex justify-between">
            <label className="text-md font-semibold text-gray-800 mr-2">
              Form
            </label>
            <div className="flex-1">
              <input
                type="text"
                maxLength={150}
                placeholder="Name your form"
                className="w-full border-b border-gray-300 focus:outline-none text-gray-500 bg-transparent"
                defaultValue={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                }}
              />
              <p className="text-right text-gray-500 text-xs">
                {formName.length} / 150
              </p>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-end space-x-10 pl-20 max-sm:hidden">
            <i className="fas fa-list text-green-500"></i>
            <i className="fas fa-users text-gray-400"></i>
            <i className="fas fa-file-export text-gray-400"></i>
            <i className="fas fa-share-alt text-gray-400"></i>
            <i className="fas fa-cog text-gray-400"></i>
            <i className="fas fa-search text-gray-400"></i>
          </div>
        </div>
        <div className="w-full flex max-sm:flex-col-reverse max-sm:gap-5">
          {/* Left Panel */}
          <div className="max-sm:w-full sm:w-1/2 flex flex-col">
            <div
              id="leftPanel"
              className="w-full h-[300px] bg-gray-200 rounded-lg shadow space-y-1 overflow-auto"
            >
              {formItems.map((item, index) => {
                return <React.Fragment key={index}>{item}</React.Fragment>;
              })}
            </div>
            <div className="flex justify-start space-x-2 mt-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
                disabled={selectedFormItem === ""}
                onClick={() => {
                  duplicateFormItem();
                }}
              >
                Duplicate
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
                disabled={selectedFormItem === ""}
                onClick={() => {
                  setItemToDelete(selectedFormItem.slice(1));
                  document
                    .getElementById("deleteModal")
                    ?.classList.remove("hidden");
                }}
              >
                Delete
              </button>
              <button
                id="upButton"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
                disabled={selectedFormItem === ""}
                onClick={() => {
                  const formItemToMove = formItems.filter(
                    (item) => item.key === selectedFormItem.slice(1)
                  );
                  const index = formItems.indexOf(formItemToMove[0]);
                  if (index === 0) return;
                  const newFormItems = [...formItems];
                  [newFormItems[index - 1], newFormItems[index]] = [
                    newFormItems[index],
                    newFormItems[index - 1],
                  ];
                  setFormItems(newFormItems);
                }}
              >
                <i className="fas fa-arrow-up"></i>
              </button>
              <button
                id="downButton"
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded disabled:bg-gray-200 disabled:text-gray-300"
                disabled={selectedFormItem === ""}
                onClick={() => {
                  const formItemToMove = formItems.filter(
                    (item) => item.key === selectedFormItem.slice(1)
                  );
                  const index = formItems.indexOf(formItemToMove[0]);
                  if (index === formItemsLength - 1) return;
                  const newFormItems = [...formItems];
                  [newFormItems[index], newFormItems[index + 1]] = [
                    newFormItems[index + 1],
                    newFormItems[index],
                  ];
                  setFormItems(newFormItems);
                }}
              >
                <i className="fas fa-arrow-down"></i>
              </button>
            </div>
          </div>
          {/* Right Panel */}
          <div className="max-sm:w-full w-1/2 sm:ml-4">
            <div className="grid grid-cols-3 gap-2">
              {fields.map((f, index) => (
                <button
                  key={index}
                  className="bg-gray-200 p-2 rounded-lg flex items-center justify-center"
                  onClick={() => createFormItem(f.icon, f.label, f.color)}
                >
                  <i className={`${f.icon} ${f.color}`} />
                  <span className="ml-2">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={async () => {
              if (validateFormBeforeSave()) {
                setShowSUAM(true);
              }
            }}
          >
            {isSavingForm ? (
              <div className="flex items-center justify-center space-x-2 text-white">
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-white">
                <i className="fas fa-check mr-2" />
                <span>Save</span>
              </div>
            )}
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => {
              if (!setShowModifyFormModal) {
                setFormItemDetails([]);
                setFormItems([]);
                if (role === "user") {
                  router.push(`/dashboard/myForms`);
                } else {
                  router.push(`/${role}Dashboard/myForms`);
                }
              } else {
                setShowModifyFormModal?.(false);
              }
            }}
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Quit
          </button>
        </div>
        {/* Delete Modal */}
        <DeleteModal deleteFormItem={deleteFormItem} />
        {/* Select Users for access Modal */}
        <SelectUserAccessModal
          showSUAM={showSUAM}
          setShowSUAM={setShowSUAM}
          isSavingForm={isSavingForm}
          companyName={eCompanyName}
          usersWithAccess={usersWithAccess}
          setUsersWithAccess={setUsersWithAccess}
          saveFormToDatabase={saveFormToDatabase}
        />
        {/* edit Modal */}
        <div
          id="editModal"
          className="fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center hidden overflow-auto"
        >
          <div className="bg-white shadow-lg rounded-lg w-full max-w-lg max-w-4xl p-3">
            {formItemDetails.map((itemD, index) => {
              if (itemD.id === selectedFormItem.slice(1)) {
                switch (itemD.title) {
                  case "Input field":
                    return (
                      <EditInputField
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Text Area":
                    return (
                      <EditTextArea
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Date & Time":
                    return (
                      <EditDateTime
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Check Box":
                    return (
                      <EditCheckBox
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "List":
                    return (
                      <EditList
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Choice":
                    return (
                      <EditChoice
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Photo":
                    return (
                      <EditPhoto
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Voice Recorder":
                    return (
                      <EditVoiceRecorder
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Attached file":
                    return (
                      <EditAttachedFile
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Table":
                    return (
                      <EditTable
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Image":
                    return (
                      <EditImage
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                  case "Calculation":
                    return (
                      <EditCalculation
                        key={index}
                        itemD={itemD}
                        formItemDetails={formItemDetails}
                        setFormItemDetails={setFormItemDetails}
                        setEditedName={setEditedName}
                        setItemToEditName={setItemToEditName}
                      />
                    );
                }
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
}
