import React from 'react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import { VisualEditingWrapper } from './VisualEditingWrapper';

interface PageSectionProps {
  data: {
    page: {
      title: string;
      body: any;
    };
  };
  query: string;
  variables: any;
}

/**
 * Example component showing how to implement visual editing
 * for a page section using TinaCMS.
 */
export const VisualEditablePageSection: React.FC<PageSectionProps> = ({
  data,
  query,
  variables
}) => {
  return (
    <VisualEditingWrapper
      data={data}
      query={query}
      variables={variables}
      className="visual-editable-section"
    >
      {({ data: tinaData }) => (
        <div className="prose prose-lg max-w-none">
          <h1 data-tina-field="title" className="text-3xl font-bold mb-6">
            {tinaData.page.title}
          </h1>
          <div data-tina-field="body">
            <TinaMarkdown content={tinaData.page.body} />
          </div>
        </div>
      )}
    </VisualEditingWrapper>
  );
};

export default VisualEditablePageSection;