import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("../components/sidebar/Sidebar"), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Sidebar className="bg-base-0 min-h-screen w-full">
        <Component {...pageProps} />
        <Toaster />
      </Sidebar>
    </>
  );

}
