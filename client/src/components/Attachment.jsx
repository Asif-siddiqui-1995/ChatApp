import {File, Image, Paperclip} from "@phosphor-icons/react";
import {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {ToggleDocumentModal, ToggleMediaModal} from "../redux/slices/app";

export default function Attachment() {
    const dispatch = useDispatch();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const trigger = useRef(null);
    const dropdown = useRef(null);

    useEffect(() => {
        const clickHandler = ({target}) => {
            if (!dropdown.current) return;

            if (
                !dropdown ||
                dropdown.current.contains(target) ||
                trigger.current.contains(target)
            ) {
                return;
            }
            setDropdownOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });
    useEffect(() => {
        const keyHandler = ({keyCode}) => {
            if (!dropdown || keyCode !== 27) return;
            setDropdownOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });
    return (
        <div className="relative flex">
            <button
                className="text-[#98A6AD] hover:text-body"
                ref={trigger}
                onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen((prev) => !prev);
                }}
            >
                <Paperclip weight="bold" size={20} />
            </button>
            <div
                ref={dropdown}
                onFocus={() => setDropdownOpen(true)}
                onBlur={() => setDropdownOpen(false)}
                className={`absolute right-0 -top-24 z-50 w-54 space-y-1 rounded-sm border border-stroke bg-white p-1.5 shadow-default
       dark:border-strokedark dark:bg-boxdark ${
           dropdownOpen === true ? "block" : "hidden"
       }`}
            >
                <button
                    onClick={() => {
                        dispatch(ToggleMediaModal(true));
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4"
                >
                    <Image /> Images & videos
                </button>
                <button
                    onClick={() => {
                        dispatch(ToggleDocumentModal(true));
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-4 py-1.5 text-left text-sm hover:bg-gray dark:hover:bg-meta-4"
                >
                    <File />
                    Files And Document
                </button>
            </div>
        </div>
    );
}
