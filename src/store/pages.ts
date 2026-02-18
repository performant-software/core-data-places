import { atom } from 'nanostores';

interface PageStoreType {
  title?: string;
  transparent?: boolean;
}

const pages = atom<PageStoreType>({
  title: undefined,
  transparent: false
});

export default pages;