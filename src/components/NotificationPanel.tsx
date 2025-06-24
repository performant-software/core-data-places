import { useStore } from '@nanostores/react';
import { Notification } from '@performant-software/core-data';
import NotificationsStore from '@store/notifications';
import React, { useCallback } from 'react';

const DEFAULT_TIMEOUT = 4000;

const NotificationPanel = () => {
  const {
    content,
    header,
    icon,
    open,
    timeout = DEFAULT_TIMEOUT
  } = useStore(NotificationsStore);

  /**
   * Callback fired when the notification panel is closed.
   */
  const onClose = useCallback(() => NotificationsStore.set({ open: false }), []);

  return (
    <Notification
      content={content}
      header={header}
      icon={icon}
      onClose={onClose}
      open={open}
      timeout={timeout}
    />
  );
};

export default NotificationPanel;