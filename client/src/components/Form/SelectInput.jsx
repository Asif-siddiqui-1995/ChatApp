import {CaretDown, Globe} from "@phosphor-icons/react";
import {useState} from "react";

export default function SelectInput() {
    const [selectedOption, setSelectedOption] = useState("");
    const [isOptionSelected, setIsOptionSelected] = useState(false);

    const changetextcolor = () => {
        setIsOptionSelected(true);
    };

    return (
        <div>
            <label className="mb-3 block text-black dark:text-white">
                Select Country
            </label>
            <div className="relative z-20 bg-white dark:bg-form-input ">
                {/* Left Icon */}
                <span className="absolute inset-y-0 left-4 flex items-center">
                    <Globe size={20} />
                </span>

                <select
                    value={selectedOption}
                    onChange={(e) => {
                        setSelectedOption(e.target.value);
                        changetextcolor();
                    }}
                    className={`relative z-20 w-full appearance-none rounded border border-stroke bg-transparent px-12 py-3 outline-none 
                        transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input 
                        ${isOptionSelected ? "text-black dark:text-white" : ""}
                    `}
                >
                    <option
                        disabled
                        value=""
                        className="text-body dark:text-bodydark"
                    >
                        Select Country
                    </option>
                    <option
                        value="India"
                        className="text-body dark:text-bodydark"
                    >
                        India
                    </option>
                    <option value="UK" className="text-body dark:text-bodydark">
                        UK
                    </option>
                    <option
                        value="Russia"
                        className="text-body dark:text-bodydark"
                    >
                        Russia
                    </option>
                </select>

                {/* Right Icon */}
                <span className="absolute inset-y-0 right-4 flex items-center">
                    <CaretDown size={20} />
                </span>
            </div>
        </div>
    );
}
