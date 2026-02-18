import { atom } from 'nanostores';

interface PageStoreType {
  title?: string;
}

const pages = atom<PageStoreType>({
  title: undefined
});

export default pages;