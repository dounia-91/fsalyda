export interface FormState {
  [key: string]: string | boolean | string[] | File[] | Blob[] | string[][];
}
export interface FilledFormsMap {
  [formName: string]: FilledForm[] | undefined;
}
export type FormItemDetails = {
  id: string;
  title: string;
  newTitle: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  size?: string;
  color?: string;
  newColor?: string;
  icon?: string;
  defaultDate?: string;
  defaultTime?: string;
  checkBoxDefaultValue?: boolean;
  listItems?: string[];
  listMultipleSelection?: boolean;
  listDefaultValue?: string;
  listMulDefaultValue?: string[];
  multiplePics?: boolean;
  minPics?: number;
  maxPics?: number;
  maxPicSize?: number;
  multipleAttachments?: boolean;
  tableCols?: string[];
  tableMaxRows?: number;
  imageFileNames?: string[];
  imageFiles?: File[];
  imageFileURLs?: string[];
  calcInput1?: string;
  typeOfI1?: string;
  calcInput2?: string;
};
