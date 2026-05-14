import LabelPlaceholder from '@components/LabelPlaceholder';
import _ from 'underscore';
import { useCallback, useEffect, useState } from 'react';
import { fetchPaths } from '@backend/api/paths';
import { Button } from '@performant-software/core-data';
import { useTranslations } from '@i18n/useTranslations';
import config from '@config';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import Cards from '@components/Cards';
import Card from '@components/Card';
import { getRelativeLocaleUrl } from 'astro:i18n';

interface Props {
  lang: string;
  sort?: {
    name: string;
    direction?: 'asc' | 'desc';
  };
}

const PER_PAGE = 25;

const PathList = (props: Props) => {
  const { t } = useTranslations();
  const { sort, lang } = props;

  const [cursor, setCursor] = useState<string | null>(null);
  const [paths, setPaths] = useState<any[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onLoadPaths = useCallback(async (cursor?: string) => {
    setLoading(true);
    const params = sort?.direction === 'desc'
      ? {
        last: PER_PAGE,
        sort: sort?.name
      } 
      : {
        first: PER_PAGE,
      };

    if (cursor) {
      if (sort?.direction === 'desc') {
        params['before'] = cursor;
      } else {
        params['after'] = cursor;
      }
    }

    if (category) {
      params['category'] = category;
    }

    const res = await fetchPaths(params);

    setPaths(prev => prev.concat(res.paths));
    const next = sort?.direction === 'desc' ? 'hasPreviousPage' : 'hasNextPage';
    setCursor((res.metadata && res.metadata[next]) ? res.metadata?.endCursor : null);
    setLoading(false);
  }, [category]);

  useEffect(() => {
    setPaths([]);
    onLoadPaths();
  }, [category]);

  const layout = config.content?.paths_config?.layout || 'list';

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1
          className='text-4xl my-8 font-header'
        >
          { t('paths') || (
            <LabelPlaceholder />
          )}
        </h1>
        {
          config.content?.paths_config?.categories && ( 
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
                  { _.map(config.content.paths_config.categories, (cat) => (
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
      { loading && <p className='text-base'>{t('loading')}...</p>}
      { !loading && (
        <div className='flex flex-col text-lg divide-y divide-secondary text-[#222222]'>
          { layout === 'list' && (
            <>
              { _.map(paths, (path) => (
                <a
                  className='hover:underline hover:font-semibold py-4 font-header italic'
                  href={getRelativeLocaleUrl(lang, `paths/${path?._sys?.filename}`)}
                  key={path?._sys?.filename}
                >
                  <p>
                    { path?.title }
                  </p>
                </a>
              )) }
            </>
          )}
          { layout === 'grid' && (
            <Cards>
              { _.map(paths, (path) => (
                <Card
                  imageUrl={path?.cardImage}
                  alt={path?.imageAlt}
                  slug={getRelativeLocaleUrl(lang, `paths/${path._sys.filename}`)}
                  title={path.title}
                  date={path.date}
                  key={path?._sys?.filename}
                  labels={{
                    byline: t('by', { author: path.author, date: path.date }),
                    readMore: t('readMore')
                  }}
                />
              ))}
            </Cards>
          )}
        </div>
      )}
      { cursor && !loading && (
        <div className='w-full flex justify-center items-center py-6'>
          <Button
            onClick={() => onLoadPaths(cursor)}
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

export default PathList;
