import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of, Subject, switchMap } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AutoComplete } from 'primeng/autocomplete';
import { FloatLabel } from 'primeng/floatlabel';
import { InputGroup } from 'primeng/inputgroup';
import { TranslatePipe } from '@ngx-translate/core';
import { AdresseSucheService } from '@components/form-address/data/addresse-suche.service';
import { GeoDataResponse } from '@components/form-address/model/geo-data-response';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-address-autocomplete',
    imports: [ReactiveFormsModule, AutoComplete, FloatLabel, InputGroup, TranslatePipe, HistoryDialogComponent],
    templateUrl: './form-address-autocomplete.component.html',
})
export class FormAddressAutocompleteComponent extends HistoryBase {
    private readonly adresseSucheService = inject(AdresseSucheService);
    private readonly destroyRef = inject(DestroyRef);

    readonly formGruppe = input<FormGroup>();
    readonly isDisabled = input<boolean>(false);
    readonly isAutofill = input<boolean>(false);
    readonly required = input(false);

    readonly suchStream = new Subject<string>();
    readonly vorschlaege = signal<GeoDataResponse[]>([]);
    readonly showActivateGeoBundeslandButtons = signal(false);

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl | null {
        return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
    }

    constructor() {
        super();

        this.suchStream
            .pipe(
                map((text) => (text ?? '').trim()),
                filter((text) => text.length >= 3),
                distinctUntilChanged(),
                switchMap((text) => this.adresseSucheService.search(text).pipe(catchError(() => of([] as GeoDataResponse[])))),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (ergebnisse: GeoDataResponse[]) => this.vorschlaege.set(ergebnisse),
                error: () => this.showActivateGeoBundeslandButtons.set(true),
            });
    }

    onSuche(event: { query: string }) {
        this.suchStream.next(event.query);
    }

    onAuswahl(event: { value: GeoDataResponse }) {
        const vorschlag = event.value;
        if (!vorschlag) {
            return;
        }

        if ((vorschlag.street && vorschlag.street.length > 0) || (vorschlag.city && vorschlag.city.length > 0)) {
            const hausnummer = this.formGruppe().get('hausnummer')?.value;
            const postleitzahl = this.formGruppe().get('plz')?.value;

            this.formGruppe().patchValue({
                strasse: vorschlag.street,
                hausnummer: hausnummer ?? vorschlag.streetNumber,
                ort: vorschlag.city,
                plz: postleitzahl ?? vorschlag.postalCode,
            });
            return;
        }

        this.vorschlaege.set([]);
    }
}
