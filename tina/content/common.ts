import TinaMediaPicker from '../components/TinaMediaPicker';

export const media = {
  name: "media",
  label: "Media",
  fields: [
    {
      name: "media",
      label: "Media",
      type: "object",
      fields: [
        {
          name: "title",
          label: "Title",
          type: "string",
        },
        {
          name: "uuid",
          label: "UUID",
          type: "string"
        },
        {
          name: "manifest_url",
          label: "Manifest URL",
          type: "string"
        },
        {
          name: "content_url",
          label: "Content URL",
          type: "string"
        },
        {
          name: "content_preview_url",
          label: "Content Preview URL",
          type: "string"
        }
      ],
      ui: {
        component: TinaMediaPicker
      }
    }
  ]
}