import { type NextPage } from "next";
import { CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";



const YourVideo: NextPage = () => {

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
                            <tr>
                                <th>1</th>
                                <td>Valorant Highlight</td>
                                <td><EyeSlashIcon className="h-4 w-4" /> Private</td>
                                <td><CheckIcon className="h-4 w-4" /></td>
                                <td><XMarkIcon className="h-4 w-4" /></td>
                                <td><progress className="progress w-56" value="55" max="100"></progress></td>
                                <td>In Progress</td>
                            </tr>
                            <tr>
                                <th>2</th>
                                <td>Apex Highlight</td>
                                <td><EyeIcon className="h-4 w-4" /> Public</td>
                                <td><CheckIcon className="h-4 w-4" /></td>
                                <td><XMarkIcon className="h-4 w-4" /></td>
                                <td>Completed</td>
                                <td>Download Highlight</td>
                            </tr>
                            <tr>
                                <th>3</th>
                                <td>NBA Highlight</td>
                                <td><EyeIcon className="h-4 w-4" /> Public</td>
                                <td><CheckIcon className="h-4 w-4" /></td>
                                <td><CheckIcon className="h-4 w-4" /></td>
                                <td>Completed</td>
                                <td>Download Highlight | Download Subtitle</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default YourVideo;
