import DocumentPicker from "../components/DocumentPicker";
import GifModal from "../components/GifModal";
import MediaPicker from "../components/MediaPicker";
import VoiceRecorder from "../components/VoiceRecorder";
import {ChatList, MessageInbox} from "../section/chat/index";

export default function Messages() {
    return (
        <>
            <div className="flex w-full">
                {/* chatlist  */}
                <ChatList />
                {/* Inbox */}
                <MessageInbox />
            </div>
            <GifModal />
            <VoiceRecorder />
            <MediaPicker />
            <DocumentPicker />
        </>
    );
}
