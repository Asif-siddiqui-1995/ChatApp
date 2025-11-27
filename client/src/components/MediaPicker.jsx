import {useDispatch, useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {PaperPlaneTilt, X} from "@phosphor-icons/react";
import {ToggleMediaModal} from "../redux/slices/app";
import FileDropZone from "./FileDropZone";

export default function MediaPicker() {
    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const {media} = useSelector((state) => state.app.modals);
    useEffect(() => {
        const keyHandler = ({keyCode}) => {
            if (!media || keyCode !== 27) return;
            dispatch(ToggleMediaModal(false));
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    return (
        <div
            className={`fixed left-0 top-0 z-99999 flex h-full w-full items-center justify-center bg-black/90 px-4 py-5 ${
                media ? "block" : "hidden"
            }`}
        >
            <div
                ref={modalRef}
                className="w-full max-w-142.5 rounded-lg bg-white dark:bg-boxdark px-8 py-12 md:px-17.5 md:py-8"
            >
                <div className="flex flex-row items-center justify-between                 mb-8 space-x-2">
                    <div className=" text-md font-medium text-black dark:text-white">
                        Choose Media file to Send
                    </div>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(ToggleMediaModal(false));
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>
                {/* File DropZone */}
                <FileDropZone
                    acceptedFiles=".pdf, .ppt, .doc, .docx, .xls, .xlsx, .txt, .csv, .fig"
                    maxFileSize={16 * 1024 * 1024}
                />
                <div className="flex flex-row items-center space-x-2 justify-between mt-4 ">
                    <input
                        type="text"
                        className="border rounded-lg hover:border-primary outline-none w-full p-2 border-stroke dark:border-strokedark bg-transparent
                        dark:bg-form-input"
                        placeholder="Type your message..."
                    />
                    <button className="p-2.5 text-white border-primary flex items-center justify-center rounded-lg bg-primary hover:bg-opacity-90">
                        <PaperPlaneTilt size={20} weight="bold" />
                    </button>
                </div>
            </div>
        </div>
    );
}
