import PlaceInsert from '@apps/posts/PlaceInsert';
import IframeEmbed from '@components/IframeEmbed';
import MediaInsert from '@components/MediaInsert'
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import EventsByYear from '@visualizations/EventsByYear';
import Map from '@visualizations/Map';
import Table from '@visualizations/Table';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';

interface PostContentProps {
  content: TinaMarkdownContent;
  title: string;
}

const PostContent = (props: PostContentProps) => {
  const { t } = useTranslations();

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
            >
              { props.title }
            </h1>
            <article
              className='prose prose-lg max-w-none w-full'
            >
              <TinaMarkdown
                components={{
                  data_table: Table,
                  events_by_year: EventsByYear,
                  iframe: IframeEmbed,
                  map: Map,
                  media: MediaInsert,
                  place: PlaceInsert
                }}
                content={props.content}
              />
            </article>
          </div>
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  );
};

export default PostContent;