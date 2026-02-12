import { Dispatch, SetStateAction } from "react";

export type Models = 'events' | 'instances' | 'items' | 'mediaContents' | 'organizations' | 'people' | 'places' | 'taxonomies' | 'works';

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

  map?:{
    cluster_radius?: number,
    geometry: string,
    max_zoom?: number,
    zoom_to_place?: boolean
  };

  result_card: {
    attributes?: Array<{
      name: string,
      icon?: string,
      fuzzy_date?: boolean
    }>,
    relationships?: string[],
    title: string,
    tags?: Array<{
      name: string,
      primary?: boolean,
      secondary?: boolean,
      fuzzy_date?: boolean
    }>
  };

  table?: boolean;

  type?: 'grid' | 'image' | 'list' | 'map';

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
    localize_pages?: boolean,
    posts_config?: {
      categories?: Array<String>,
      drafts?: boolean
    }
  };

  core_data: {
    url: string,
    project_ids: string[]
  };

  detail_pages?: {
    models: {
      [key in Models]: {
        related_manifest?: {
          model: string,
          relationship: string
        }
      }
    },
    relationship_fields?: {
      events?: string[],
      instances?: string[],
      items?: string[],
      organizations?: string[],
      people?: string[],
      places?: string[],
      taxonomies?: string[],
      works?: string[]
    }
  };

  i18n: {
    default_locale: string,
    locales: string[]
  },

  gallery?: string,

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

export interface HitComponentProps {
  attributes: {
    fuzzyDate?: boolean;
    label: string;
    icon: string;
    name: string;
    value: string;
  }[]
  relationships: {
    label: string;
    names: string[];
  }
  highlightComponent?: React.FC<any>;
  hit: any;
  setManifestUrl?: Dispatch<SetStateAction<string>>
  tags?: {
    name: string;
    primary?: boolean;
    secondary?: boolean;
    value: string;
  }[]
}
