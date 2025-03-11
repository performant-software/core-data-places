import PlaceInsert from '@apps/posts/PlaceInsert';
import IframeEmbed from '@components/IframeEmbed';
import MapEmbed from '@components/MapEmbed';
import TableEmbed from '@components/TableEmbed';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/client';
import { Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
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
                  place: PlaceInsert,
                  iframe: IframeEmbed,
                  data_table: TableEmbed,
                  map: MapEmbed
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