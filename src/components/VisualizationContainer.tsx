import { type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
}

const VisualizationContainer = (props: Props) => {
  return (
    <>
      <h3>
        { props.title }
      </h3>
      { props.children }
    </>
  );
};

export default VisualizationContainer;