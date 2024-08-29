import { useEffect, useState } from "react";
import { TinaMarkdown } from "tinacms/dist/rich-text"
import PlaceInsert from "./PlaceInsert";
import client from "../../tina/__generated__/client";
import { RuntimeConfig } from "@peripleo/peripleo";
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import IframeEmbed from "./IframeEmbed";

interface PostContentProps {
    slug: string;
}

const PostContent = (props: PostContentProps) => {
    const [content, setContent] = useState<any | undefined>(undefined);
    const [title, setTitle] = useState<string>('');

    useEffect( () => {
        client.queries.post({ relativePath: `${props.slug}.mdx`}).then((post) => {
            setContent(post.data.post.body);
            setTitle(post.data.post.title)
        });
    }, []);

    return (
    <RuntimeConfig
        //@ts-ignore
        path='/config.json'
        preprocess={PeripleoUtils.normalize}
    >
        <div className="w-full">
            <h1 className="text-3xl py-6">{title}</h1>
            <article className="prose prose-lg max-w-none w-full">
                <TinaMarkdown content={content} components={{ place: PlaceInsert, iframe: IframeEmbed }} />
            </article>
        </div>
    </RuntimeConfig>
    )
};

export default PostContent;