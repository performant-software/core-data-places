export function t(identifier: string) {
    return `t_${identifier.replaceAll('-', '').replaceAll(' ', '').replaceAll('.', '_')}`;
  }