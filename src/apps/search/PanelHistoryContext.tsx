import {
  createContext
} from 'react';

export interface PanelHistoryEntryType {
  name: string;
  uuid: string;
  route: string;
}

const PanelHistoryContext = createContext<{ 
  panelHistory: PanelHistoryEntryType[],
  setPanelHistory: (any) => void
}>({ panelHistory: [], setPanelHistory: () => {return;}});

export default PanelHistoryContext;