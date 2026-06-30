/**
 * Das Model zum übertragen der IBAN Daten.
 */
export interface Iban {
    id?: number;
    iban?: string;
    ibanZurFreigabe?: string;
    ibanBearbeiter?: string;
    ibanFreigeber?: string;
    version?: number;
}
