import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { NgClass } from '@angular/common';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/help/help.component';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { AddressSearchService, GeoDataResponse } from '@babs/babs-frontend-shared/lib/components/address-search/address-search.service';

@Component({
    selector: 'babs-address-search',
    templateUrl: './address-search.component.html',
    styleUrls: ['./address-search.component.scss'],
    imports: [NgbTypeahead, NgClass, BabsTranslatePipe, HelpComponent, BabsTranslateDirective],
})
export class AddressSearchComponent {
    activeModal = inject(NgbActiveModal);

    modalTitle: string;
    errMsg: string;
    errParams: any;
    okButtonIcon: string;
    okButtonName: string;
    okButtonDisabled: boolean = true;
    street: string;
    number: string;
    zip: string;
    city: string;
    searchFailed = false;
    addressSearchService = inject(AddressSearchService);

    constructor() {
        this.modalTitle = this.modalTitle || 'entity.action.addressSearch';
        this.okButtonIcon = this.okButtonIcon || 'fa-check';
        this.okButtonName = this.okButtonName || 'entity.action.accept';
    }

    formatInput = (x: GeoDataResponse) => x.suggestion;
    formatResult = (x: GeoDataResponse) => x.suggestion;

    search: OperatorFunction<string, readonly GeoDataResponse[]> = (text$: Observable<string>) =>
        text$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap((term) =>
                this.addressSearchService.search(term).pipe(
                    tap(() => (this.searchFailed = false)),
                    catchError(() => {
                        this.searchFailed = true;
                        return of([]);
                    })
                )
            )
        );

    onOptionSelected(event: NgbTypeaheadSelectItemEvent): void {
        this.okButtonDisabled = false;
        this.street = event.item.street;
        this.number = event.item.streetNumber;
        this.zip = event.item.postalCode;
        this.city = event.item.city;
    }
}
