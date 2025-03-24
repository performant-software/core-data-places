import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../tailwind.config';

export const useTailwindConfig = () => {
  return resolveConfig(tailwindConfig);
};