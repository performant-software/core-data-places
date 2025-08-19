import React from 'react';
import { useTina } from 'tinacms/dist/react';

interface VisualEditingWrapperProps {
  data: any;
  query: string;
  variables?: any;
  children: (props: { data: any }) => React.ReactNode;
  className?: string;
}

/**
 * Visual editing wrapper component that enables TinaCMS visual editing
 * for any content section when in edit mode.
 */
export const VisualEditingWrapper: React.FC<VisualEditingWrapperProps> = ({
  data,
  query,
  variables = {},
  children,
  className = ''
}) => {
  // Use TinaCMS hook for visual editing
  const { data: tinaData } = useTina({
    query,
    variables,
    data
  });

  // Check if we're in visual editing mode
  const isEditMode = typeof window !== 'undefined' && 
    (new URLSearchParams(window.location.search).get('__tina_edit') === 'true' ||
     new URLSearchParams(window.location.search).has('tina_edit'));

  const wrapperClass = `${className} ${isEditMode ? 'tina-visual-editing-active' : ''}`.trim();

  return (
    <div className={wrapperClass} data-tina-field={isEditMode ? 'content' : undefined}>
      {children({ data: tinaData })}
    </div>
  );
};

export default VisualEditingWrapper;