import { TinaField } from 'tinacms';
import TinaMediaPicker from '../components/fairdata/TinaMediaPicker';
import EditHistory from '../components/EditHistory';
import TinaEventPicker from '../components/fairdata/TinaEventPicker';
import TinaInstancePicker from '../components/fairdata/TinaInstancePicker';
import TinaItemPicker from '../components/fairdata/TinaItemPicker';
import TinaPersonPicker from '../components/fairdata/TinaPersonPicker';
import TinaPlacePicker from '../components/fairdata/TinaPlacePicker';
import TinaOrganizationPicker from '../components/fairdata/TinaOrganizationPicker';
import TinaWorkPicker from '../components/fairdata/TinaWorkPicker';

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
    },
    {
      name: "ratio",
      label: "Ratio",
      type: "string",
      description: "Ratio of horizontal space that each pane of the viewer should take up. The image is on the left and the metadata is on the right. (Default: 2:1)",
      options: [
        { value: "clover-12", label: "1:2" },
        { value: "clover-11", label: "1:1" },
        { value: "clover-21", label: "2:1" }
      ]
    }
  ]
}

export const commonCollectionFields: TinaField<false>[] = [
  {
    name: 'history',
    label: 'Edit History',
    type: 'object',
    list: true,
    fields: [{
      name: 'user_email',
      label: 'User',
      type: 'string'
    }, {
      name: 'timestamp',
      label: 'Timestamp',
      type: 'datetime'
    }, {
      name: 'user_id',
      label: 'User ID',
      type: 'string'
    }],
    ui: {
      component: EditHistory
    }
  }
]

export const fairdataEmbedTemplates = [{
  name: 'event',
  label: 'Event',
  fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaEventPicker
    }
  }],
}, {
  name: 'instance',
  label: 'Instance',
  fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaInstancePicker
    }
  }],
}, {
  name: 'item',
  label: 'Item',
  fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaItemPicker
    }
  }],
}, {
  name: 'person',
  label: 'Person',
  fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaPersonPicker
    }
  }],
}, {
  name: 'place',
  label: 'Place',
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'string',
      required: true,
      isTitle: true,
    },
    {
      name: 'place',
      label: 'Place Data',
      type: 'object',
      fields: [
        {
          name: 'title',
          label: 'Title',
          type: 'string',
          required: true,
          isTitle: true
        },
        {
          name: 'uuid',
          label: 'FairData Record',
          type: 'string',
        },
        {
          name: 'animate',
          label: 'Animate pulsing place marker?',
          type: 'boolean'
        },
        {
          name: 'buffer',
          label: 'Map zoom buffer (in miles)',
          type: 'number'
        },
        {
          name: 'layer',
          label: 'Custom Map Layer',
          type: 'number',
          list: true
        }
      ],
      ui: {
        component: TinaPlacePicker,
      },
      required: true,
    },
    {
      name: 'caption',
      label: 'Caption',
      type: 'string',
      ui: {
        component: 'textarea'
      }
    }
  ]
}, {
  name: 'organization',
  label: 'Organization',
  fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaOrganizationPicker
    }
  }],
}, {
  name: 'work',
  label: 'Work',
   fields: [{
    name: 'record',
    type: 'object',
    required: true,
    fields: [{
      name: 'uuid',
      label: 'FairData Record',
      type: 'string'
    }, {
      name: 'title',
      label: 'Name',
      type: 'string'
    }, {
      name: 'map',
      label: 'Include map?',
      type: 'boolean'
    }, {
      name: 'media',
      label: 'Include media?',
      type: 'boolean'
    }],
    ui: {
      component: TinaWorkPicker
    }
  }],
}, media];