import { SearchContextProvider } from '@apps/search/SearchContext';
import SearchVisualizations, { ItemViews } from '@apps/session/SearchVisualizations';
import { fetchSessionItem } from '@backend/api/session';
import TranslationContext from '@contexts/TranslationContext';
import { useTranslations } from '@i18n/useTranslations';
import { Button, ButtonGroup, Peripleo as PeripleoUtils } from '@performant-software/core-data';
import { Peripleo, RuntimeConfig } from '@peripleo/peripleo';
import type { SearchSession } from '@types';
import { useEffect, useState } from 'react';

interface Props {
  id: string;
  lang: string;
  sessionId?: string;
}

const SearchItem = (props: Props) => {
  const [item, setItem] = useState<SearchSession | undefined>();
  const [view, setView] = useState<number>(ItemViews.map);

  const { id, lang, sessionId } = props;
  const { t } = useTranslations();

  /**
   * Fetches the session item specified by the passed ID and sets it on the state.
   */
  useEffect(() => {
    fetchSessionItem('search', id, sessionId)
      .then(setItem);
  }, []);

  if (!item) {
    return null;
  }

  return (
    <RuntimeConfig
      path='/config.json'
      preprocess={PeripleoUtils.normalize}
    >
      <Peripleo>
        <TranslationContext.Provider
          value={{ lang, t }}
        >
          <SearchContextProvider
            name={item?.searchName}
          >
            <div
              className='flex justify-between items-center'
            >
              <div>
                <h1
                  className='text-2xl font-bold m-0'
                >
                  { item.name }
                </h1>
                <div className='mt-1 flex items-center gap-x-1 text-gray-500'>
                  { t(`index_${item.searchName}`) }
                </div>
              </div>
              <ButtonGroup
                className='py-4 text-sm'
                rounded
              >
                <Button
                  onClick={() => setView(ItemViews.map)}
                  secondary={view === ItemViews.map}
                >
                  { t('map') }
                </Button>
                <Button
                  onClick={() => setView(ItemViews.table)}
                  secondary={view === ItemViews.table}
                >
                  { t('table') }
                </Button>
                <Button
                  onClick={() => setView(ItemViews.timeline)}
                  secondary={view === ItemViews.timeline}
                >
                  { t('timeline') }
                </Button>
              </ButtonGroup>
            </div>
            <SearchVisualizations
              data={item.data}
              view={view}
            />
          </SearchContextProvider>
        </TranslationContext.Provider>
      </Peripleo>
    </RuntimeConfig>
  );
};

export default SearchItem;