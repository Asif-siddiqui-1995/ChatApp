import {useEffect, useRef, useState} from "react";
import _ from "lodash";
import {GiphyFetch} from "@giphy/js-fetch-api";
import {Grid} from "@giphy/react-components";
import {MagnifyingGlass} from "@phosphor-icons/react";
import {useDispatch} from "react-redux";
import {ToggleGifModal} from "../redux/slices/app";

const gf = new GiphyFetch("MIelCIEjJOXXKu5K7U18Z4LFk2Or8mRz");

export default function Giphy() {
    const dispatch = useDispatch();
    const gridRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [gifs, setGifs] = useState([]);

    const debounceFetchGifs = _.debounce(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newGifs = await fetchGifs(0);
            setGifs(newGifs.data);
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, 500); // Debounce Time

    const fetchGifs = async (offset) => {
        return gf.search(value, {offset, limit: 10});
    };

    useEffect(() => {
        // Fetch Gif
        const fetchInitialGifs = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const initailGifs = await fetchGifs(0);
                setGifs(initailGifs.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialGifs();
    }, []);

    const handleGifClick = (gif, e) => {
        e.preventDefault();
        const gifUrl = gif.images.original.url;
        console.log(gifUrl);
        dispatch(
            ToggleGifModal({
                value: true,
                url: gifUrl,
            })
        );
    };
    return (
        <div ref={gridRef} className="w-full mt-3">
            <input
                type="text"
                placeholder="Search for Gif..."
                className="border border-stroke dark:border-strokedark rounded-md p-2 w-full mb-2 outline-none bg-transparent"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    debounceFetchGifs();
                }}
            />
            {isLoading && <p>Laoding Gifs..</p>}
            {error && <p className="text-red">Error : {error}</p>}
            <div className="h-48 overflow-auto no-scrollbar ">
                {gifs.length > 0 ? (
                    <Grid
                        width={gridRef.current?.offsetWidth}
                        columns={8}
                        gutter={6}
                        fetchGifs={fetchGifs}
                        key={value}
                        onGifClick={(gif, e) => handleGifClick(gif, e)}
                        data={gifs}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-2">
                        <MagnifyingGlass size={48} weight="bold" />
                        <span className="text-xl text-body font-semibold">
                            Please Search for any Gifs
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
