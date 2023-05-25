import { type NextPage } from "next";
import { CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from 'socket.io-client';
import axios from "axios";



const YourVideo: NextPage = () => {

    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const [progress, setProgress] = useState([]);
    const [newChanges, setNewChanges] = useState(false);
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
    }, [user, newChanges]);

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds/progress/${user.data.id}`);
            console.log("ini", response.data);
            setProgress(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!user) {
            return;
        }
        const socket = io("http://35.209.28.142:3000");

        socket.on('broadcast', (data) => {
            console.log('Received broadcast:', data);
            console.log(user)
            if (user.data.id == data) {
                setNewChanges(newChanges => !newChanges)
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

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
                                                {(progres.status === "uploading video") && (
                                                    <>
                                                        <p className="mx-4">Uploading Video</p>
                                                        <progress className="progress w-56 m-4"></progress>
                                                    </>
                                                )}
                                                {(progres.status === "processing video" && progres.doHighlight) && (
                                                    <>
                                                        <p className="mx-4">Creating Highlight</p>
                                                        <progress className="progress w-56 m-4"></progress>
                                                    </>
                                                )}
                                                {((progres.status === "processing video" && !progres.doHighlight && progres.doSubtitle) || (progres.status === "finish highlight" && progres.doSubtitle)) && (
                                                    <>
                                                        <p className="mx-4">Creating Subtitle</p>
                                                        <progress className="progress w-56 m-4"></progress>
                                                    </>
                                                )}
                                                {((progres.status === "processing video" && !progres.doHighlight && !progres.doSubtitle) || (progres.status === "finish highlight" && !progres.doSubtitle) || (progres.status === "finish subtitle")) && (
                                                    <>
                                                        <p className="mx-4">Checking Video Safety</p>
                                                        <progress className="progress w-56 m-4"></progress>
                                                    </>
                                                )}
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
