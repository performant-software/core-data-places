# Map Zoom & Center Configuration

## Overview
Add configuration options to control map zoom constraints and initial view, using MapLibre's native options.

## New Configuration Options

Add to the `map` configuration object in `config.json`:

- **`min_zoom?: number`** - Minimum allowed zoom level (0-24)
- **`max_zoom?: number`** - Maximum allowed zoom level (0-24) *(already exists, will be enhanced)*
- **`default_zoom?: number`** - Initial zoom level when map loads
- **`default_center?: [number, number]`** - Initial center point as `[longitude, latitude]`

## Behavior

- **`min_zoom` / `max_zoom`**: Hard constraints - users cannot zoom beyond these limits
- **`default_zoom` / `default_center`**: Initial view only - users can pan/zoom away
- **If not set**: Falls back to MapLibre defaults (current behavior preserved)
  - `minZoom`: 0
  - `maxZoom`: 22
  - `zoom`: 0
  - `center`: [0, 0]
- **Existing `zoom_to_place` behavior**: Should still work - it controls whether results auto-fit the viewport

## Implementation Changes

### 1. Update TypeScript Types (`src/types.ts`)

Add to the `map` configuration interface:

```typescript
map: {
  cluster_radius?: number,
  default_center?: [number, number],  // NEW
  default_zoom?: number,              // NEW
  geometry: string,
  max_zoom?: number,                  // EXISTING (enhance usage)
  min_zoom?: number,                  // NEW
  zoom_to_place?: boolean
};
```

**Note:** `max_zoom` already exists but is currently only used for bounding box operations, not as a MapLibre constraint.

### 2. Update Map Component (`src/components/Map.tsx`)

Currently receives no zoom/center configuration from the search config. Need to:

- Accept new props: `minZoom?`, `maxZoom?`, `zoom?`, `center?`
- Pass these through to the `<PeripleoMap>` component (which extends MapLibre's `MapOptions`)

```typescript
interface Props {
  children: ReactNode,
  classNames?: {
    controls?: string
    root?: string,
  };
  // NEW props
  center?: [number, number];
  minZoom?: number;
  maxZoom?: number;
  zoom?: number;
}

const Map = (props: Props) => {
  // ...
  return (
    <PeripleoMap
      attributionControl={false}
      className={clsx('grow', props.classNames?.root)}
      style={PeripleoUtils.toLayerStyle(baseLayer, baseLayer.name)}
      center={props.center}      // NEW
      minZoom={props.minZoom}    // NEW
      maxZoom={props.maxZoom}    // NEW
      zoom={props.zoom}          // NEW
    >
      {/* ... */}
    </PeripleoMap>
  );
};
```

### 3. Wire Configuration Through (`src/apps/search/MapView.tsx`)

Pass the search config values to the `<Map>` component:

```typescript
const MapView = () => {
  const config = useSearchConfig();
  // ...

  return (
    <Map
      classNames={{
        controls: controlsClass
      }}
      center={config.map.default_center}    // NEW
      minZoom={config.map.min_zoom}         // NEW
      maxZoom={config.map.max_zoom}         // NEW
      zoom={config.map.default_zoom}        // NEW
    >
      {/* ... */}
    </Map>
  );
};
```

## Content Repo Configuration Example

Since configuration lives in a separate content repo, users would add to their `config.json`:

```json
{
  "search": [{
    "name": "Example Search",
    "map": {
      "geometry": "location.geometry",
      "min_zoom": 2,
      "max_zoom": 18,
      "default_zoom": 5,
      "default_center": [-98.5795, 39.8283],
      "zoom_to_place": true
    }
  }]
}
```

### Example Use Cases

**Constrain to regional view:**
```json
{
  "min_zoom": 4,
  "max_zoom": 16,
  "default_zoom": 6,
  "default_center": [-73.935242, 40.730610]  // New York City
}
```

**Prevent excessive zoom out (world view):**
```json
{
  "min_zoom": 3,
  "default_zoom": 5
}
```

**Start at specific location without constraints:**
```json
{
  "default_zoom": 12,
  "default_center": [2.3522, 48.8566]  // Paris
}
```

## Files to Modify

1. `src/types.ts` - Add type definitions
2. `src/components/Map.tsx` - Accept and apply props
3. `src/apps/search/MapView.tsx` - Pass config to Map component

## Testing

After implementation, test with:
1. Configuration with all options set
2. Configuration with only min/max zoom
3. Configuration with only default zoom/center
4. No configuration (verify default behavior preserved)
5. Verify `zoom_to_place` still works correctly with new constraints
