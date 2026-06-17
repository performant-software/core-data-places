export const dottedLine = {
  type: 'line',
  paint: {
    'line-color': '#ff623b',
    'line-opacity': 0.6,
    "line-width": 4,
    "line-dasharray": [2, 2, 2, 2]
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
      'interpolate',
      ['linear'],
      ['number', ['get', 'point_count'], 1],
      0, 4,
      10, 14
    ],
    'circle-stroke-width': 1,
    'circle-color': [
      'case',
      ['boolean', ['feature-state', 'selected'], false],
      '#3b62ff',
      '#ff623b'
    ],
    'circle-stroke-color': '#8d260c'
  }
}
