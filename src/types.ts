export interface SearchConfig {
  name: string,
  route: string,
  geosearch?: boolean,

  facets?: Array<{
    name: string,
    type: 'list' | 'select',
    icon?: string
  }>,

  map:{
    cluster_radius?: number,
    geometry: string,
    max_zoom?: number,
    zoom_to_place?: number
  },

  result_card: {
    attributes?: Array<{
      name: string,
      icon?: string
    }>,
    title: string
  }
}

export interface Configuration {
  branding?: {
    header_hide_title?: boolean,
    footer_hide_logo?: boolean,
    footer_hide_title?: boolean,
    footer_login?: boolean,
    footer_logo?: string,
    footer_orgs?: Array<{ alt: string, logo: string, url: string }>,
    primary?: string
  };

  content?: Array<'posts' | 'paths'>;

  core_data: {
    url: string,
    project_ids: number[]
  };

  detail_pages: Array<string>;

  i18n: {
    default_locale: string,
    locales: string[]
  },

  layers: Array<{
    name: string,
    layer_type: 'geojson' | 'vector' | 'raster' | 'georeference',
    url: string,
    overlay?: boolean
  }>,

  result_filtering?: {
    events?: {
      exclude?: string[]
    },
    instances?: {
      exclude?: string[]
    },
    items?: {
      exclude?: string[]
    },
    organizations?: {
      exclude?: string[]
    },
    people?: {
      exclude?: string[]
    },
    places?: {
      exclude?: string[]
    },
    works?: {
      exclude?: string[]
    }
  },

  search: Array<SearchConfig>
}

export interface DataVisualizationProps {
  data: any;
  title: string;
}