
import React from 'react';
import { HomeIcon, VideoCameraIcon, ArrowRightOnRectangleIcon, PlayIcon, Bars3Icon } from "@heroicons/react/24/solid"
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface NavWrapperProps {
  children: React.ReactNode
  className?: string
}

const Sidebar: React.FC<NavWrapperProps> = ({ children, className }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("Authorization");
    if (!router.pathname.startsWith("/auth")) {
      if (!auth || auth === "") {
        router.push('/auth/login');
      } else {
        getUserDetail(auth);
      }
    }
  }, [router]);

  const getUserDetail = async (auth: any) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
        headers: {
          Authorization: auth,
        },
      });
      console.log(response.data)
      setUser(response.data.data);

    } catch (error) {
      console.error(error);

    }
  };
  const logout = async () => {
    try {

      localStorage.setItem("Authorization", "");
      toast.success("Logout Successful", {
        position: "bottom-right",
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      router.push("/auth/login");
    } catch (error) {
      console.error(error);

    }
  };
  return (<>
    <div className="drawer drawer-mobile">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content bg-base-1">
        <div className="block lg:hidden bg-base-1 w-full flex items-center h-16 px-4 space-x-4">
          <label htmlFor="my-drawer">
            <Bars3Icon className="h-8 text-neutral-4" />
          </label>
        </div>
        <div className={className}>
          {children}
        </div>
      </div>
      {
        !router.pathname.startsWith("/auth") && (
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu w-80 bg-base-1 text-base-content space-y-8">
              <div className="flex flex-col bg-gray-50 h-full border-r border-indigo-200">
                <div className="flex items-center justify-center h-14 text-lg">
                  <div className='text-gray-600 hover:text-gray-800 ' > Law<span className="text-indigo-600 font-bold">Tube</span></div>
                </div>
                <div className="overflow-y-auto overflow-x-hidden flex-grow">
                  <div className='flex flex-col items-center justify-center mt-2'>
                    <div className="mb-4 relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-indigo-600 rounded-full ">
                      <span className="font-medium text-gray-600 dark:text-gray-300">{user?.username.slice(0, 1)}</span>
                    </div>
                    <span className="text-gray-600 hover:text-gray-800 text-sm tracking-wide font-semibold">{user?.username}</span>
                    <span className="text-gray-600 hover:text-gray-800 text-sm tracking-wide ">{user?.email}</span>

                  </div>
                  <div className='mt-4 border-b-2'></div>
                  <ul className="flex flex-col py-4 space-y-1">
                    <li className="px-5">
                      <div className="flex flex-row items-center h-8">
                        <div className="text-sm font-light tracking-wide text-gray-500">Menu</div>
                      </div>
                    </li>
                    <li>
                      <Link href="/" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <HomeIcon className='ml-4 h-5 w-5' />
                        <span className="ml-2 text-sm tracking-wide truncate"> Feeds </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/your-video" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <PlayIcon className='ml-4 h-5 w-5' />
                        <span className="ml-2 text-sm tracking-wide truncate"> Your Video </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/add-video" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <VideoCameraIcon className='ml-4 h-5 w-5' />
                        <span className="ml-2 text-sm tracking-wide truncate"> Add Video </span>
                        <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">New</span>
                      </Link>
                    </li>

                    <li>
                      <button onClick={logout} className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
                        <ArrowRightOnRectangleIcon className='ml-4 h-5 w-5' />
                        <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </ul>
          </div>
        )
      }
    </div>
  </>
  )
};
export default Sidebar;
