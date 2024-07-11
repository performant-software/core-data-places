import { useEffect, useRef, useState } from "react";
import client from "../../tina/__generated__/client";
import { TinaMarkdown } from "tinacms/dist/rich-text";
import { Controls, Peripleo, RuntimeConfig } from "@peripleo/peripleo";
import { Map, Zoom } from "@peripleo/maplibre";
import { Peripleo as PeripleoUtils } from "@performant-software/core-data";
import CoreDataPlace from "./CoreDataPlace";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon, ArrowRightIcon, ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

export interface PathViewerProps {
    slug: string;
}

const PathViewer = (props: PathViewerProps) => {

    const [path, setPath] = useState<any | undefined>(undefined);
    const [current, setCurrent] = useState(-1);

    const contentDiv = useRef(null);

    useEffect(() => {
        client.queries.path({ relativePath: `${props.slug}.mdx` }).then((path) => {
            setPath(path.data.path);
        });
    }, []);

    useEffect(() => {
        contentDiv && contentDiv.current && setTimeout(() => {
            contentDiv.current.scroll({
            top: 0,
            behavior: 'smooth'
        })}, 50);
    }, [current]);

    return (
        <RuntimeConfig
            //@ts-ignore
            path='/config.json'
            preprocess={PeripleoUtils.normalize}
        >
            <div className="w-full h-screen flex flex-row relative">
                { path && <div className="absolute bottom-[15%] left-[50%] -translate-x-1/2 mx-auto w-48 h-16 rounded-full bg-white z-[999] drop-shadow-xl flex justify-around items-center hover:scale-110 transition">
                    <ArrowUturnLeftIcon className={`${current < 0 ? 'text-gray-500 cursor-default' : 'cursor-pointer hover:scale-105 transition'} h-8 w-8`} onClick={() => setCurrent(-1)} />
                    <ArrowLeftCircleIcon className={`${current == 0 ? 'text-gray-500 cursor-default' : 'cursor-pointer hover:scale-105 transition'} h-8 w-8`} onClick={() => current > 0 && setCurrent((i) => i - 1)} />
                    <ArrowRightCircleIcon className={`${current == path.path.length - 1 ? 'text-gray-500 cursor-default' : 'cursor-pointer hover:scale-105 transition'} h-8 w-8`} onClick={() => current < path.path.length - 1 && setCurrent((i) => i + 1)} />
                </div> }
                <div className="h-full w-1/2">
                    {path && current >= 0 ? (
                        <CoreDataPlace
                            placeURIs={[`${import.meta.env.PUBLIC_CORE_DATA_API_URL}/${path.path[current].place.uuid}?project_ids=${import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID}`]}
                            buffer={path.path[current].place?.buffer}
                            animate={path.path[current].place?.animate}
                            layer={path.path[current].place?.layer}
                            mapId={path.path[current].place.uuid}
                        />
                    ) : path && (
                        <CoreDataPlace
                            placeURIs={path.path.map((current) => `${import.meta.env.PUBLIC_CORE_DATA_API_URL}/${current.place.uuid}?project_ids=${import.meta.env.PUBLIC_CORE_DATA_PROJECT_ID}`)}
                            animate={false}
                            mapId="cover"
                        />
                    )}
                </div>
                <div className="h-full w-1/2 overflow-y-scroll bg-neutral-dark text-white pb-[20dvh]" ref={contentDiv}>
                    {path && (
                        <div className="flex flex-col py-16 px-12 gap-16">
                            {current >= 0 ? (
                                <>
                                    <h2 className="text-3xl">{path.path[current].place.title}</h2>
                                    <article className="prose prose-invert max-w-none"><TinaMarkdown content={path.path[current].blurb} /></article>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl">{path.title}</h2>
                                    <article className="prose prose-xl prose-invert max-w-none"><TinaMarkdown content={path.description} /></article>
                                    <div className="cursor-pointer bg-white text-neutral-dark w-48 h-16 flex justify-between items-center hover:scale-105 rounded-full px-6" onClick={() => setCurrent(0)}>
                                        <p>Start the Tour</p>
                                        <ArrowRightIcon className="h-8 w-8" />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </RuntimeConfig>
    )
};

export default PathViewer;
