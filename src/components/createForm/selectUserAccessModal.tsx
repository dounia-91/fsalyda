import { User } from "@/model/user";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  isSavingForm: boolean;
  showSUAM: boolean;
  setShowSUAM: React.Dispatch<React.SetStateAction<boolean>>;
  companyName: string;
  usersWithAccess: string[];
  setUsersWithAccess: React.Dispatch<React.SetStateAction<string[]>>;
  saveFormToDatabase: () => void;
};

export default function SelectUserAccessModal({
  showSUAM,
  setShowSUAM,
  isSavingForm,
  companyName,
  usersWithAccess,
  setUsersWithAccess,
  saveFormToDatabase,
}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  useEffect(() => {
    const getUsers = async () => {
      if (companyName) {
        setLoadingUsers(true);
        try {
          const responseStream = await fetch(
            `/api/getUsersByCompany?companyName=${companyName}`,
            {
              cache: "no-store",
            }
          );
          const response = await responseStream.json();
          if (response.success) {
            setUsers(response.users);
          } else {
            setUsers([]);
          }
        } catch (error) {
          console.log(error);
          setUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      }
    };
    getUsers();
  }, [companyName]);
  return (
    <div
      className={`fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex items-center justify-center overflow-auto ${
        showSUAM ? "" : "hidden"
      }`}
    >
      <div className="w-full max-w-lg bg-white flex flex-col items-center justify-start rounded-lg p-5">
        <h1 className="w-full text-2xl text-center font-bold">
          Select Users who can Access this Form
        </h1>
        <div className="w-full min-h-20 max-h-60 flex flex-col items-center justify-start p-2 overflow-auto">
          {loadingUsers ? (
            <Loader2 className="animate-spin w-10 h-10" />
          ) : users.length === 0 ? (
            "No users found"
          ) : (
            users.map((user, i) => {
              return (
                <div
                  key={i}
                  className="w-full flex items-center justify-start space-x-2"
                >
                  <input
                    type="checkbox"
                    id={`${user.name}chkbox`}
                    className="w-5 h-5"
                    checked={usersWithAccess?.includes(user.email)}
                    onChange={(e) => {
                      const newUsersWithAccess: string[] = [];
                      usersWithAccess?.map((email) =>
                        newUsersWithAccess.push(email)
                      );
                      if (e.target.checked) {
                        newUsersWithAccess.push(user.email);
                      } else {
                        const index = newUsersWithAccess.indexOf(user.email);
                        newUsersWithAccess.splice(index, 1);
                      }
                      setUsersWithAccess(newUsersWithAccess);
                    }}
                  />
                  <label htmlFor={`${user.name}chkbox`}>{user.name}</label>
                </div>
              );
            })
          )}
        </div>
        <div className="w-full flex items-center justify-between">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={() => setShowSUAM(false)}
          >
            Discard
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center"
            onClick={async () => {
              saveFormToDatabase();
              setShowSUAM(false);
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
        </div>
      </div>
    </div>
  );
}
