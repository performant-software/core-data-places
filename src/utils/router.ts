/**
 * Returns the current record ID for the passed route.
 *
 * @param route
 */
export const getCurrentId = (route: string) => {
  const [, uuid] = route.split('/').filter(Boolean);
  return uuid;
};

/**
 * Returns the current path for the passed route.
 *
 * @param route
 */
export const getCurrentPath = (route: string) => {
  const [path,] = route.split('/').filter(Boolean);
  return path;
};

/**
 * Returns the icon based on the passed route.
 *
 * @param route
 */
export const getIcon = (route: string) => {
  let icon;

  switch (route) {
    case '/events':
      icon = 'date';
      break;

    case '/organizations':
      icon = 'occupation';
      break;

    case '/people':
      icon = 'person';
      break;

    case '/places':
      icon = 'location';
      break;
  }

  return icon;
};

/**
 * Returns the record label for the passed route.
 *
 * @param route
 */
export const getItemLabel = (route: string, t) => {
  let label;

  switch (route) {
    case '/events':
      label = t('event');
      break;

    case '/instances':
      label = t('instance');
      break;

    case '/items':
      label = t('item');
      break;

    case '/organizations':
      label = t('organization');
      break;

    case '/people':
      label = t('person');
      break;

    case '/places':
      label = t('place');
      break;

    case '/works':
      label = t('work');
      break;
  }

  return label;
};