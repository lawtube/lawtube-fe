import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sidebar from '@/components/sidebar/Sidebar';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("Authorization");
    if (!auth || auth==="") {
      router.push('/auth/login');
    } else {
      getUserDetail(auth);
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

  return (
    <>
      {user && ( // Tampilkan loading jika masih loading
        <Sidebar user={user} />
      )}
    </>
  );
}
