import FormInput from '@components/FormInput';
import { encode } from '@utils/url';
import { useCallback, useState } from 'react';

interface Props {
  t: (key: string, values?: { [key: string]: string | number }) => string;
}

const ContactForm = (props: Props) => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [organization, setOrganization] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const { t } = props;

  const onSubmit = useCallback(() => {
    fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encode({
        'form-name': 'contact',
        name,
        email,
        organization,
        message
      })
    })
    .then(() => alert("Success!"))
    .catch((error) => alert(error));
  }, [name, email, organization, message]);

  return (
    <div
      className='bg-tertiary flex flex-col h-full'
    >
      <form
        className='flex flex-col mt-8 mb-4 px-8'
        onSubmit={onSubmit}
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
          <button
            className='bg-secondary rounded-md px-4 py-2 text-sm font-semibold shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2'
            type='submit'
          >
            { t('contactForm.send') }
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
