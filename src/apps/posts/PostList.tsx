import LabelPlaceholder from '@components/LabelPlaceholder';
import { getRelativeLocaleUrl } from 'astro:i18n';
import _ from 'underscore';
import { useCallback, useEffect, useState } from 'react';
import { fetchPosts } from '@backend/api/posts';
import { Button } from '@performant-software/core-data';
import { useTranslations } from '@i18n/useTranslations';
import config from '@config';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  lang: string;
}

const PER_PAGE = 25;

const PostList = (props: Props) => {
  const { t } = useTranslations();
  const { lang } = props;

  const [cursor, setCursor] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onLoadPosts = useCallback(async (cursor?: string) => {
    setLoading(true);
    const params = {
      first: PER_PAGE,
    };

    if (cursor) {
      params['after'] = cursor;
    }

    if (category) {
      params['category'] = category;
    }

    const res = await fetchPosts(params);

    setPosts(prev => prev.concat(res.posts));
    setCursor(res.metadata?.hasNextPage ? res.metadata?.endCursor : null);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    setPosts([]);
    onLoadPosts();
  }, [category]);

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1
          className='text-4xl my-8 font-header'
        >
          { t('posts') || (
            <LabelPlaceholder />
          )}
        </h1>
        {
          config.content?.posts_config?.categories && ( 
            <div className='flex flex-row gap-4 items-center'>
              <Listbox value={category} onChange={setCategory}>
                <ListboxButton className='min-w-[250px] h-12 bg-white rounded-md px-4.5 py-2.5 flex flex-row justify-between items-center'>
                  <span className='text-sm font-semibold'>
                    {category || t('all') }
                  </span>
                  <ChevronDownIcon height={16} width={16} />
                </ListboxButton>
                <ListboxOptions anchor='bottom' className='w-(--button-width) bg-white rounded-md shadow-md p-1 [--anchor-gap:--spacing(1)] focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0'>
                  <ListboxOption key='all' value={null} className='data-focus:bg-gray-100 px-4 py-2 text-sm cursor-pointer'>
                    { t('all') }
                  </ListboxOption>
                  { _.map(config.content.posts_config.categories, (cat) => (
                    <ListboxOption key={cat} value={cat} className='data-focus:bg-gray-100 px-4 py-2 text-sm cursor-pointer'>
                      {cat}
                    </ListboxOption>
                  )) }
                </ListboxOptions>
              </Listbox>
            </div>
          )
        }
      </div>
      <div className='flex flex-col italic text-lg divide-y divide-secondary text-[#222222]'>
        { loading && <p className='not-italic text-base'>{t('loading')}...</p>}
        { _.map(posts, (post) => (
          <a
            className='hover:underline hover:font-semibold py-4 font-header'
            href={getRelativeLocaleUrl(lang, `posts/${post?._sys?.filename}`)}
            key={post?._sys?.filename}
          >
            <p>
              { post?.title }
            </p>
          </a>
        )) }
      </div>
      { cursor && !loading && (
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
