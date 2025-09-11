export interface SearchConfig {
  name: string,
  route: string,
  geosearch?: boolean,
  timeline?: {
    date_range_facet: string,
    event_path?: string,
  };

  facets?: Array<{
    name: string,
    type: 'list' | 'select',
    icon?: string
  }>;

  map:{
    cluster_radius?: number,
    geometry: string,
    max_zoom?: number,
    zoom_to_place?: boolean
  };

  result_card: {
    attributes?: Array<{
      name: string,
      icon?: string
    }>,
    title: string
  };

  table?: boolean;

  typesense: {
    host: string,
    port: number,
    protocol: string,
    api_key: string,
    index_name: string,
    query_by: string,
    default_sort?: string,
    exclude_fields?: string,
    facets?: {
      exclude?: Array<string>,
      include?: Array<string>
    }
    overrides?: {
      [key: string]: string
    }
  };
}

export interface Configuration {
  content?: {
    collections?: Array<String>,
    localize_pages?: boolean
  };

  core_data: {
    url: string,
    project_ids: string[]
  };

  detail_pages?: Array<string>;

  i18n: {
    default_locale: string,
    locales: string[]
  },

  layers?: Array<{
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
  title?: string;
}

export interface SearchSession {
  created: string;
  data: any;
  id: string;
  name: string;
  searchName: string;
}