"use client";
import CreateUserForm from "@/components/createUserForms/createUserForm";
import UserList from "@/components/userList";
import { User } from "@/model/user";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const companyName = session?.user.companyName;
  const role = session?.user.role;
  const email = session?.user.email;
  const [users, setUsers] = useState<User[]>([]);
  const getAllUsers = async () => {
    try {
      const responseStream = await fetch(
        `/api/getUsersByCompany?companyName=${companyName}`
      );
      const response = await responseStream.json();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (e) {
      console.log(e);
      setUsers([]);
    }
  };
  useEffect(() => {
    getAllUsers();
    const intervalId = setInterval(getAllUsers, 10000); // Fetch data every 10 seconds
    return () => clearInterval(intervalId);
  }, [session]);
  return (
    <div className="w-full h-full flex flex-col bg-background bg-auto bg-no-repeat bg-center">
      <div className="w-full h-full flex flex-col space-y-10 max-sm:p-2 p-5 overflow-auto bg-gradient-to-br from-blue-600/50 to-blue-200/50">
        <h1 className="w-full text-center text-3xl font-bold">Users</h1>
        <div className="flex flex-col items-center bg-white/30 backdrop-blur-sm rounded-lg max-sm:px-1 max-sm:py-2 p-2 space-y-5 max-sm:text-xs">
          <CreateUserForm
            role={role}
            creatorEmail={email}
            companies={[companyName]}
            getAllUsers={getAllUsers}
          />
          {users?.length === 0 ? (
            <div className="w-full flex flex-col space-y-2">
              <p className="text-center text-xl font-bold">
                No Users Found, Please Create a User
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col space-y-2">
              <div className="w-full flex max-sm:flex-col items-center justify-between text-center font-bold max-sm:p-1 p-2 gap-2 bg-amber-200 rounded-lg">
                <div className="max-sm:w-full sm:w-3/4 flex items-center justify-between">
                  <span className="max-sm:w-1/3 w-1/3">Name</span>
                  <span className="max-sm:w-1/3 w-1/3">Email</span>
                  <span className="max-sm:w-1/3 w-1/3">Password</span>
                </div>
                <span className="max-sm:hidden w-1/4">Actions</span>
              </div>
              {users?.map((user, index) => (
                <UserList
                  key={index}
                  user={user}
                  role={role}
                  getAllUsers={getAllUsers}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
