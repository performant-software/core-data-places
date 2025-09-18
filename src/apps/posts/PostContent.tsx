import PlaceInsert from '@apps/posts/PlaceInsert';
import Byline from '@components/Byline';
import IframeEmbed from '@components/IframeEmbed';
import MediaInsert from '@components/MediaInsert'
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import EventsByYear from '@visualizations/EventsByYear';
import Map from '@visualizations/Map';
import Table from '@visualizations/Table';
import Timeline from '@visualizations/Timeline';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { tinaField, useTina } from "tinacms/dist/react";
import { useMemo } from 'react';

interface PostContentProps {
  post: any;
  content?: TinaMarkdownContent;
  title?: string;
  author?: string;
  date?: string | number | Date;
}

const PostContent = (props: PostContentProps) => {
  const { t } = useTranslations();

  const { data } = useTina({
    query: props.post.query,
    variables: props.post.variables,
    data: props.post.data
  });

  const post = useMemo(() => data?.post, [data]);

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Peripleo>
        <TranslationContext.Provider
          value={{ t }}
        >
          <div
            className='w-full'
          >
            <h1
              className='text-3xl py-6'
              data-tina-field={tinaField(post, "title")}
            >
              { post?.title }
            </h1>
            { (post?.author || post?.date) && <Byline author={post.author} date={post.date} /> }
            <article
              className='prose prose-lg max-w-none w-full'
              data-tina-field={tinaField(post, "body")}
            >
              <TinaMarkdown
                components={{
                  data_table: Table,
                  events_by_year: EventsByYear,
                  iframe: IframeEmbed,
                  map: Map,
                  media: MediaInsert,
                  place: PlaceInsert,
                  timeline: Timeline
                }}
                content={post?.body}
              />
            </article>
          </div>
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  );
};

export default PostContent;