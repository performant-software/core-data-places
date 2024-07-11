import TinaPlacePicker from "../src/components/TinaPlacePicker";
import { defineConfig, type TinaField, type Template } from "tinacms";
import config from "../src/i18n/config";
import { t } from "../src/i18n/utils";

const uiFields: TinaField<false>[] = Object.keys(config.ui).map((key: string) => ({
  name: t(key),
  label: config.ui[key as keyof typeof config.ui].tinaLabel,
  type: "string",
  ui: {
    //@ts-ignore
    component: config.ui[key as keyof typeof config.ui]?.textArea ? 'textarea' : 'text'
  }
}));

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "/src/assets",
      publicFolder: "",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "about",
        label: "About the Project",
        path: "content/about",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Project Title",
          },
          {
            type: "string",
            name: "subheader",
            label: "Subheader",
            ui: {
              component: "textarea"
            }
          },
          {
            type: "rich-text",
            name: "description",
            label: "Project Description",
            isBody: true
          },
          {
            type: "image",
            name: "heroImage",
            label: "Hero Image"
          },
          {
            type: "image",
            name: "featureImage",
            label: "Feature Image"
          }
        ],
        ui: {
          allowedActions: {
            create: false,
            delete: false
          }
        }
      },
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            name: "cardImage",
            label: "Card Image",
            type: "image"
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "place",
                label: "Place",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                    required: true,
                    isTitle: true,
                  },
                  {
                    name: "place",
                    label: "Place Data",
                    type: "object",
                    fields: [
                      {
                        name: "title",
                        label: "Title",
                        type: "string",
                        required: true,
                        isTitle: true
                      },
                      {
                        name: "uuid",
                        label: "UUID",
                        type: "string",
                      },
                      {
                        name: "animate",
                        label: "Animate pulsing place marker?",
                        type: "boolean"
                      },
                      {
                        name: "buffer",
                        label: "Map zoom buffer (in miles)",
                        type: "number"
                      },
                      {
                        name: "layer",
                        label: "Custom Map Layer",
                        type: "number",
                        list: true
                      }
                    ],
                    ui: {
                      component: TinaPlacePicker,
                    },
                    required: true,
                  },
                  {
                    name: "caption",
                    label: "Caption",
                    type: "string",
                    ui: {
                      component: "textarea"
                    }
                  }
                ],
              },
            ]
          },
        ],
      },
      {
        name: "path",
        label: "Paths",
        path: "content/paths",
        format: "mdx",
        fields: [
          {
            name: "title",
            label: "Title",
            type: "string",
            required: true,
            isTitle: true,
          },
          {
            name: "image",
            label: "Cover Image",
            type: "image"
          },
          {
            name: "description",
            label: "Description",
            type: "rich-text",
            isBody: true,
          },
          {
            name: "path",
            type: "object",
            list: true,
            ui: {
              itemProps: (item) => {
                return { label: item?.place?.title}
              }
            },
            fields: [
              {
                name: "place",
                label: "Place Data",
                type: "object",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                    required: true,
                    isTitle: true
                  },
                  {
                    name: "uuid",
                    label: "UUID",
                    type: "string",
                  },
                  {
                    name: "animate",
                    label: "Animate pulsing place marker?",
                    type: "boolean"
                  },
                  {
                    name: "buffer",
                    label: "Map zoom buffer (in miles)",
                    type: "number"
                  },
                  {
                    name: "layer",
                    label: "Custom Map Layer",
                    type: "number",
                    list: true
                  }
                ],
                ui: {
                  component: TinaPlacePicker,
                },
                required: true,
              },
              {
                name: "blurb",
                label: "Blurb",
                type: "rich-text"
              }
            ]
          }
        ]
      },
      {
        name: "ui",
        format: "json",
        label: "UI Labels",
        path: "content/ui",
        fields: uiFields
      }
    ],
  },
});
