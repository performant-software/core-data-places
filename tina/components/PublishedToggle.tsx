import React from 'react';

const PublishedToggle = (props: any) => {
  const role = typeof document !== 'undefined'
    ? document.body.dataset.tinaRole
    : 'admin';

  // Editors cannot see or set the published field
  if (role === 'editor') return null;

  return (
    <div>
      <label
        htmlFor={props.input.name}
        style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}
      >
        {props.field.label || 'Published'}
      </label>
      <input
        id={props.input.name}
        type="checkbox"
        checked={!!props.input.value}
        onChange={(e) => props.input.onChange(e.target.checked)}
      />
    </div>
  );
};

export default PublishedToggle;
