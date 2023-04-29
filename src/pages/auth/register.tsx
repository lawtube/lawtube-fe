import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";


const Register = (props: any) => {
    const [userInput, setUserInput] = useState({ username: "", email: "", password: "" });
    const router = useRouter();


    const handleChange = (event: any) => {
        const value = event.target.value;
        setUserInput({ ...userInput, [event.target.name]: value });
    };

    const onSubmit = async (e: any) => {
        e.preventDefault();

    };

    return (
        
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen md:gap-10">
        <div className="flex items-center justify-center md:w-1/4">
          <img src="https://media.discordapp.net/attachments/1096015724813746246/1101482552860102656/Croods_Mobile.png?width=250&height=212" className="h-56 object-cover" />
        </div>
        <div className="flex flex-col md:w-1/2 sm:max-w-sm">
          <form className="flex flex-col gap-2">
            <label className="text-sm font-medium leading-6 text-gray-900">Username</label>
            <input id="username" name="username" type="text" required className="rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2" />
            <label className="text-sm font-medium leading-6 text-gray-900">Email</label>
            <input id="email" name="email" type="email" required className="rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2" />
            <label className="text-sm font-medium leading-6 text-gray-900">Password</label>
            <input id="password" name="password" type="password" required className="rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-2" />
      
            <button type="submit" className="bg-indigo-600 text-white rounded-md mt-3 py-2 text-sm font-semibold leading-6 shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600">Sign up</button>
      
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <Link href="/auth/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Login</Link>
            </p>
          </form>
        </div>
      </div>
      

    );
};

export default Register;