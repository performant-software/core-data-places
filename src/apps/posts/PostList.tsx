import { getRelativeLocaleUrl } from 'astro:i18n';
import _ from 'underscore';
import { useCallback, useEffect, useState } from 'react';
import { fetchPosts } from '@backend/api/posts';
import { Button } from '@performant-software/core-data';
import { useTranslations } from '@i18n/useTranslations';

interface Props {
  lang: string;
}

const PER_PAGE = 25;

const PostList = (props: Props) => {
  const { t } = useTranslations();
  const { lang } = props;

  const [cursor, setCursor] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const onLoadPosts = useCallback(async (cursor?: string) => {
    const params = {
      first: PER_PAGE,
    };

    if (cursor) {
      params['after'] = cursor;
    }

    const res = await fetchPosts(params);

    setPosts(prev => prev.concat(res.posts));
    setCursor(res.metadata?.endCursor);
  }, []);

  useEffect(() => {
    onLoadPosts();
  }, []);

  return (
    <div className='mx-4'>
      <div className='flex items-center justify-between'>
        <h1
          className='text-2xl my-8 font-header uppercase first-letter:text-4xl'
        >
          { t('posts') }
        </h1>
      </div>
      <div className='flex flex-col italic text-lg divide-y divide-secondary text-[#222222]'>
        { _.map(posts, (post) => (
          <a
            className='hover:underline hover:font-semibold py-4 font-header'
            href={getRelativeLocaleUrl(lang, `posts/${post._sys.filename}`)}
            key={post._sys.filename}
          >
            <p>
              { post.title }
            </p>
          </a>
        )) }
      </div>
      { cursor && (
        <div className='w-full flex justify-center items-center py-6'>
          <Button
            onClick={() => onLoadPosts(cursor)}
            primary='true'
            rounded='true'
            type='button'
          >
            { t('loadMore') }
          </Button>
        </div>
      ) }
    </div>
  );
};

export default PostList;
