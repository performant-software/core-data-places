import { ReactNode, useEffect, useState } from 'react'
import { wrapFieldsWithMeta } from 'tinacms';
import TinaModelPicker from './TinaModelPicker';
import ToggleField from './ToggleField';

interface CustomTinaFieldProps {
  field: any,
  input: any,
  meta: any
}

interface ModelPickerConfig {
  fetchAll: (params: any) => Promise<any>;
  responseKey: string;
  transformItem?: (item: any) => { name: string, uuid: string };
  getMessage?: (selected: any) => string;
  renderExtraFields?: (props: CustomTinaFieldProps, setField: (key: string, value: unknown) => void, selected: any) => ReactNode;
}

const createTinaModelPickerField = (config: ModelPickerConfig) => (
  wrapFieldsWithMeta((props: CustomTinaFieldProps) => {
    const [selected, setSelected] = useState<any>({
    ...props.input.value,
    name: props.input.value?.title
  });

    useEffect(() => {
      props.input.onChange({
        ...props.input.value,
        title: selected?.name,
        uuid: selected?.uuid
      });
    }, [selected]);

    const setField = (key: string, value: unknown) => {
      props.input.onChange({
        ...props.input.value,
        [key]: value
      });
    };

    return (
      <TinaModelPicker
        message={config.getMessage?.(selected)}
        onChange={setSelected}
        onLoad={(params) => (
          config
            .fetchAll(params)
            .then((data) => data[config.responseKey])
        )}
        transformItem={config.transformItem}
        value={selected || {}}
      >
        <ToggleField
          checked={props.input.value.media}
          label='Include related media gallery?'
          onChange={(checked) => setField('media', checked)}
        />
        <ToggleField
          checked={props.input.value.map}
          label='Include related places map?'
          onChange={(checked) => setField('map', checked)}
        />
        { config.renderExtraFields?.(props, setField, selected) }
      </TinaModelPicker>
    );
  })
);

export default createTinaModelPickerField;
