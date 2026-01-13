export const toTextClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'text-primary';
    case 'secondary':
      return 'text-secondary';
    case 'tertiary':
      return 'text-tertiary';
    default:
      return 'text-content'
  }
};

export const toBackgroundClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'bg-primary';
    case 'secondary':
      return 'bg-secondary';
    case 'tertiary':
      return 'bg-tertiary';
    case 'layout_alternate':
      return 'bg-layout-alt';
    default:
      return '';
  } 
};

export const toBorderClass = (color: string) => {
  switch (color) {
    case 'primary':
      return 'border-2 border-primary';
    case 'secondary':
      return 'border-2 border-secondary';
    default:
      return '';
  } 
};