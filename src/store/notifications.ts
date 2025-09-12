import { atom } from 'nanostores';

interface NotificationStoreType {
  content?: string;
  header?: string;
  icon?: {
    className?: string;
    name: string;
    size?: number;
  };
  open: boolean;
  timeout?: number;
}

const notifications = atom<NotificationStoreType>({
  open: false
});

export default notifications;