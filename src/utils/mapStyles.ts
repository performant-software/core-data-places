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
      '#3b62ff',
      '#ff623b'
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
      '#3b62ff',
      '#ff623b'
    ],
    'circle-stroke-color': '#000000'
  }
}
