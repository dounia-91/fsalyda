import { FormItemDetails } from "@/types/types";
import Image from "next/image";

type Props = {
  itemD: FormItemDetails;
  preview?: boolean;
};

export default function RenderImage({ itemD }: Props) {
  console.log("itemD", itemD);

  return (
    <div className="w-full flex flex-col items-start justify-start space-y-2">
      <p
        className={`${itemD.size === "smaller"
            ? "text-md"
            : itemD.size === "normal"
              ? "text-lg"
              : "text-xl"
          } font-bold text-${itemD.newColor}`}
      >
        {itemD.newTitle} :
      </p>
      <div className="w-full bg-white rounded-lg p-2 flex flex-wrap justify-center gap-5">
        {itemD.imageFileURLs?.map((key, index) => {
          
          return (
            <Image key={index} src={`https://fsalyda-stockage-2025.s3.amazonaws.com/${key}`} alt="image" width={400} height={200} />
            // const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;

            // <Image
            //     key={index}
            //     // src={`/api/image-proxy?key=uploads/bc5c6a4c-e0aa-44b3-8ae2-8c8196842b97_Uploaded_Image_16`}
            //     src={`/api/image-proxy?key=""`}

            //     alt="image"
            //     width={400}
            //     height={200}
            //   />
          );
        })}
      </div>
    </div>
  );
}
