import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';

/**
 * Die Komponente TableCounterComponent baut einen Counter der exemplarisch wie folgt aussieht
 * Seite 1: 1–25 von 94
 */
@Component({
    selector: 'babs-table-counter',
    templateUrl: './table-counter.component.html',
    styleUrls: ['../../table/table.components.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [BabsTranslatePipe],
})
export class TableCounterComponent implements AfterViewChecked, OnDestroy {
    private cdRef = inject(ChangeDetectorRef);
    private translateService = inject(TranslateService);

    /**
     * enthält die Gesamtanzahl aller im BE vorhandenen Daten (nach Filterung)
     */
    @Input() totalItems: any;

    /**
     * zeigt, ob etwas im übergeordneten searchCriteria bzw. in der Suche steht
     */
    @Input() isFiltered = false;

    /**
     * ist zunächst false und wird nach Lieferung durch das BE zu true
     */
    @Input() isLoaded = false;

    /**
     * die aktuell angezeigte Page; Basis ist 0 (= die erste Seite)
     */
    @Input() page = 0;

    /**
     * Anzahl der jeweils vom BE zu liefernden Datensätze; in aller Regel ITEMS_PER_PAGE aber nicht immer ;-)_
     */
    @Input() pageSize = 0;

    /**
     * Optional zusätzliche CSS-Klasse (Bsp: float-end -> Rechtsbündig)
     */
    @Input() class = '';

    /**
     * siehe ngAfterViewChecked()
     */
    fromEntry = 0;

    /**
     * siehe ngAfterViewChecked()
     */
    toEntry = 0;

    /**
     * Inhalt der aria-live Region; wird in ngAfterViewChecked gesetzt;
     * Hintergrund: Hiermit wird verhindert, dass aria-live sonst zu gesprächig wird, wenn man es hier und nicht erst
     * im HTML "zusammenbaut"
     */
    ariaLive = '';

    /**
     * Je nach verwendeter Eltern-Komponente werden dieser Komponente die this.totalItems
     * mal als number unnd mal als string "geliefert", hier wird
     * 1. this.totalItems immer zu einer number umgewandelt, die dann via Bang/Bang (!!) als hasItems (Boolean) verwendet wird.
     * 2. this.fromEntry und this.toEntry wird gesetzt. Die beiden bezeichnen jeweils den ersten bzw. letzten Datensatz
     * ... der in den jeweils gelieferten Datenpaketen aus dem BE geliefert werden und berücksichtigen die Ränder
     * ... (das erste und das letzte Paket)
     * 3. this.cdRef.detectChanges() verhindert potentielle change-detection errors
     */
    ngAfterViewChecked(): void {
        const tItems = this.totalItems ? this.totalItems : '0';
        const hasItems = !!parseInt(this.totalItems, 10);

        this.fromEntry = hasItems ? this.page * this.pageSize + 1 : 0;
        this.toEntry = Math.min(this.fromEntry + this.pageSize - 1, this.totalItems);

        this.translateService
            .get([
                'global.terms.page',
                'global.terms.datensatz',
                'global.terms.bis',
                'global.terms.eins',
                'global.terms.von',
                'global.terms.einem',
                'global.terms.datensaetze',
                'global.terms.suchFilterEnthaeltEintraege',
                'global.terms.loading',
            ])
            .subscribe((translations: any) => {
                let translated =
                    translations['global.terms.page'] +
                    (this.page + 1) +
                    ': ' +
                    translations['global.terms.datensatz'] +
                    this.fromEntry +
                    translations['global.terms.bis'];
                if (this.totalItems === 1) {
                    translated +=
                        translations['global.terms.einem'] +
                        ' ' +
                        translations['global.terms.von'] +
                        ' ' +
                        translations['global.terms.einem'] +
                        ' ' +
                        translations['global.terms.datensaetze'];
                } else {
                    translated += this.toEntry + translations['global.terms.von'] + tItems + ' ' + translations['global.terms.datensaetze'];
                }

                if (this.isFiltered) {
                    translated += translations['global.terms.suchFilterEnthaeltEintraege'];
                }

                if (!this.isLoaded) {
                    translated = translations['global.terms.loading'];
                }

                this.ariaLive = translated;
            });

        this.cdRef.detectChanges();
    }

    /**
     * Räumt die Komponente auf.
     */
    ngOnDestroy() {
        this.cdRef.detach();
    }
}
