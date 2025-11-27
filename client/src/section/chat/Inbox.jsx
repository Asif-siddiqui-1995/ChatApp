import {useState} from "react";
import Dropdown from "../../components/Dropdown";
import EmojiPicker from "../../components/EmojiPicker";
import User01 from "../../images/user/user-01.png";
import {
    PaperPlaneTilt,
    VideoCamera,
    Phone,
    Gif,
    Microphone,
} from "@phosphor-icons/react";
import UserInfo from "./userInfo";
import Giphy from "../../components/Giphy";
import {useDispatch} from "react-redux";
import {ToggleAudioModal} from "../../redux/slices/app";
import Attachment from "../../components/attachment";
import MessageSeparator from "../../components/MessageSeparator";
import TypingIndicator from "../../components/TypingIndicator";
import {
    DocumentMessage,
    MediaMessage,
    TextMessage,
    VoiceMessage,
} from "../../components/Messages";
import VideoRoom from "../../components/VideoRoom";
import AudioRoom from "../../components/AudioRoom";

export default function Inbox() {
    const [userInfoOpen, setUserInfoOpen] = useState(false);
    const handleToggleUserInfo = () => {
        setUserInfoOpen((prev) => !prev);
    };
    const dispatch = useDispatch();
    const [gifOpen, setGifOpen] = useState(false);
    const handleToggleGif = (e) => {
        e.preventDefault();
        setGifOpen((prev) => !prev);
    };
    const handleMicClick = (e) => {
        e.preventDefault();
        dispatch(ToggleAudioModal(true));
    };
    const [videoCall, setVideoCall] = useState(false);
    const [audioCall, setAudioCall] = useState(false);
    const handleToggleVideo = () => {
        setVideoCall((p) => !p);
    };
    const handleToggleAudio = () => {
        setAudioCall((p) => !p);
    };
    return (
        <>
            <div
                className={`flex h-full flex-col border-l border-stroke dark:border-strokedark xl:w-3/4 ${
                    userInfoOpen ? "xl:w-1/2" : "xl:w-3/4"
                }`}
            >
                {/* Header */}
                <div
                    className="sticky flex items-center flex-row justify-between border-b border-stroke
            dark:border-x-strokedark px-6 py-4.5"
                >
                    <div
                        className="flex items-center"
                        onClick={handleToggleUserInfo}
                    >
                        <div className="mr-4.5 h-13 w-full max-w-13 overflow-hidden rounded-full">
                            <img
                                src={User01}
                                alt="avatar"
                                className="h-full w-full object-cover object-center"
                            />
                        </div>
                        <div className="">
                            <h5 className="font-medium text-black dark:text-white">
                                Henry Cavil
                            </h5>
                            <p className="text-sm">Reply to message</p>
                        </div>
                    </div>
                    <div className="flex flex-row items-center space-x-8">
                        <button onClick={handleToggleVideo}>
                            <VideoCamera size={24} />
                        </button>
                        <button onClick={handleToggleAudio}>
                            <Phone size={24} />
                        </button>
                        <Dropdown />
                    </div>
                </div>
                {/* List of Message */}

                <div className="max-h-full space-y-3.5 overflow-auto no-scrollbar px-6 py-7.5 grow">
                    <TextMessage
                        author="asif"
                        content="https://www.npmjs.com/package/@microlink/react"
                        read_recipt="delivered"
                        incoming={false}
                        timestamp="2:44pm"
                    />

                    <div className="max-w-125">
                        <p className="mb-2.5 text-sm font-medium">
                            Andri Thomas
                        </p>
                        <div className="mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2">
                            <p>
                                I want to make an appointment tomorow from 2 to
                                5 pm
                            </p>
                        </div>
                        <p className="text-xs">1:55 Pm</p>
                    </div>
                    <MessageSeparator />
                    <div className="max-w-125 ml-auto">
                        <div className="mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3 ">
                            <p className="text-white">
                                Hello will check the schedule and inform you
                            </p>
                        </div>
                        <p className="text-xs">2:55 Pm</p>
                    </div>
                    <DocumentMessage
                        author="asif"
                        incoming={false}
                        read_recipt="read"
                        timestamp="4:23pm"
                    />
                    <VoiceMessage
                        incoming={false}
                        read_recipt="delivered"
                        timestamp="4.28Pm"
                    />
                    <MediaMessage
                        incoming={true}
                        assets={[]}
                        author="asif"
                        caption="this is caption"
                        timestamp="5:32pm"
                        read_recipt="read"
                    />
                </div>
                <TypingIndicator />
                {/* Input */}
                <div
                    className="sticky bottom-0 border-t border-stroke bg-white px-6 py-5 dark:border-strokedark
                    dark:bg-boxdark"
                >
                    <form className="flex items-center justify-between space-x-4.5">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Type something"
                                className="h-13 w-full rounded-md border border-stroke bg-gray pl-5 pr-19 text-black
                                placeholder-body outline-none focus:border-primary dark:border-strokedark dark:bg-boxdark-2 dark:text-white"
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 items-center justify-end space-x-4">
                                <button
                                    onClick={handleMicClick}
                                    className="hover:text-primary"
                                >
                                    <Microphone size={20} />
                                </button>
                                <button
                                    // onClick={(e) => e.preventDefault()}
                                    className="hover:text-primary"
                                >
                                    <Attachment />
                                </button>
                                <button className="hover:text-primary">
                                    <EmojiPicker />
                                </button>
                                <button onClick={handleToggleGif}>
                                    <Gif size={20} />
                                </button>
                            </div>
                        </div>
                        <button className="flex items-center justify-center h-13 max-w-13 w-full rounded-md bg-primary text-white hover:bg-opacity-90">
                            <PaperPlaneTilt weight="bold" size={24} />
                        </button>
                    </form>{" "}
                    {gifOpen && <Giphy />}
                </div>
            </div>
            {videoCall && (
                <VideoRoom open={videoCall} handleClose={handleToggleVideo} />
            )}
            {audioCall && (
                <AudioRoom open={audioCall} handleClose={handleToggleAudio} />
            )}
            {userInfoOpen && (
                <div className="w-1/4">
                    <UserInfo handleToggleUserInfo={handleToggleUserInfo} />
                </div>
            )}
        </>
    );
}
