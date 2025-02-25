"use client";
import React from "react";
import { User } from "@/model/user";
import { toast } from "react-toastify";
import { DeleteUser } from "@/actions/deleteUserById";

type Props = {
  user: User;
  role: string;
  getAllUsers: () => void;
};
export default function UserList({ user, role, getAllUsers }: Props) {
  return (
    <div className="w-full flex max-sm:flex-col items-center justify-between text-center font-bold max-sm:px-1 p-2 gap-2 border border-black rounded-lg">
      <div
        className={`max-sm:w-full ${
          role === "admin" ? "sm:w-5/6" : "sm:w-3/4"
        } flex items-center justify-between text-center`}
      >
        {role === "admin" && (
          <>
            <span className="w-1/5 text-ellipsis whitespace-nowrap overflow-hidden">
              {user.companyName}
            </span>
            <span className="w-1/5 text-ellipsis whitespace-nowrap overflow-hidden">
              {user.role}
            </span>
          </>
        )}
        <span
          className={`${
            role === "admin" ? "w-1/5" : "w-1/3"
          } text-ellipsis whitespace-nowrap overflow-hidden`}
        >
          {user.name}
        </span>
        <span
          className={`${
            role === "admin" ? "w-1/5" : "w-1/3"
          } text-ellipsis whitespace-nowrap overflow-hidden`}
        >
          {user.email}
        </span>
        <span
          className={`${
            role === "admin" ? "w-1/5" : "w-1/3"
          } text-ellipsis whitespace-nowrap overflow-hidden`}
        >
          {user.password}
        </span>
      </div>
      <div
        className={`max-sm:w-full ${
          role === "admin" ? "sm:w-1/6" : "sm:w-1/4"
        } flex justify-center items-center gap-2`}
      >
        <button
          className="max-sm:p-1 sm:p-2 max-sm:rounded-md sm:rounded-lg bg-white"
          onClick={async () => {
            const resp = await DeleteUser(user._id as string);
            if (resp.success) {
              toast(resp.message, { type: "success" });
              getAllUsers();
            } else {
              toast(resp.message, { type: "error" });
              if (resp.error) {
                console.log(resp.error);
              }
            }
          }}
        >
          <i className="fa fa-trash" />
        </button>
      </div>
    </div>
  );
}
