import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    NgbPagination,
    NgbPaginationFirst,
    NgbPaginationLast,
    NgbPaginationNext,
    NgbPaginationNumber,
    NgbPaginationPrevious,
} from '@ng-bootstrap/ng-bootstrap';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';

/**
 * Die komponente TablePaginatorComponent baut einen ngb-pagination Paginator
 * siehe insbesondere hier: https://ng-bootstrap.github.io/#/components/pagination/overview
 */
@Component({
    selector: 'babs-table-paginator',
    templateUrl: './table-paginator.component.html',
    styleUrls: ['../../table/table.components.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbPagination, NgbPaginationNumber, NgbPaginationFirst, NgbPaginationPrevious, NgbPaginationNext, NgbPaginationLast, BabsTranslatePipe],
})
export class TablePaginatorComponent implements OnInit {
    /**
     * enthält die Gesamtanzahl aller im BE vorhandenen Daten (nach Filterung)
     */
    @Input() totalItems = 0;

    /**
     * zeigt, ob etwas im übergeordneten searchCriteria bzw. in der Suche steht
     */
    @Input() isFiltered = false;

    /**
     * die aktuell angezeigte Page; Basis ist 0 (= die erste Seite)
     */
    @Input() page = 0;
    // @Input() collectionSize: number;

    /**
     * Anzahl der jeweils vom BE zu liefernden Datensätze; in aller Regel ITEMS_PER_PAGE aber nicht immer ;-)_
     */
    @Input() pageSize = 0;

    /**
     * wird ausgelöst durch den Klick auf eine Seitenzahl, bzw.
     * ersteSeite, vorherigeSeite, nächsteSeite, letzteSeite im Paginator
     */
    @Output() clickEvent = new EventEmitter<number>();

    /**
     * stösst das initiale Laden der Datensätze in den Elternkomponenten an.
     */
    ngOnInit(): void {
        this.callLoadPageOnParent(this.page);
    }

    /**
     * Stellt Pages im HTML 2-stellig dar, um unschöne Sprünge zu vermeiden.
     * @param page die vom HTML übergebene page; Basis ist 1
     */
    padPagination(page: number): string {
        return page < 10 ? '0' + page.toString() : page.toString();
    }

    /**
     * stösst das Laden der Datensätze in den Elternkomponenten an.
     * ACHTUNG: Die Basis der ngb-pagination Komponente ist 1, unser
     * BE erwartet hier eine Zahl mit Basis 0
     * @param page die Seite, die die Elternkomponente laden soll.
     */
    callLoadPageOnParent(page: number): void {
        this.clickEvent.emit(Math.max(page - 1, 0));
    }
}
