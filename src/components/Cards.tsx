interface Props {
  children: any;
}

const Cards = (props: Props) => {
  return (
    <div
      className='mx-auto mt-4 grid max-w-2xl grid-cols-1 gap-8 pt-4 lg:mx-0 lg:max-w-none lg:grid-cols-3'
    >
      { props.children }
    </div>
  );
}

export default Cards;
