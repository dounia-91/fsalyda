import { FormItemDetails } from "@/types/types";
import Image from "next/image";

type Props = {
  itemD: FormItemDetails;
  preview?: boolean;
};

export default function RenderImage({ itemD }: Props) {
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
      <div className="w-full bg-white rounded-lg p-2 flex flex-wrap justify-center gap-5">
        {itemD.imageFileURLs?.map((url, index) => {
          return (
            <Image key={index} src={url} alt="image" width={400} height={200} />
          );
        })}
      </div>
    </div>
  );
}
