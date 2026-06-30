import { TranslateService } from '@ngx-translate/core';
import {
    DokumentKategorie,
    DokumentStatus,
    DokumentVariante,
    DokumentVorlagenart,
} from '../../../../../../apps/babs-frontend-int/src/app/entities/dms/dms.model';
import { faqKategorien, faqZielgruppen } from '../../../../../../apps/babs-frontend-int/src/app/entities/faq/faq.model';
import { WechselArt } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wechsel-art';
import { PlatzStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/platz-status';
import { PlatzKategorie } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/platz-kategorie';
import { RegelStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/regel-status';
import { Rollen } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/rollen';
import { EinsatzortStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/einsatzort-status';
import { DolmetscherStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/dolmetscher-status';
import { TerminTyp } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/termin-typ';
import { RegelKategorie } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/regel-kategorie';
import { NewsStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/news-status';
import { NEWS_ROLES } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/news-roles';
import { Uebersetzungsrichtung } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/externe-sprachen';
import { WiedervorlageGrund } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-grund';
import { WiedervorlageModus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-modus';
import { WiedervorlageStand } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-stand';

export type TableFilterOptions = {
    einsatzortStatusList: string[];
    regelList: string[];
    statusList: string[];
    dmsStatus: string[];
    dmsKategorie: string[];
    dmsVariante: string[];
    dmsArt: string[];
    faqKategorien: string[];
    faqZielgruppen: string[];
    newsStatus: string[];
    newsZielgruppen: string[];
    terminTypList: string[];
    wechselArt: string[];
    platzStatus: string[];
    platzKategorie: string[];
    regelStatus: string[];
    mitarbeiterRollen: string[];
    uebersetzungsRichtung: string[];
    wiedervorlageGrund: string[];
    wiedervorlageModus: string[];
    wiedervorlageStand: string[];
    profilTypen: string[];
};

export function buildFilterOptions(translate: TranslateService): TableFilterOptions {
    const map = (values: string[], prefix: string): string[] => values.map((value) => translate.instant(prefix + value));

    return {
        einsatzortStatusList: map(Object.values(EinsatzortStatus), 'babsappApp.einsatzort.status2.'),
        regelList: map(Object.values(RegelKategorie), 'babsappApp.RegelKategorie.'),
        statusList: map(Object.values(DolmetscherStatus), 'babsappApp.DolmetscherStatus.'),
        dmsStatus: map(Object.values(DokumentStatus), 'babsappApp.dms.maps.status.'),
        dmsKategorie: map(Object.values(DokumentKategorie), 'babsappApp.dms.maps.kategorie.'),
        dmsVariante: map(Object.values(DokumentVariante), 'babsappApp.dms.maps.variante.'),
        dmsArt: map(Object.values(DokumentVorlagenart), 'babsappApp.dms.maps.vorlagenarten.'),
        faqKategorien: map(
            faqKategorien.map((item) => item.key),
            'babsappApp.fAQ.faqKategorien.'
        ),
        faqZielgruppen: map(Object.values(faqZielgruppen), 'babsappApp.fAQ.faqZielgruppen.'),
        newsStatus: map(Object.values(NewsStatus), 'babsappApp.news.status.'),
        newsZielgruppen: map(
            NEWS_ROLES.map((item) => item.key),
            'babsappApp.news.roles.'
        ),
        terminTypList: map(Object.values(TerminTyp), 'babsappApp.TerminTyp.'),
        wechselArt: map(Object.values(WechselArt), 'babsappApp.personenprofilWechsel.wechselArt.'),
        platzStatus: map(Object.values(PlatzStatus), 'babsappApp.PlatzStatus.'),
        platzKategorie: map(Object.values(PlatzKategorie), 'babsappApp.PlatzKategorie.'),
        regelStatus: map(Object.values(RegelStatus), 'babsappApp.regel.aktiviertNeu.'),
        mitarbeiterRollen: map(Object.values(Rollen), 'babsappApp.mitarbeiter.roles.'),
        uebersetzungsRichtung: map(Object.values(Uebersetzungsrichtung), 'babsappApp.dolmetscherBuro.uebersetzungsrichtungen.'),
        wiedervorlageGrund: map(Object.values(WiedervorlageGrund), 'babsappApp.wiedervorlage.reason.'),
        wiedervorlageModus: map(Object.values(WiedervorlageModus), 'babsappApp.wiedervorlage.wvView.modus.'),
        wiedervorlageStand: map(Object.values(WiedervorlageStand), 'babsappApp.wiedervorlage.wvView.stand.'),
        profilTypen: map(['PP', 'BI', 'ED', 'BD'], 'babsappApp.ProfilTyp.'),
    };
}
