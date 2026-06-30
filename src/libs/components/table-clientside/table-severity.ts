import { TranslateService } from '@ngx-translate/core';

export type Severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null;

function firstSeverity(translate: TranslateService, value: string, entries: readonly [string, Exclude<Severity, null>][]): Severity {
    for (const [key, severity] of entries) {
        if (value === translate.instant(key)) {
            return severity;
        }
    }
    return null;
}

export function getEinsatzortSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.einsatzort.status2.AKTIVIERT', 'success'],
        ['babsappApp.einsatzort.status2.DEAKTIVIERT', 'danger'],
    ]);
}

export function getDmsSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.dms.maps.status.HISTORISIERT', 'danger'],
        ['babsappApp.dms.maps.status.ENTWURF_ANGELEGT', 'warn'],
        ['babsappApp.dms.maps.status.ZUKUENFTIGE_VERSION_ANGELEGT', 'info'],
        ['babsappApp.dms.maps.status.AKTIV', 'success'],
    ]);
}

export function getTerminSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.TerminTyp.BLOCKER', 'danger'],
        ['babsappApp.TerminTyp.BEDARF', 'info'],
        ['babsappApp.TerminTyp.EINSATZ', 'success'],
    ]);
}

export function getRegelSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.regel.aktiviertNeu.true', 'success'],
        ['babsappApp.regel.aktiviertNeu.false', 'danger'],
    ]);
}

export function getPlatzStatusSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.PlatzStatus.BEREIT', 'success'],
        ['babsappApp.PlatzStatus.IN_WARTUNG', 'danger'],
    ]);
}

export function getVorlagenStandSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.weiterevorlage.wvView.stand.LIEGT_NICHT_VOR', 'danger'],
        ['babsappApp.weiterevorlage.wvView.stand.ERSTE_ERINNERUNG', 'warn'],
        ['babsappApp.weiterevorlage.wvView.stand.ZWEITE_ERINNERUNG', 'warn'],
        ['babsappApp.weiterevorlage.wvView.stand.OFFEN', 'info'],
        ['babsappApp.weiterevorlage.wvView.stand.VERSENDET', 'info'],
        ['babsappApp.weiterevorlage.wvView.stand.ANGEFRAGT', 'info'],
        ['babsappApp.weiterevorlage.wvView.stand.EINGELEITET', 'info'],
        ['babsappApp.weiterevorlage.wvView.stand.LIEGT_VOR', 'success'],
    ]);
}

export function getNewsSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.news.status.GELOESCHT', 'danger'],
        ['babsappApp.news.status.INAKTIV', 'warn'],
        ['babsappApp.news.status.BEVORSTEHEND', 'info'],
        ['babsappApp.news.status.ABGELAUFEN', 'warn'],
        ['babsappApp.news.status.AKTIV', 'success'],
    ]);
}

export function getMitarbeiterSeverity(status: boolean): Severity {
    return status ? 'success' : 'danger';
}

export function getSeverity(translate: TranslateService, status: string): Severity {
    return firstSeverity(translate, status, [
        ['babsappApp.DolmetscherStatus.INAKTIV', 'warn'],
        ['babsappApp.DolmetscherStatus.GELOESCHT', 'contrast'],
        ['babsappApp.DolmetscherStatus.NICHT_EINSETZBAR', 'danger'],
        ['babsappApp.DolmetscherStatus.IN_WIEDERVORLAGE', 'success'],
        ['babsappApp.DolmetscherStatus.UEBERPRUEFT_UND_GEEIGNET', 'info'],
        ['babsappApp.DolmetscherStatus.WIRD_UEBERPRUEFT', 'info'],
        ['babsappApp.DolmetscherStatus.IN_BEWERBUNG', 'info'],
        ['babsappApp.DolmetscherStatus.AKKREDITIERT', 'success'],
    ]);
}
