import {ChatTeardropText} from "@phosphor-icons/react";

export default function Logo() {
    return (
        <div className="flex flex-row items-center space-x-2">
            <ChatTeardropText weight="bold" size={32} />
            <div className="text-2xl font-medium text-body dark:text-white">
                Chat
            </div>
        </div>
    );
}
