import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Props = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
};

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: Props) {
  const { data: session } = useSession();
  const companyName: string = session?.user.companyName;
  const role: string = session?.user.role;
  const pathName = usePathname();
  const [isFormsMenuOpen, setIsFormsMenuOpen] = useState(false);
  const pages = {
    dashboard: ["/dashboard", "/managerDashboard", "/adminDashboard"],
    users: ["/managerDashboard/users", "/adminDashboard/users"],
    createForm: ["/managerDashboard/createForm", "/adminDashboard/createForm"],
    myForms: [
      "/dashboard/myForms",
      "/managerDashboard/myForms",
      "/adminDashboard/myForms",
    ],
  };

  return (
    <div
      className={`${
        !isSidebarOpen && "max-sm:hidden"
      } relative w-full h-full flex flex-col justify-start items-center px-2 py-5 space-y-5 bg-black text-white shadow-md`}
    >
      <span
        className={`w-10 h-10 self-end flex items-center justify-center rounded-full border border-2 border-white`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <i
          className={`fa-solid fa-arrow-left text-white text-2xl transform ${
            isSidebarOpen ? "" : "rotate-180"
          }`}
        />
      </span>
      <h1 className="max-sm:text-lg w-full text-2xl text-center pb-20 whitespace-nowrap overflow-hidden text-ellipsis">
        {companyName ?? "companyName"}
      </h1>
      <ul className="w-full flex flex-col space-y-2">
        <li
          className={`w-full cursor-pointer rounded-lg ${
            pages.dashboard.includes(pathName) ? "bg-[#C4A682]" : "bg-white/10"
          }`}
          onClick={() => {
            setIsFormsMenuOpen(false);
            setIsSidebarOpen(false);
          }}
        >
          <Link
            href="/dashboard"
            className="w-full flex items-center justify-start space-x-3 p-2"
          >
            <i className="fas fa-home text-lg" />
            <span className={`text-lg ${isSidebarOpen ? "" : "hidden"}`}>
              Dashboard home
            </span>
          </Link>
        </li>
        <li
          className={`w-full cursor-pointer rounded-lg ${
            pages.users.includes(pathName) ? "bg-[#C4A682]" : "bg-white/10"
          } ${role === "user" ? "hidden" : ""}`}
          onClick={() => {
            setIsFormsMenuOpen(false);
            setIsSidebarOpen(false);
          }}
        >
          <Link
            href={`/${role}Dashboard/users`}
            className="w-full flex items-center justify-start space-x-3 p-2 "
          >
            <i className="fas fa-user text-lg" />
            <span className={`text-lg ${isSidebarOpen ? "" : "hidden"}`}>
              Users
            </span>
          </Link>
        </li>
        <li className="w-full flex flex-col">
          <div
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              pages.createForm.includes(pathName) ||
              pages.myForms.includes(pathName)
                ? "bg-[#C4A682]"
                : "bg-white/10"
            }
            `}
            onClick={() => setIsFormsMenuOpen(!isFormsMenuOpen)}
          >
            <span className="space-x-3">
              <i className="fas fa-list text-lg" />
              <span className={`text-lg ${isSidebarOpen ? "" : "hidden"}`}>
                Forms
              </span>
            </span>
            <span className={`${isSidebarOpen ? "" : "hidden"}`}>
              <i
                className={`fas fa-chevron-down  transform ${
                  isFormsMenuOpen ? "rotate-180" : ""
                }`}
              />
            </span>
          </div>
          <ul
            className={`${isSidebarOpen ? "px-2" : ""} py-2 space-y-2 ${
              isFormsMenuOpen ? "" : "hidden"
            }`}
          >
            <li
              className={`p-2 rounded-lg cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                role === "user" ? "hidden" : ""
              } ${
                pages.createForm.includes(pathName)
                  ? "bg-[#C4A682]"
                  : "bg-white/10"
              }
              `}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            >
              <Link
                href={`/${role}Dashboard/createForm`}
                className="w-full flex items-center justify-start"
              >
                Create a form
              </Link>
            </li>
            <li
              className={`p-2 rounded-lg cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis ${
                pages.myForms.includes(pathName)
                  ? "bg-[#C4A682]"
                  : "bg-white/10"
              }
              `}
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            >
              <Link
                href={
                  role === "user"
                    ? "/dashboard/myForms"
                    : `/${role}Dashboard/myForms`
                }
                className="w-full flex items-center justify-start"
              >
                My forms
              </Link>
            </li>
          </ul>
        </li>
      </ul>

      <div
        className="absolute bottom-0 w-full flex items-center justify-center p-4 border-t border-white/50"
        onClick={() => signOut({ callbackUrl: "/signin" })}
      >
        <i className="fas fa-power-off text-xl mx-auto block"></i>
      </div>
    </div>
  );
}
