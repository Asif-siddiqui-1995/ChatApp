import {Check, Checks} from "@phosphor-icons/react";
import extrackLinks from "../../utils/extractLinks";
import MicroLink from "@microlink/react";

export default function Text({
    incoming,
    author,
    timestamp,
    read_recipt, // 'read' | 'delivered' | 'read'
    content,
}) {
    const {links, originalString} = extrackLinks(content);
    return incoming ? (
        <div className="max-w-125">
            <p className="mb-2.5 text-sm font-medium">{author}</p>
            <div className="mb-2.5 rounded-2xl rounded-tl-none bg-gray px-5 py-3 dark:bg-boxdark-2 space-y-2">
                <p dangerouslySetInnerHTML={{__html: originalString}}></p>
                {links.length > 0 && (
                    <MicroLink style={{width: "100%"}} url={links[0]} />
                )}
            </div>
            <p className="text-xs">{timestamp}</p>
        </div>
    ) : (
        <div className="max-w-125 ml-auto">
            <div className="mb-2.5 rounded-2xl rounded-br-none bg-primary px-5 py-3 space-y-2">
                <p
                    className="text-white"
                    dangerouslySetInnerHTML={{__html: originalString}}
                ></p>
                {links.length > 0 && (
                    <MicroLink style={{width: "100%"}} url={links[0]} />
                )}
            </div>
            <div className="flex flex-row items-center justify-end space-x-2">
                <div
                    className={`${
                        read_recipt !== "read"
                            ? "text-body dark:text-white"
                            : "text-primary"
                    }`}
                >
                    {read_recipt != "sent" ? (
                        <Checks weight="bold" size={18} />
                    ) : (
                        <Check weight="bold" size={18} />
                    )}
                </div>
                <p className="text-xs">{timestamp}</p>
            </div>
        </div>
    );
}

// single tick -gary sent
// double tick - gray - delivered
// double tick blue - read
