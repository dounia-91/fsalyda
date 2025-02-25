"use client";
import CreateForm from "@/components/createForm/createForm";
import { useSession } from "next-auth/react";

export default function CreateFormPage() {
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const email: string = session?.user.email;
  const role: string = session?.user.role;
  return (
    <div className="w-full h-full flex flex-col px-5 bg-slate-400">
      <CreateForm
        eFormItemDetails={[]}
        eFormItems={[]}
        eFormItemsLength={0}
        eFormName=""
        eCompanyName={companyName}
        eUsersWithAccess={[]}
        role={role}
        creatorEmail={email}
        setShowModifyFormModal={null}
      />
    </div>
  );
}
