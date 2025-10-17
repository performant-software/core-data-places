import { saveSession } from '@backend/api/session';
import TranslationContext from '@contexts/TranslationContext';
import {
  Button,
  Input,
  Modal,
  useCachedHits
} from '@performant-software/core-data';
import NotificationsStore from '@store/notifications';
import { useCallback, useContext, useState } from 'react';
import { useSearchConfig } from "@apps/search/SearchConfigContext";

const SaveButton = () => {
  const [name, setName] = useState<string>();
  const [open, setOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const { name: searchName } = useSearchConfig();
  const hits = useCachedHits();

  const { t } = useContext(TranslationContext);

  /**
   * Callback fired after the save action is completed.
   */
  const afterSave = useCallback(() => {
    // Close the save modal and reset the name
    setOpen(false);
    setName(undefined);
    setSaving(false);

    // Display the notification
    NotificationsStore.set({
      content: t('saveSearchContent'),
      header: t('saveSearchHeader'),
      open: true
    });
  }, [t]);

  /**
   * Saves the current session and closes the modal.
   */
  const onSave = useCallback(() => {
    setSaving(true);

    const data = {
      data: hits,
      name,
      searchName
    };

    saveSession('search', data)
      .then(afterSave);
  }, [afterSave, hits, name, searchName]);

  return (
    <>
      <Button
        className='text-sm text-nowrap'
        onClick={() => setOpen(true)}
        rounded
        secondary
      >
        { t('saveSearch') }
      </Button>
      <Modal
        onClose={() => setOpen(false)}
        open={open}
        title={t('savedSearchName')}
      >
        <form>
          <div
            className='mt-6'
          >
            <Input
              className='rounded-md'
              clearable={false}
              onChange={(value: string) => setName(value)}
              value={name}
            />
          </div>
          <div
            className='flex justify-end mt-6'
          >
            <Button
              disabled={!name || saving}
              onClick={onSave}
              primary
              rounded
            >
              { t('save') }
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SaveButton;