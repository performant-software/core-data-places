import PlaceInsert from '@apps/posts/PlaceInsert';
import IframeEmbed from '@components/IframeEmbed';
import MediaInsert from '@components/MediaInsert'
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import StackedTimeline from '@visualizations/StackedTimeline';
import EventsByYear from '@visualizations/EventsByYear';
import Map from '@visualizations/Map';
import Table from '@visualizations/Table';
import Timeline from '@visualizations/Timeline';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import { PostQuery, PostQueryVariables } from '@root/tina/__generated__/types';
import { tinaField, useTina } from "tinacms/dist/react";

interface PostContentProps {
  variables: PostQueryVariables;
  data: PostQuery;
  query: string;
}

const PostContent = (props: PostContentProps) => {
  const { t } = useTranslations();

  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

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
            <article
              className='prose prose-lg max-w-none w-full'
              data-tina-field={tinaField(data?.post)}
            >
              <TinaMarkdown
                components={{
                  data_table: Table,
                  events_by_year: EventsByYear,
                  iframe: IframeEmbed,
                  map: Map,
                  media: MediaInsert,
                  place: PlaceInsert,
                  stacked_timeline: StackedTimeline,
                  timeline: Timeline
                }}
                content={data?.post?.body}
              />
            </article>
          </div>
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  );
};

export default PostContent;