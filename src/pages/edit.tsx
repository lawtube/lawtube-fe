import { useEffect, useState, useRef } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { Card, CardBody, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Stack } from '@chakra-ui/react';
// import dynamic from 'next/dynamic'
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });
import ReactPlayer from 'react-player';
import { AiOutlineUser, AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai'
import * as ReactDOMClient from 'react-dom/client';
import { createElement } from 'react';
import { time } from 'console';


export default function Edit() {
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef<ReactPlayer>(null);
    const [startTime, setStartTime] = useState<Array<number>>([]);
    const [endTime, setEndTime] = useState<Array<number>>([]);
    const [disableAdd, setDisableAdd] = useState(true);
    const [inEditing, setInEditing] = useState(false);
    const [isEditingEnd, setIsEditingEnd] = useState(false);
    const [timeId, setTimeId] = useState(0)

    const [hasWindow, setHasWindow] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            setHasWindow(true);
        }
    }, []);

    const handleSeek = (seconds: number) => {
        // setCurrentTime(seconds);
        // console.log(currentTime)
        if (inEditing) {
            console.log(isEditingEnd)
            if (isEditingEnd) {
                const minStart = startTime[timeId - 1]
                if (seconds < minStart) {
                    playerRef.current?.seekTo(minStart, 'seconds');
                }
            } else {
                console.log(endTime[timeId - 2])
                const prevEnd = endTime[timeId - 2]
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
            button.className = "btn btn-xs btn-square ml-2 px-2 w-fit"
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
            button.className = "btn btn-xs btn-square ml-2 px-2 w-fit"
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
            <div className="flex flex-row items-center min-h-screen">
                {hasWindow && <ReactPlayer
                    ref={playerRef}
                    url="https://cdn.discordapp.com/attachments/1055222394534510664/1100873474899185684/rakamis.mp4"
                    onSeek={handleSeek}
                    width="65%"
                    height="65%"
                    controls={true}
                    onProgress={handleProgress}
                />
                }

                <div className="flex flex-col ml-5">
                    {showInitialAdd && (
                        <button onClick={handleClickInitial} className="btn btn-square w-fit px-5 ml-3">
                            Add Highlight Timestamp
                        </button>
                    )}
                    <div>
                        <div id="timestamps">

                        </div>
                        {!showInitialAdd && (
                            <>
                                <button onClick={addNewTimestamp} disabled={disableAdd} className="btn btn-square w-fit px-5 ml-3"><AiOutlinePlus /></button>
                                <button onClick={removeTimestamp} disabled={disableAdd} className="btn btn-square w-fit px-5 ml-3"><AiOutlineMinus /></button>
                                <button onClick={() => console.log(startTime)} className="btn btn-square w-fit px-5 ml-3">Submit</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}