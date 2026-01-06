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
    case 'layout':
      return 'bg-layout';
    default:
      return 'bg-layout';
  } 
};

export const toBorderClass = (color: string, thick?: boolean) => {
  switch (color) {
    case 'primary':
      return thick ? 'border-2 border-primary' : 'border border-primary';
    case 'secondary':
      return thick ? 'border-2 border-secondary' : 'border border-secondary';
    default:
      return '';
  } 
};