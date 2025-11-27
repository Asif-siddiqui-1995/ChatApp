import {Smiley} from "@phosphor-icons/react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {useEffect, useRef, useState} from "react";

export default function EmojiPicker() {
    const colorMode = JSON.parse(window.localStorage.getItem("color-theme"));
    const [pickerOpen, setPickerOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);

    const handleTrigger = (e) => {
        e.preventDefault();
        setPickerOpen((prev) => !prev);
    };
    const pickerRef = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                pickerRef.current &&
                !pickerRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setPickerOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEmojiSelect = (emoji) => {
        console.log(emoji);
        setSelectedEmoji(emoji.native);
    };

    return (
        <div className="relative flex">
            <button
                ref={buttonRef}
                className="text-[#98A6AD] hover:text-body"
                onClick={handleTrigger}
                aria-label="Toggle Emoji Picker"
            >
                <Smiley size={24} className="text-body" />
            </button>
            {pickerOpen && (
                <div
                    ref={pickerRef}
                    className="absolute z-40 -top-[375px] right-0"
                >
                    {typeof window !== "undefined" && (
                        <Picker
                            theme={colorMode}
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                        />
                    )}
                </div>
            )}
            {selectedEmoji && <p>Selected Emoji: {selectedEmoji}</p>}
        </div>
    );
}
