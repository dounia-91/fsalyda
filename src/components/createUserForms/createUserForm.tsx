"use client";
import React, { useRef, useState } from "react";
import {
  userFormValidation,
  managerFormValidation,
  adminFormValidation,
} from "@/schemas/signUpSchema";
import { toast } from "react-toastify";
import { CreateUser } from "@/actions/createUser";
import { CreateManager } from "@/actions/createManager";
import { CreateAdmin } from "@/actions/createAdmin";

type Props = {
  role: string;
  creatorEmail: string;
  companies: string[];
  getAllUsers: () => void;
};

export default function CreateUserForm({
  creatorEmail,
  role,
  companies,
  getAllUsers,
}: Props) {
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showCreateManagerForm, setShowCreateManagerForm] = useState(false);
  const [showCreateAdminForm, setShowCreateAdminForm] = useState(false);
  const userFormRef = useRef<HTMLFormElement>(null);
  const managerFormRef = useRef<HTMLFormElement>(null);
  const adminFormRef = useRef<HTMLFormElement>(null);

  const validateUserForm = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, error } = userFormValidation.safeParse(formDataObject);
    if (success) {
      return true;
    } else {
      const errors: string[] = [];
      error.errors.map((e) => {
        errors.push(e.message);
      });
      toast(errors.join(",\n"), { type: "error" });
      return false;
    }
  };
  const validateManagerForm = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, error } = managerFormValidation.safeParse(formDataObject);
    if (success) {
      return true;
    } else {
      const errors: string[] = [];
      error.errors.map((e) => {
        errors.push(e.message);
      });
      toast(errors.join(",\n"), { type: "error" });
      return false;
    }
  };
  const validateAdminForm = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, error } = adminFormValidation.safeParse(formDataObject);
    if (success) {
      return true;
    } else {
      const errors: string[] = [];
      error.errors.map((e) => {
        errors.push(e.message);
      });
      toast(errors.join(",\n"), { type: "error" });
      return false;
    }
  };
  return (
    <>
      <div className="flex items-center justify-center space-x-5 text-white">
        <button
          className="max-w-md max-sm:text-xs p-2 bg-black rounded-md disabled:bg-black/50"
          onClick={() => {
            setShowCreateUserForm(true);
            setShowCreateManagerForm(false);
            setShowCreateAdminForm(false);
            userFormRef.current?.reset();
            managerFormRef.current?.reset();
            adminFormRef.current?.reset();
          }}
          disabled={showCreateUserForm}
        >
          Create a new user account
        </button>
        {role === "admin" && (
          <>
            <button
              className="max-w-md max-sm:text-xs p-2 bg-black rounded-md disabled:bg-black/50"
              onClick={() => {
                setShowCreateUserForm(false);
                setShowCreateManagerForm(true);
                setShowCreateAdminForm(false);
                userFormRef.current?.reset();
                managerFormRef.current?.reset();
                adminFormRef.current?.reset();
              }}
              disabled={showCreateManagerForm}
            >
              Create a new company account
            </button>
            <button
              className="max-w-md max-sm:text-xs p-2 bg-black rounded-md disabled:bg-black/50"
              onClick={() => {
                setShowCreateUserForm(false);
                setShowCreateManagerForm(false);
                setShowCreateAdminForm(true);
                userFormRef.current?.reset();
                managerFormRef.current?.reset();
                adminFormRef.current?.reset();
              }}
              disabled={showCreateAdminForm}
            >
              Create a new admin account
            </button>
          </>
        )}
      </div>
      <form
        ref={userFormRef}
        action={async (formData) => {
          if (role === "manager") {
            formData.append("companyName", companies[0]);
          }
          if (validateUserForm(formData)) {
            const resp = await CreateUser(formData, creatorEmail);
            if (resp.success) {
              userFormRef.current?.reset();
              setShowCreateUserForm(false);
              toast(resp.message, { type: "success" });
              getAllUsers();
            } else {
              toast(resp.message, { type: "error" });
              if (resp.error) {
                console.log(resp.error);
              }
            }
          }
        }}
        className={`w-full flex flex-col items-center justify-between p-2 gap-2 ${
          showCreateUserForm ? "" : "hidden"
        }`}
      >
        <div className="w-full flex max-sm:flex-col max-sm:items-center items-start justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
          {role === "admin" && (
            <select
              name="companyName"
              className="bg-white max-sm:w-full sm:w-1/4 p-2 rounded-md"
            >
              <option value="">Select Company</option>
              {companies?.map((c, i) => {
                return (
                  <option key={i} value={c}>
                    {c}
                  </option>
                );
              })}
            </select>
          )}
          <input
            type="text"
            name="fullName"
            placeholder="Name"
            className="bg-white max-sm:w-full sm:w-1/4 p-2 rounded-md"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="bg-white max-sm:w-full sm:w-1/4 p-2 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-white max-sm:w-full sm:w-1/4 p-2 rounded-md"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-white">
          <button
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            onClick={() => {
              userFormRef.current?.reset();
              setShowCreateUserForm(false);
            }}
          >
            Discard
          </button>
        </div>
      </form>
      <form
        ref={managerFormRef}
        action={async (formData) => {
          if (validateManagerForm(formData)) {
            const resp = await CreateManager(formData, creatorEmail);
            if (resp.success) {
              managerFormRef.current?.reset();
              toast(resp.message, { type: "success" });
              setShowCreateManagerForm(false);
              getAllUsers();
            } else {
              toast(resp.message, { type: "error" });
              if (resp.error) {
                console.log(resp.error);
              }
            }
          }
        }}
        className={`w-full flex flex-col items-center justify-between p-2 gap-2 ${
          showCreateManagerForm ? "" : "hidden"
        }`}
      >
        <div className="w-full flex max-sm:flex-col max-sm:items-center items-start justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            className="bg-white max-sm:w-full sm:w-1/5 p-2 rounded-md placeholder:text-sm"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Name"
            className="bg-white max-sm:w-full sm:w-1/5 p-2 rounded-md placeholder:text-sm"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="bg-white max-sm:w-full sm:w-1/5 p-2 rounded-md placeholder:text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-white max-sm:w-full sm:w-1/5 p-2 rounded-md placeholder:text-sm"
          />
          <input
            type="number"
            min={1}
            name="maxUsers"
            placeholder="Maximum no. of users"
            className="bg-white max-sm:w-full sm:w-1/5 p-2 rounded-md placeholder:text-sm"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-white">
          <button
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            onClick={() => {
              managerFormRef.current?.reset();
              setShowCreateManagerForm(false);
            }}
          >
            Discard
          </button>
        </div>
      </form>
      <form
        ref={adminFormRef}
        action={async (formData) => {
          if (validateAdminForm(formData)) {
            const resp = await CreateAdmin(formData, creatorEmail);
            if (resp.success) {
              adminFormRef.current?.reset();
              setShowCreateAdminForm(false);
              toast(resp.message, { type: "success" });
              getAllUsers();
            } else {
              toast(resp.message, { type: "error" });
              if (resp.error) {
                console.log(resp.error);
              }
            }
          }
        }}
        className={`w-full flex flex-col items-center justify-between p-2 gap-2 ${
          showCreateAdminForm ? "" : "hidden"
        }`}
      >
        <div className="w-full flex max-sm:flex-col max-sm:items-center items-start justify-between font-bold p-2 gap-2 bg-[#FFEEAD] rounded-lg">
          <input
            type="text"
            name="fullName"
            placeholder="Name"
            className="bg-white max-sm:w-full sm:w-1/3 p-2 rounded-md"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="bg-white max-sm:w-full sm:w-1/3 p-2 rounded-md"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-white max-sm:w-full sm:w-1/3 p-2 rounded-md"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-white">
          <button
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            type="submit"
          >
            Submit
          </button>
          <button
            type="button"
            className="max-w-md max-sm:text-xs p-2 bg-black rounded-md"
            onClick={() => {
              adminFormRef.current?.reset();
              setShowCreateAdminForm(false);
            }}
          >
            Discard
          </button>
        </div>
      </form>
    </>
  );
}
