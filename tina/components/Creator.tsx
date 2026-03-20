import { wrapFieldsWithMeta } from 'tinacms';

const Creator = wrapFieldsWithMeta((props: any) => {
  return (
    <p>{props.input.value?.email}</p>
  )
});

export default Creator;