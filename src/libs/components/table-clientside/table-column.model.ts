export type ColumnType =
    // status / tag columns
    | 'status'
    | 'status_einsatzort'
    | 'status_externer_einsatzort'
    | 'news_status'
    | 'termin_typ'
    | 'dms_status'
    | 'regel_aktiv'
    | 'platz_status'
    | 'vorlagen_stand'
    | 'mitarbeiter_status'
    // chip columns
    | 'dms_vorlagenart'
    | 'dms_variante'
    | 'dms_kategorie'
    | 'vorlagen_gruende'
    | 'faq_kategorie'
    | 'news_rollen'
    | 'faq_zielgruppe'
    | 'mitarbeiter_rollen'
    // translated value columns
    | 'dms_name'
    | 'regel_kategorie'
    | 'uebersetzung_uebersetzungsrichtung'
    | 'platz_kategorie'
    | 'wechsel_art'
    | 'wiedervorlagen_grund'
    | 'wiedervorlagen_modus'
    | 'wiedervorlagen_stand'
    | 'regel_wert'
    // link / composite columns
    | 'buero'
    | 'inhaberBuroFirma'
    | 'einsatzort'
    | 'einsatzort_lang'
    | 'einsatzort_ersteller'
    | 'vorlagen_dolmetscher'
    | 'vorlagen_buero'
    | 'vorlagen_inhaber'
    | 'orgEinheit'
    | 'strasse_hausnummer'
    // person columns
    | 'faq_mitarbeiter'
    | 'erfasser'
    | 'aktiv_setzer'
    | 'entwurf_ersteller'
    | 'notiz_ersteller'
    | 'wv_bemerkung'
    // misc / scalar columns
    | 'profiltyp'
    | 'mitarbeiter_einsatzorte'
    | 'sprache'
    | 'sprachen'
    | 'date'
    | 'date_time'
    | 'wechsel_date'
    | 'boolean'
    | 'number'
    | 'percentage'
    | 'email'
    | 'phone'
    | 'currency_eur'
    | 'html'
    | 'revision_typ'
    // fallback
    | (string & {});

export type Column = {
    field: string;
    header: string;
    type: ColumnType;
    sort: boolean;
    show: boolean;
};
