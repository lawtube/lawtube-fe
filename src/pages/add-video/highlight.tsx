import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import Sidebar from '@/components/sidebar/Sidebar';
import { Card, CardBody, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Stack } from '@chakra-ui/react';
// import dynamic from 'next/dynamic'
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import ReactPlayer from 'react-player';
import { AiOutlineUser, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import * as ReactDOMClient from 'react-dom/client';
import { createElement } from 'react';
import { time } from 'console';
import { useRouter } from "next/router";
import { start } from 'repl';
import { v4 as uuidv4 } from "uuid";

export default function Edit() {
    const [user, setUser] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileData, setFileData] = useState<any>(null);
    const [generateSubtitle, setGenerateSubtitle] = useState<boolean>(false);
    const [generateHighlight, setGenerateHighlight] = useState<boolean>(false);

    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef<ReactPlayer>(null);
    const [startTime, setStartTime] = useState<Array<number>>([]);
    const [endTime, setEndTime] = useState<Array<number>>([]);
    const [disableAdd, setDisableAdd] = useState(false);
    const [inEditing, setInEditing] = useState(false);
    const [isEditingEnd, setIsEditingEnd] = useState(false);
    const [timeId, setTimeId] = useState(0)

    const [isUpload, setIsUpload] = useState(true)
    const [isHighlight, setIsHighlight] = useState(false)
    const [isSubtitle, setIsSubtitle] = useState(false)
    const [isModeration, setIsModeration] = useState(false)
    const [isFinish, setIsFinish] = useState(false)
    const [isInitiating, setIsInitiating] = useState(false)
    const [visibility, setVisibility] = useState<string>("")

    const [title, setTitle] = useState("");

    const [hasWindow, setHasWindow] = useState(false);

    const [testState, setTestState] = useState(0);
    const [testStatelagi, setTestStatelagi] = useState(0);

    const router = useRouter();

    useEffect(() => {
        const auth = localStorage.getItem("Authorization");
        if (!auth || auth === "") {
            router.push('/auth/login');
        } else {
            getUserDetail(auth);
        }
    }, [router]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, []);

    // useEffect(() => {
    //     if (user) {
    //       setUser(user)
    //       console.log("hai", user) // Panggil fungsi handleUpload saat user dan selectedFile berubah
    //     } 
    //     if (generateHighlight) {
    //         setGenerateHighlight(generateHighlight)
    //     }
    //     if (visibility) {
    //         setVisibility(visibility)
    //     }
    //   }, [user, generateHighlight, visibility]);

    const getUserDetail = async (auth: any) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`, {
                headers: {
                    Authorization: auth,
                },
            });
            setUser(response.data.data.id);
            console.log("ini awal", user)

        } catch (error) {
            console.error(error);

        }
    };

    const createTask = async (token: string) => {
        try {
            var includeHighlight = false;
            if (startTime.length > 0) {
                setGenerateHighlight(true)
                includeHighlight = true;
            }

            var timestamp = [];

            for (var i = 0; i < startTime.length; i++) {
                timestamp.push([startTime[i], endTime[i]]);
            }

            const payload_data = {
                "is_highlight": includeHighlight,
                "timestamp": timestamp,
                "token": token,
            }

            const formData = new FormData();
            formData.append('json_payload', JSON.stringify(payload_data));
            formData.append('video', fileData);

            const response = await axios.post(`${process.env.NEXT_PUBLIC_ORCHESTRA_URL}/main/create-task`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response.data)
            return response.data
        } catch (error) {
            console.log(error)
        }
    };

    const pushToNest = async (token: string, post_visibility: string) => {
        try {
            var includeHighlight = false;
            if (startTime.length > 0) {
                setGenerateHighlight(true)
                includeHighlight = true;
            }

            const payload_data = {
                "token": token,
                "judul": title,
                "visibility": post_visibility,
                "doHighlight": includeHighlight,
                "doSubtitle": generateSubtitle,
                "status": "uploading video",
                "userId": user
            }

            console.log(payload_data)

            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/feeds/createProgress`, payload_data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            })

            return response.data

        } catch (error) {
            console.log(error)
        }
    }

    const handleUpload = async (post_visibility: string) => {
        try {
            const token = uuidv4();
            createTask(token);
            // const token = orchest_response.token
            await pushToNest(token, post_visibility);
            router.push("/your-video")
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickFinish = (visibility: string) => {
        setIsInitiating(true); 
        if (visibility === "public") {
            setVisibility("public")
            handleUpload("public")
        } else {
            setVisibility("private")
            handleUpload("private")
        }
    }


    const handleSeek = (seconds: number) => {
        if (inEditing) {
            console.log(isEditingEnd)
            if (isEditingEnd) {
                const minStart = startTime[timeId - 1] + 0.000001
                if (seconds < minStart) {
                    playerRef.current?.seekTo(minStart, 'seconds');
                }
            } else {
                console.log(endTime[timeId - 2])
                const prevEnd = endTime[timeId - 2] + 0.000001
                if (seconds < prevEnd) {
                    playerRef.current?.seekTo(prevEnd, 'seconds');
                }
            }
        }
    };

    const getTime = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            return currentTime;
        }
    }

    function handleProgress(progressData: any) {
        // console.log(progressData.playedSeconds);
    }

    const addNewTimestamp = () => {

        const timeStamps = document.getElementById("timestamps")
        const div = document.createElement("div")
        div.id = `time${timeId}`
        div.className = "mb-3"

        const input1 = document.createElement("input")
        input1.type = "text"
        input1.id = `timestart${timeId}`
        input1.className = "input input-sm input-bordered mx-2  w-24"
        input1.disabled = true

        const input2 = document.createElement("input")
        input2.type = "text"
        input2.id = `timeend${timeId}`
        input2.className = "input input-sm input-bordered mx-2 w-24"
        input2.disabled = true

        // const button = document.createElement("button")
        // button.className = "btn btn-sm btn-square ml-2 px-2 w-fit"
        // button.innerHTML = "Edit"
        // button.onclick = function () {
        //     editTimestampValue(timeId);
        // };

        div.appendChild(input1);
        div.appendChild(input2);
        // div.appendChild(button);

        if (timeStamps) {
            timeStamps.appendChild(div);
        }
        setTimeId(prevTimeId => prevTimeId + 1)

        editTimestampValue(timeId)


    }

    const editTimestampValue = (e: any) => {
        setDisableAdd(true)
        setInEditing(true)
        setIsEditingEnd(false)

        const timeDiv = document.getElementById("time" + String(e))
        if (timeDiv) {
            const div = document.createElement("div")
            div.id = `set${String(e)}`
            div.innerHTML += "<p>Select Starting Point</p>"
            const button = document.createElement("button")
            button.className = "btn btn-primary btn-xs btn-square ml-2 px-2 w-fit"
            button.innerHTML = "Next"
            button.onclick = function () {
                selectStartingPoint(e);
            };
            div.appendChild(button)
            timeDiv.appendChild(div)
        }
    }

    const selectStartingPoint = (e: any) => {
        const startTimeElement = document.getElementById("timestart" + String(e)) as HTMLInputElement;
        if (startTimeElement) {
            const time = getTime();
            startTimeElement.value = String(time);
            setStartTime(prevStartTime => {
                const newStartTime = time ?? 0;
                return [...prevStartTime, newStartTime];
            })
        }
        setIsEditingEnd(true)
        document.getElementById("set" + String(e))?.remove()
        const timeDiv = document.getElementById("time" + String(e))
        if (timeDiv) {
            const div = document.createElement("div")
            div.id = `set${String(e)}`
            div.innerHTML += "<p>Select Ending Point</p>"
            const button = document.createElement("button")
            button.className = "btn btn-primary btn-xs btn-square ml-2 px-2 w-fit"
            button.innerHTML = "Next"
            button.onclick = function () {
                selectEndingPoint(e);
            };
            div.appendChild(button)
            timeDiv.appendChild(div)
        }

    }

    const selectEndingPoint = (e: any) => {
        const endTime = document.getElementById("timeend" + String(e)) as HTMLInputElement;
        if (endTime) {
            const time = getTime();
            endTime.value = String(time);
            setEndTime(prevEndTime => {
                const newEndTime = time ?? 0;
                return [...prevEndTime, newEndTime];
            })
        }
        document.getElementById("set" + String(e))?.remove()
        setDisableAdd(false)
        setInEditing(false)
        setIsEditingEnd(false)
    }


    const removeTimestamp = (e: any) => {
        const element = document.getElementById("time" + String(timeId - 1));
        if (element) {
            element.remove();
        }
        if (timeId - 1 === 0) {
            setShowInitialAdd(true)
        }
        setTimeId(prevTimeId => prevTimeId - 1)
    }



    const handleClickInitial = () => {
        setShowInitialAdd(false)
        addNewTimestamp()
    }

    const [showInitialAdd, setShowInitialAdd] = useState(true);

    return (
        <>
        { user && (
            <>
            <p>{user.id} a</p>
            {isHighlight && (
                <>
                    <div className="items-center justify-center text-center mt-8">
                        <ul className="steps">
                            <li className="step step-primary">Upload</li>
                            <li className="step step-primary">Highlight</li>
                            <li className="step">Subtitle</li>
                            <li className="step">Content Moderation</li>
                            <li className="step">Publish</li>
                        </ul>
                    </div>
                    <div className="flex flex-row justify-center items-center min-h-screen">

                        {hasWindow && <ReactPlayer
                            ref={playerRef}
                            url={selectedFile}
                            onSeek={handleSeek}
                            width="65%"
                            height="65%"
                            controls={true}
                            onProgress={handleProgress}
                        />
                        }


                        <div className="flex flex-col ml-5">
                            {showInitialAdd && (
                                <button onClick={handleClickInitial} className="btn btn-primary btn-square w-fit px-5 ml-3">
                                    Add Highlight Timestamp
                                </button>
                            )}
                            <div>
                                <div id="timestamps">

                                </div>
                                {!showInitialAdd && (
                                    <>
                                        <button onClick={addNewTimestamp} disabled={disableAdd} className="btn btn-primary btn-square w-fit px-5 ml-3"><AiOutlinePlus /></button>
                                        <button onClick={removeTimestamp} disabled={disableAdd} className="btn btn-primary btn-square w-fit px-5 ml-3"><AiOutlineMinus /></button>
                                    </>
                                )}
                                <button disabled={disableAdd} onClick={() => {
                                    setIsHighlight(false);
                                    setIsSubtitle(true);
                                    console.log("start time", startTime)
                                    console.log("end time", endTime)
                                }} className="btn btn-primary btn-square w-fit px-5 ml-3 mt-5">Complete</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
            {isUpload && (
                <>
                    <div className="items-center justify-center text-center mt-8">
                        <ul className="steps">
                            <li className="step step-primary">Upload</li>
                            <li className="step">Highlight</li>
                            <li className="step">Subtitle</li>
                            <li className="step">Content Moderation</li>
                            <li className="step">Publish</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="flex items-center justify-center w-full h-screen">
                            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-5/6 h-3/4 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden"
                                    onChange={({ target }) => {
                                        if (target.files) {
                                            const file = target.files[0];
                                            setFileData(file);
                                            const objectUrl = URL.createObjectURL(file);
                                            setSelectedFile(objectUrl);
                                            console.log(objectUrl)
                                            setIsUpload(false);
                                            setIsHighlight(true);
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </>
            )}
            {isSubtitle && (
                <>
                    <div className="items-center justify-center text-center mt-8">
                        <ul className="steps">
                            <li className="step step-primary">Upload</li>
                            <li className="step step-primary">Highlight</li>
                            <li className="step step-primary">Subtitle</li>
                            <li className="step">Content Moderation</li>
                            <li className="step">Publish</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-center mt-64 text-4xl font-bold">
                        Would you like to add subtitle to your video?
                    </div>
                    <div className="flex items-center justify-center mt-8">
                        <button className="bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
                            onClick={() => {
                                setIsSubtitle(false)
                                setIsModeration(true)
                                setGenerateSubtitle(true)
                            }}>
                            Yes
                        </button>
                        <button className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => {
                            setIsSubtitle(false)
                            setIsModeration(true)
                        }}>
                            No
                        </button>
                    </div>
                </>
            )}
            {isModeration && (
                <>
                    <div className="items-center justify-center text-center mt-8">
                        <ul className="steps">
                            <li className="step step-primary">Upload</li>
                            <li className="step step-primary">Highlight</li>
                            <li className="step step-primary">Subtitle</li>
                            <li className="step step-primary">Content Moderation</li>
                            <li className="step">Publish</li>
                        </ul>
                    </div>
                    <div className="flex items-center justify-center mt-64 text-4xl font-bold">
                        Content moderation is mandatory to keep our community safe
                    </div>
                    <div className="flex items-center justify-center mt-8">
                        <button className="bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={() => {
                            setIsModeration(false)
                            setIsFinish(true)
                        }}>
                            I Agree
                        </button>
                    </div>
                </>
            )}
            {isFinish && (
                <>
                    <div className="items-center justify-center text-center mt-8">
                        <ul className="steps">
                            <li className="step step-primary">Upload</li>
                            <li className="step step-primary">Highlight</li>
                            <li className="step step-primary">Subtitle</li>
                            <li className="step step-primary">Content Moderation</li>
                            <li className="step step-primary">Publish</li>
                        </ul>
                    </div>
                    <div className={`flex items-center justify-center mt-64 text-4xl font-bold ${isInitiating ? 'hidden' : ''}`}>
                        Title
                    </div>
                    <div className={`flex items-center justify-center mt-8 ${isInitiating ? 'hidden' : ''}`}>
                        <input onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Video title" className="border rounded py-2 px-4 w-3/5" />
                    </div>
                    <div className="flex items-center justify-center mt-8">
                        <button onClick={() => handleClickFinish("public")} className={`bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 ${isInitiating ? 'hidden' : ''}`}>
                            Upload
                        </button>
                        <button onClick={() => handleClickFinish("private")} className={`bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ${isInitiating ? 'hidden' : ''}`}>
                            Save
                        </button>
                    </div>
                    <div className={`flex flex-col items-center justify-center ${!isInitiating ? 'hidden mt-8' : 'mt-64'}`}>
                        <p className="text-2xl font-bold">Uploading Video, Please stand by...</p>
                        <progress className="progress w-56 m-4"></progress>
                    </div>
                </>
            )}
            </>
            )}
        </>

    );
}