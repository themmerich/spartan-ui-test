import { TranslateService } from '@ngx-translate/core';
import { BooleanFormatterPipe, SwitchValueFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/boolean-formatter.pipe';
import { LanguageFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/language-formatter.pipe';
import { SprachePipe } from '@babs/babs-frontend-shared/lib/formatting/sprache.pipe';
import { isBitValue, isBooleanValue } from '../../../../../../apps/babs-frontend-int/src/app/entities/regel/regel.model';
import { Column } from './table-column.model';

type Row = Record<string, any>;
type NewRow = Record<string, any>;

export type FormatContext = {
    translate: TranslateService;
    switchValueFormatter: SwitchValueFormatterPipe;
    booleanFormatter: BooleanFormatterPipe;
    sprache: SprachePipe;
    language: LanguageFormatterPipe;
};

export function getFieldValue(row: Row, field: string): any {
    return field.split('.').reduce((acc, part) => acc?.[part], row);
}

function isDropdownRegel(row: Row): boolean {
    return ['WARTUNG'].includes(getFieldValue(row, 'schluessel'));
}

function isBooleanRegel(row: Row): boolean {
    return isBooleanValue.includes(getFieldValue(row, 'schluessel'));
}

function isBitRegel(row: Row): boolean {
    return isBitValue.includes(getFieldValue(row, 'schluessel'));
}

function applyTranslatedColumns(newRow: NewRow, row: Row, column: Column, ctx: FormatContext): boolean {
    const t = ctx.translate;
    const field = column.field;
    switch (column.type) {
        case 'status':
            newRow[field] = t.instant('babsappApp.DolmetscherStatus.' + row[field]);
            return true;
        case 'status_einsatzort':
            newRow[field] = t.instant('babsappApp.einsatzort.status2.' + row[field]);
            newRow['einsatzortStatusValue'] = row[field];
            newRow['laengengrad'] = row['laengengrad'];
            newRow['breitengrad'] = row['breitengrad'];
            newRow['kommentar'] = row['kommentar'];
            newRow['erlaubteSonderEinsatzarten'] = row['erlaubteSonderEinsatzarten'];
            return true;
        case 'status_externer_einsatzort':
            newRow[field] = t.instant('babsappApp.jva.status2.' + row[field]);
            newRow['einsatzortStatusValue'] = row[field];
            newRow['laengengrad'] = row['laengengrad'];
            newRow['breitengrad'] = row['breitengrad'];
            newRow['auswaehlbareEinsatzarten'] = row['auswaehlbareEinsatzarten'];
            return true;
        case 'news_status': {
            const newsStatus = row[field] as any[];
            newRow['newsStatusValue'] = newsStatus;
            newRow[field] = t.instant('babsappApp.news.status.' + newsStatus);
            return true;
        }
        case 'termin_typ':
            newRow[field] = t.instant('babsappApp.TerminTyp.' + row[field]);
            return true;
        case 'dms_status':
            newRow[field] = t.instant('babsappApp.dms.maps.status.' + row[field]);
            return true;
        case 'dms_name':
            newRow[field] = t.instant('babsappApp.dms.maps.dokumentenname.' + row[field]);
            return true;
        case 'dms_kategorie':
            newRow[field] = [t.instant('babsappApp.dms.maps.kategorie.' + row[field])];
            return true;
        case 'regel_kategorie':
            newRow['kategorieValue'] = row[field];
            newRow[field] = t.instant('babsappApp.RegelKategorie.' + row[field]);
            return true;
        case 'uebersetzung_uebersetzungsrichtung':
            newRow['uebersetzungsrichtungValue'] = row[field];
            newRow[field] = t.instant('babsappApp.dolmetscherBuro.uebersetzungsrichtungen.' + row[field]);
            return true;
        case 'platz_kategorie':
            newRow['kategorieValue'] = row[field];
            newRow[field] = t.instant('babsappApp.PlatzKategorie.' + row[field]);
            return true;
        case 'platz_status':
            newRow['statusValue'] = row[field];
            newRow[field] = t.instant('babsappApp.PlatzStatus.' + row[field]);
            return true;
        case 'wechsel_art':
            newRow[field] = t.instant('babsappApp.personenprofilWechsel.wechselArt.' + getFieldValue(row, field));
            newRow['showWartezeitInfo'] = row['showWartezeitInfo'];
            return true;
        case 'regel_aktiv':
            newRow['aktivValue'] = row[field];
            newRow[field] = t.instant('babsappApp.regel.aktiviertNeu.' + row[field]);
            return true;
        case 'wiedervorlagen_grund':
            newRow[field] = t.instant('babsappApp.wiedervorlage.reason.' + row[field]);
            return true;
        case 'wiedervorlagen_modus':
            newRow[field] = t.instant('babsappApp.wiedervorlage.wvView.modus.' + row[field]);
            return true;
        case 'wiedervorlagen_stand':
            newRow[field] = t.instant('babsappApp.wiedervorlage.wvView.stand.' + row[field]);
            return true;
        case 'vorlagen_stand':
            newRow[field] = t.instant('babsappApp.weiterevorlage.wvView.stand.' + row[field]);
            newRow['dolmetscherId'] = row['dolmetscherId'];
            newRow['bueroId'] = row['bueroId'];
            newRow['inhaberId'] = row['inhaberId'];
            return true;
        default:
            return false;
    }
}

function applyListColumns(newRow: NewRow, row: Row, column: Column, ctx: FormatContext): boolean {
    const t = ctx.translate;
    const field = column.field;
    switch (column.type) {
        case 'mitarbeiter_rollen': {
            const rollen = row[field] as { rolle: string }[];
            newRow[field] = rollen.map((rolle) => t.instant('babsappApp.mitarbeiter.roles.' + rolle.rolle));
            return true;
        }
        case 'news_rollen': {
            const rollen = row[field] as any[];
            newRow[field] = rollen.map((rolle) => t.instant('babsappApp.news.roles.' + rolle));
            newRow['anleser'] = row['anleser'];
            newRow['text'] = row['text'];
            newRow['rollenValue'] = rollen;
            return true;
        }
        case 'faq_kategorie': {
            const faqKat = row['faqKategories'] as any[];
            newRow['faqKategoriesValue'] = faqKat.map((kategorie) => t.instant('babsappApp.fAQ.faqKategorien.' + kategorie.kategorie));
            newRow['faqKategories'] = faqKat;
            return true;
        }
        case 'faq_zielgruppe': {
            const faqZiel = row['faqZielgruppes'] as any[];
            newRow['faqZielgruppesValue'] = faqZiel.map((zielgruppe) => t.instant('babsappApp.fAQ.faqZielgruppen.' + zielgruppe['zielgruppenTyp']));
            newRow['faqZielgruppes'] = faqZiel;
            return true;
        }
        case 'dms_vorlagenart': {
            const vorlagenart = row[field] as string[];
            newRow[field] = vorlagenart.map((art) => t.instant('babsappApp.dms.maps.vorlagenarten.' + art));
            return true;
        }
        case 'dms_variante': {
            const varianten = row[field] as string[];
            newRow[field] = varianten.map((variante) => t.instant('babsappApp.dms.maps.variante.' + variante));
            return true;
        }
        case 'vorlagen_gruende': {
            const gruende = row[field] as string[];
            newRow[field] = gruende.map((grund) => t.instant('babsappApp.vorlagen.grund.' + grund));
            return true;
        }
        default:
            return false;
    }
}

function applyCompositeColumns(newRow: NewRow, row: Row, column: Column): boolean {
    const field = column.field;
    switch (column.type) {
        case 'orgEinheit':
            newRow[field] = row['organisationsEinheitReferat'] + ' - ' + row['organisationsEinheitName'];
            newRow['organisationsEinheitId'] = row['organisationsEinheitId'];
            return true;
        case 'einsatzort':
            newRow[field] = row['einsatzortName'] + ' - ' + row['einsatzortNameErg'];
            newRow['einsatzortId'] = row['einsatzortId'];
            return true;
        case 'einsatzort_lang':
            newRow[field] =
                `${row['einsatzortName']} ${row['einsatzortNameErg']} - ${row['einsatzortStrasse']} ${row['einsatzortHausnummer']} [${row['einsatzortCode']}]`;
            newRow['einsatzortId'] = row['einsatzortId'];
            newRow['einsatzortName'] = row['einsatzortName'];
            newRow['einsatzortNameErg'] = row['einsatzortNameErg'];
            newRow['einsatzortStrasse'] = row['einsatzortStrasse'];
            newRow['einsatzortHausnummer'] = row['einsatzortHausnummer'];
            newRow['einsatzortCode'] = row['einsatzortCode'];
            return true;
        case 'einsatzort_ersteller':
            newRow[field] = row[field];
            newRow['erstelltVonLogin'] = `${row['erstelltVonNachname']}, ${row['erstelltVonVorname']} (${row['erstelltVonLogin']})`;
            newRow['erstelltVonId'] = row['erstelltVonId'];
            newRow['erstelltVonNachname'] = row['erstelltVonNachname'];
            newRow['erstelltVonVorname'] = row['erstelltVonVorname'];
            newRow['erstellDatum'] = row['erstellDatum'];
            return true;
        case 'strasse_hausnummer':
            newRow['strasseValue'] = row['strasse'];
            newRow[field] = `${row['strasse']} ${row['hausnummer']}`;
            return true;
        case 'inhaberBuroFirma':
            newRow[field] = row[field];
            newRow['inhaberBuroId'] = row['inhaberBuroId'];
            return true;
        default:
            return false;
    }
}

function applyPersonColumns(newRow: NewRow, row: Row, column: Column): boolean {
    const field = column.field;
    switch (column.type) {
        case 'faq_mitarbeiter':
            newRow[field] = row[field];
            newRow['mitarbeiterVorname'] = row['mitarbeiterVorname'];
            newRow['mitarbeiterLogin'] = row['mitarbeiterLogin'];
            newRow['mitarbeiterId'] = row['mitarbeiterId'];
            return true;
        case 'erfasser':
            newRow[field] = row[field];
            newRow['erfasserVorname'] = row['erfasserVorname'];
            newRow['erfasserLogin'] = row['erfasserLogin'];
            newRow['erfasserId'] = row['erfasserId'];
            return true;
        case 'aktiv_setzer':
            newRow['aktivSetzer'] = `${row['aktivgesetztVonNachname'].toUpperCase()}, ${row['aktivgesetztVonVorname']} (${row['aktivgesetztVonLogin']})'`;
            return true;
        case 'entwurf_ersteller':
            newRow[field] = row[field];
            newRow['entwurfErsteller'] =
                `${row['entwurfErstelltVonNachname'].toUpperCase()}, ${row['entwurfErstelltVonVorname']} (${row['entwurfErstelltVonLogin']})'`;
            return true;
        case 'notiz_ersteller':
            newRow[field] = row[field];
            newRow['benutzer'] = row['benutzer'];
            newRow['name'] = row['name'];
            newRow['dolmetscherBuroId'] = row['dolmetscherBuroId'];
            newRow['dolmetscherId'] = row['dolmetscherId'];
            return true;
        case 'wv_bemerkung':
            newRow[field] = row[field];
            newRow['dolmetscherBuroId'] = row['dolmetscherBuroId'];
            return true;
        default:
            return false;
    }
}

function applyRegelWert(newRow: NewRow, row: Row, column: Column, ctx: FormatContext): boolean {
    if (column.type !== 'regel_wert') {
        return false;
    }
    const field = column.field;
    if (isBooleanRegel(row)) {
        if (isBitRegel(row)) {
            newRow[field] = ctx.switchValueFormatter.transform(row[field]);
        } else {
            newRow[field] = ctx.booleanFormatter.transform(row[field] === 'true');
        }
    } else if (isDropdownRegel(row)) {
        newRow[field] = ctx.translate.instant('babsappApp.regel.regeln.wartung.' + row[field]);
    } else {
        newRow[field] = row[field];
    }
    newRow['wertValue'] = row[field];
    newRow['schluessel'] = row['schluessel'];
    return true;
}

function applySprache(newRow: NewRow, row: Row, column: Column, ctx: FormatContext): boolean {
    if (column.type !== 'sprache') {
        return false;
    }
    const sprache = row[column.field];
    newRow['sprache'] = sprache;
    newRow['spracheAusgeschrieben'] = ctx.language.transform(ctx.sprache.transform(sprache));
    return true;
}

const COLUMN_GROUPS = [applyTranslatedColumns, applyListColumns, applyCompositeColumns, applyPersonColumns, applyRegelWert, applySprache] as const;

function applyColumn(newRow: NewRow, row: Row, column: Column, ctx: FormatContext): void {
    for (const group of COLUMN_GROUPS) {
        if (group(newRow, row, column, ctx)) {
            return;
        }
    }
    newRow[column.field] = getFieldValue(row, column.field);
}

export function formatRows(rawData: unknown, columns: Column[], ctx: FormatContext): NewRow[] | undefined {
    const rows = rawData as Row[];
    const data: NewRow[] = [];

    if (!Array.isArray(rows)) {
        return undefined;
    }

    rows.forEach((row, rowIndex) => {
        const newRow: NewRow = {};
        columns.forEach((column) => applyColumn(newRow, row, column, ctx));
        newRow['version'] = row['version'];
        newRow['id'] = row['id'];
        data[rowIndex] = newRow;
    });

    return data;
}
