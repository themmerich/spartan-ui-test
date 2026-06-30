import { HistoryEntry } from './history-entry';

export interface HistoryGroup {
    id?: string;
    datum: string;
    kategorie: string;
    entries: HistoryEntry;
}
