export interface Field {
  showCaption?: boolean;
  displayLabel?: string;
  facet?: boolean;
  isUserDefined?: boolean;
  show?: boolean;
  snippet?: number;
  render?: (hit: any) => string;
  type?: "identifier" | "showcase";
}

export type Locale = 'en' | 'fr'
