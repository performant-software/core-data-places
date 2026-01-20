import FormInput from '@components/FormInput';
import Loader from '@components/Loader';
import { useTranslations } from '@i18n/useTranslations';
import { Button } from '@performant-software/core-data/ssr';
import NotificationsStore from '@store/notifications';
import { useCallback, useState } from 'react';

const ContactForm = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');

  const { t } = useTranslations();

  /**
   * Resets the loading state, form inputs, and displays the notification panel.
   */
  const afterSubmit = useCallback(() => {
    // Reset the loading state
    setLoading(false);

    // Reset the form inputs
    setName('');
    setEmail('');
    setOrganization('');
    setMessage('');

    // Display the notification
    NotificationsStore.set({
      content: t('contactFormSubmitted.content'),
      header: t('contactFormSubmitted.header'),
      open: true,
      timeout: 5000
    });
  }, [t]);

  /**
   * Submits the POST request with the form data.
   */
  const onSubmit = useCallback((event: any) => {
    event.preventDefault();

    setLoading(true);

    fetch('/forms/contact.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'form-name': 'contact',
        name,
        email,
        organization,
        message
      }).toString()
    })
    .then(afterSubmit);
  }, [name, email, organization, message]);

  return (
    <div
      className='bg-tertiary flex flex-col h-full'
    >
      <form
        className='flex flex-col mt-8 mb-4 px-8'
      >
        <input
          name='form-name'
          type='hidden'
          value='contact'
        />
        <input
          className='hidden'
          name='bot-field'
        />
        <FormInput
          className='py-3'
          name='name'
          onChange={(event) => setName(event.target.value)}
          label={t('contactForm.name')}
          type='text'
          value={name}
        />
        <FormInput
          className='py-3'
          name='email'
          onChange={(event) => setEmail(event.target.value)}
          label={t('contactForm.email')}
          type='text'
          value={email}
        />
        <FormInput
          className='py-3'
          name='organization'
          onChange={(event) => setOrganization(event.target.value)}
          label={t('contactForm.organization')}
          type='text'
          value={organization}
        />
        <FormInput
          className='py-3'
          name='message'
          onChange={(event) => setMessage(event.target.value)}
          label={t('contactForm.message')}
          type='textarea'
          value={message}
        />
        <div
          className='flex justify-end mt-4'
        >
          <Button
            disabled={loading}
            onClick={onSubmit}
            rounded
            secondary
          >
            { t('contactForm.send') }
            <Loader
              active={loading}
            />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;