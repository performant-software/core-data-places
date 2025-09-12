import { createContext } from 'react';

interface NotificationContextType {
  content: string;
  header: string;
}

const NotificationContext = createContext<NotificationContextType>(null);

export default NotificationContext;