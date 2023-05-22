import { type NextPage } from "next";
import { CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";



const YourVideo: NextPage = () => {

    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [progress, setProgress] = useState([]);
    useEffect(() => {
        const auth = localStorage.getItem("Authorization");
        if (!auth || auth === "") {
            router.push('/auth/login');
        } else {
            getUserDetail(auth);
        }
    }, [router]);

    useEffect(() => {
        if (user) {
            getUserProgress();
        }
    }, [user]);

    const getUserDetail = async (auth: any) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
                headers: {
                    Authorization: auth,
                },
            });
            setUser(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getUserProgress = async () => {
        try {
            console.log("ini user", user.data.id);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds/progress/${user.data.id}`);
            setProgress(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const [socket, setSocket] = useState<WebSocket | null>(null);
    // const wsUrl = process.env.NEXT_PUBLIC_BACKEND_URL_WS;
    useEffect(() => {
        if (!user) return;
        const newSocket = new WebSocket(`ws://localhost:3000`);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        socket.onmessage = (event) => {
            console.log(event)
        }

        const handleMessage = (event: any) => {
            console.log("masuk")
            console.log(event)
        };

        socket.addEventListener('onMessage', handleMessage);

        return () => socket.removeEventListener('message', handleMessage);
    }, [socket]);

    return (
        <>
            <div className="p-12">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th>Title</th>
                                <th>Visibility</th>
                                <th>Highlight</th>
                                <th>Subtitle</th>
                                <th>Status</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            {progress.map((progres: any, index) => (
                                <tr key={progres.id}>
                                    <th>{index + 1}</th>
                                    <td>{progres.judul}</td>
                                    <td>{progres.visibility === 'Private' ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />} {progres.visibility}</td>
                                    <td>{progres.doHighlight ? <CheckIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</td>
                                    <td>{progres.doSubtitle ? <CheckIcon className="h-4 w-4" /> : <XMarkIcon className="h-4 w-4" />}</td>

                                    <td>
                                        {progres.status === "finish moderation" ? (
                                            <p>Completed</p>
                                        ) : (
                                            <>
                                            <p>{progres.status}</p>
                                            <progress className="progress w-56 m-4"></progress>
                                            </>
                                        )}
                                    </td>

                                    <td>
                                        {progres.doHighlight && progres.videolink && (
                                            <>
                                            <a href={progres.videolink} download>
                                                Download Highlight
                                            </a>
                                            {progres.doSubtitle && progres.sublink && " | "}
                                            </>
                                        )}
                                        {progres.doSubtitle && progres.sublink && (
                                            <a href={progres.sublink} download>
                                            Download Subtitle
                                            </a>
                                        )}
                                        </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default YourVideo;
