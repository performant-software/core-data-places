export const createDataVisualization = ({ name, label, component, fields = [] }) => ({
  name,
  label,
  fields: [{
    name: 'title',
    label: 'Title',
    type: 'string',
    required: true,
    isTitle: true
  }, {
    name: 'data',
    label: 'Data',
    type: 'string',
    ui: {
      component
    }
  }, ...fields]
});