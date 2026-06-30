export interface HistoryEntry {
    datum: Date;
    revId: number;
    kategorie: string;
    feldname: string;
    wert: string;
    datumZeit: Date;
    revType: string;
    feld: string;
    auto: boolean;
    feldKey: string;
    errorConversionMessage: string | null;
}
