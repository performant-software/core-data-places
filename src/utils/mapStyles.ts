import branding from '@branding';

const { maps: mapStyles } = branding;

const colors = {
  geometry: mapStyles?.geometry_color ?? '#ff623b',
  selected: mapStyles?.selected_geometry_color ?? '#3b62ff',
}

export const dottedLine = {
  type: 'line',
  paint: {
    'line-color': '#000000',
    'line-opacity': 0.6,
    "line-width": 2,
    "line-dasharray": [1, 1, 1, 1]
  }
}

export const noFill = { type: 'fill', paint: { 'fill-opacity': 0 } };

export const selectablePolygon = {
  type: 'fill',
  paint: {
    'fill-opacity': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      0.6,
      0.2
    ],
    'fill-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      colors.selected,
      colors.geometry
    ]
  }
}

export const selectablePoint = {
  type: 'circle',
  paint: {
    'circle-radius': [
      '*',
      ['case', ['boolean', ['feature-state', 'selected'], false], 2, 1],
      ['interpolate', ['linear'], ['number', ['get', 'point_count'], 1], 0, 4, 10, 14]
    ],
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      colors.selected,
      colors.geometry
    ],
    'circle-stroke-color': '#000000'
  }
}
