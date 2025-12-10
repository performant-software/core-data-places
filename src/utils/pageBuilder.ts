export const toTextClass = (color: string) => {
  switch (color) {
    case 'primary':
      return '!text-primary';
    case 'secondary':
      return '!text-secondary';
    case 'tertiary':
      return '!text-tertiary';
    case 'content_light':
      return '!text-text-light';
    case 'content_dark':
      return '!text-text-dark';
    case 'content_alternate':
      return '!text-content-alt';
    default:
      return 'text-content'
  }
};

export const toBackgroundClass = (color: string) => {
  switch (color) {
    case 'primary':
      return '!bg-primary';
    case 'secondary':
      return '!bg-secondary';
    case 'tertiary':
      return '!bg-tertiary';
    case 'layout_alternate':
      return '!bg-layout-alt';
    default:
      return 'bg-layout';
  } 
};

export const toBorderClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'border-2 border-primary';
    case 'secondary':
      return 'border-2 border-secondary';
    case 'tertiary':
      return 'border-2 border-tertiary';
    case 'layout':
      return 'border-2 border-layout';
    case 'layout_alternate':
      return 'border-2 border-layout-alt';
    case 'content_light':
      return 'border-2 border-text-light';
    case 'content_dark':
      return 'border-2 border-text-dark';
    case 'content_alternate':
      return 'border-2 border-content-alt';
    default:
      return '';
  } 
};