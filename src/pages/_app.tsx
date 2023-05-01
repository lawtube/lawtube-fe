import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import dynamic from "next/dynamic";
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

const Sidebar = dynamic(() => import("../components/sidebar/Sidebar"), {
  ssr: false,
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <Sidebar className="bg-base-0 min-h-screen w-full">
          <Component {...pageProps} />
          <Toaster />
        </Sidebar>
      </ChakraProvider>
    </>
  );

}
