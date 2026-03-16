import React from 'react';

const ReadOnlyText = (props: any) => {
  if (!props.input.value) return null;

  return (
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>
        {props.field.label || 'Created by'}
      </label>
      <span style={{ color: '#555' }}>{props.input.value}</span>
    </div>
  );
};

export default ReadOnlyText;
