import { useEffect } from 'react';
import { useCMS } from 'tinacms';
import { getUserRole } from '../utils/getUserRole';

/**
 * A pseudo-field component that renders a read-only banner when
 * the current user doesn't own the content. Placed at the top
 * of the fields list in posts/paths collections.
 *
 * Also injects a data attribute on the form for CSS-based
 * disabling of other fields.
 */
const OwnershipNotice = (props: any) => {
  const cms = useCMS();
  const { isAdmin, userId } = getUserRole(cms);

  const creatorId = props.tinaForm?.values?.creator?.id;
  const isOwner = !creatorId || creatorId === userId;
  const isReadOnly = !isAdmin && !isOwner;

  useEffect(() => {
    document.body.dataset.tinaReadOnly = isReadOnly ? 'true' : 'false';
  }, [isReadOnly]);

  if (!isReadOnly) return null;

  return (
    <div
      style={{
        background: '#fef3c7',
        border: '1px solid #f59e0b',
        borderRadius: '6px',
        padding: '10px 14px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: '#92400e',
        boxSizing: 'border-box',
        maxWidth: '100%',
      }}
    >
      <span>🔒</span>
      <span style={{ wordBreak: 'break-word', minWidth: 0 }}>
        You're not the author of this content. You can view but not edit.
      </span>
    </div>
  );
};

export default OwnershipNotice;
