
import React from 'react';
import {HomeIcon, VideoCameraIcon , ArrowRightOnRectangleIcon} from "@heroicons/react/24/solid"

const Sidebar = () => {
  return (

  <div className="fixed flex flex-col top-0 left-0 w-64 bg-gray-50 h-full border-r border-indigo-200">
    <div className="flex items-center justify-center h-14 ">
      <div className='text-gray-600 hover:text-gray-800 ' > Law<span className="text-sm text-indigo-600 font-bold">Tube</span></div>
      
    </div>
    <div className="overflow-y-auto overflow-x-hidden flex-grow">
      <div className='flex flex-col items-center justify-center mt-2'>
        <div className="mb-4 relative inline-flex items-center justify-center w-20 h-20 overflow-hidden bg-indigo-600 rounded-full ">
          <span className="font-medium text-gray-600 dark:text-gray-300">A</span>
        </div>
        <span className="text-gray-600 hover:text-gray-800 text-sm tracking-wide font-semibold">Asyraf</span>

      </div>
      <div className='mt-4 border-b-2'></div>
      <ul className="flex flex-col py-4 space-y-1">
        <li className="px-5">
          <div className="flex flex-row items-center h-8">
            <div className="text-sm font-light tracking-wide text-gray-500">Menu</div>
          </div>
        </li>
        <li>
          <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <HomeIcon className='ml-4 h-5 w-5'/>
            <span className="ml-2 text-sm tracking-wide truncate"> Feeds </span>
          </a>
        </li>
        <li>
          <a href="#" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <VideoCameraIcon className='ml-4 h-5 w-5'/>
            <span className="ml-2 text-sm tracking-wide truncate"> Highlight </span>
            <span className="px-2 py-0.5 ml-auto text-xs font-medium tracking-wide text-indigo-500 bg-indigo-50 rounded-full">New</span>
          </a>
        </li>

        <li>
          <a href="/auth/login" className="relative flex flex-row items-center h-11 focus:outline-none hover:bg-gray-50 text-gray-600 hover:text-gray-800 border-l-4 border-transparent hover:border-indigo-500 pr-6">
            <ArrowRightOnRectangleIcon className='ml-4 h-5 w-5'/>
            <span className="ml-2 text-sm tracking-wide truncate">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>

  )
};
export default Sidebar;
