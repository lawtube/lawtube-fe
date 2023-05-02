import { type NextPage } from "next";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";

const AddVideo: NextPage = () => {

    const router = useRouter();
    return (
        <>
            <div className= "items-center justify-center text-center mt-8">
                <ul className="steps">
                    <li className="step step-primary" onClick={() => router.push("/add-video/")}>Upload</li>
                    <li className="step step-primary" onClick={() => router.push("/add-video/highlight")}>Highlight</li>
                    <li className="step step-primary" onClick={() => router.push("/add-video/subtitle")}>Subtitle</li>
                    <li className="step step-primary">Content Moderation</li>
                    <li className="step">Publish</li>
                </ul>
            </div>
            <div className="flex items-center justify-center mt-64 text-4xl font-bold">
                Would you like to add content moderation to your video?
            </div>
            <div className="flex items-center justify-center mt-8">
                <button className="bg-indigo-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={() => router.push("/add-video/publish")}>
                    Yes
                </button>
                <button className="bg-gray-400 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={() => router.push("/add-video/publish")}>
                    No
                </button>
            </div>
        </>
    );
};

export default AddVideo;
