import { catchError, map } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { Component, computed, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from '@babs/babs-frontend-shared/lib/auth/account.service';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { DolmetscherBuero } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/dolmetscher-buero';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormInputMaskComponent } from '@components/form-input-mask/form-input-mask.component';
import { Button } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { IbanService } from '@components/form-iban/data/iban.service';
import { Iban } from '@components/form-iban/model/iban';
import { Personenprofil } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/personenprofil';

@Component({
    selector: 'babs-form-iban',
    templateUrl: './form-iban.component.html',
    styleUrls: ['./form-iban.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, BabsTranslateDirective, FormInputMaskComponent, Button, TranslatePipe],
})
export class FormIbanComponent {
    readonly ibanService = inject(IbanService);
    readonly accountService = inject(AccountService);
    readonly destroyRef = inject(DestroyRef);

    readonly formGruppe = input<FormGroup>();

    readonly required = input(false);
    readonly isLesendeRolle = input(false);
    readonly dolmetscherBuero = input<DolmetscherBuero>();
    readonly personenProfil = input<Personenprofil>();
    readonly isBuero = input<boolean>(true);
    readonly isIbanRequired = input<boolean>(true);

    readonly editIban = output<boolean>();
    readonly updateVersion = output<number>();
    readonly reload = output<void>();

    readonly ibanInputMask = 'aa99 9999 9999 9999 9999 99';

    readonly ibanControl = computed(() => this.formGruppe()?.get('iban') as FormControl | null);
    readonly ibanZurFreigabeControl = computed(() => this.formGruppe()?.get('ibanZurFreigabe') as FormControl | null);

    readonly ibanFreigegeben = signal<string>(null);
    readonly ibanZurFreigabe = signal<string>(null);
    readonly ibanBearbeiter = signal<string>(null);
    readonly currentUser = signal<string>(null);
    readonly currentId = signal<number>(null);
    readonly ibanZurFreigabeDisabled = signal(false);
    readonly isIbanEdited = signal(false);
    readonly showIbanZurFreigabeEditButtons = signal(false);

    /**
     * Lifecycle hook that initializes the component. Loads initial IBANs and user data.
     */
    constructor() {
        effect(() => {
            if (this.isBuero()) {
                this.ibanService.setSelectedEntityIban(this.dolmetscherBuero(), 'dolmetscherbuero');
                this.currentId.set(this.dolmetscherBuero()?.id);
                this.ibanFreigegeben.set(this.dolmetscherBuero()?.zahlungsdaten?.iban);
            } else {
                this.ibanService.setSelectedEntityIban(this.personenProfil(), 'personenprofil');
                this.currentId.set(this.personenProfil()?.id);
                this.ibanFreigegeben.set(this.personenProfil()?.zahlungsdaten?.iban);
            }
            this.loadIbanZurFreigabe();
            this.loadCurrentUser();
        });
    }

    /**
     * Handles the input change event on the IBAN field and emits the editing state.
     */
    onInputChange() {
        if (this.dolmetscherBuero()?.id || this.personenProfil()?.id) {
            this.changeEditedStatus(true);
        }
    }

    /**
     * Loads the IBAN awaiting approval along with its associated details from the service.
     */
    loadIbanZurFreigabe() {
        if (!this.currentId()) {
            return;
        }

        this.ibanService
            .getIbanZurFreigabe(this.currentId())
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (ibanData) => {
                    this.ibanZurFreigabe.set(ibanData.ibanZurFreigabe);
                    this.ibanBearbeiter.set(ibanData.ibanBearbeiter);
                    this.ibanZurFreigabeDisabled.set(true);
                },
                error: (err) => {
                    console.log('Fehler beim laden der IBAN', err);
                },
            });
    }

    /**
     * Reverts the current IBAN field to the last approved value and resets its state.
     */
    revertIban(): void {
        this.ibanControl()?.setValue(this.ibanFreigegeben());
        this.ibanControl()?.markAsUntouched();
        this.ibanControl()?.markAsPristine();
        this.changeEditedStatus(false);
    }

    /**
     * Reverts the IBAN awaiting approval to its original value and disables editing.
     */
    revertIbanZurFreigabe(): void {
        this.ibanZurFreigabeControl()?.setValue(this.ibanZurFreigabe);
        this.ibanZurFreigabeControl()?.markAsUntouched();
        this.ibanZurFreigabeControl()?.markAsPristine();
        this.ibanZurFreigabeDisabled.set(true);
        this.showIbanZurFreigabeEditButtons.set(false);
        this.changeEditedStatus(false);
    }

    /**
     * Saves the updated IBAN waiting for approval to the server and updates the local state.
     */
    saveIbanZurFreigabe(): void {
        this.storeIbanZurFreigabe(this.ibanControl()?.value);
    }

    /**
     * Saves the updated IBAN waiting for approval to the server and updates the local state.
     */
    updateIbanZurFreigabe(): void {
        this.storeIbanZurFreigabe(this.ibanZurFreigabeControl()?.value);
    }

    /**
     * Checks if there is an IBAN awaiting approval for display purposes.
     */
    showIbanZurFreigabe(): boolean {
        return !!this.ibanZurFreigabe();
    }

    /**
     * Enables editing of the IBAN awaiting approval and displays the associated buttons.
     */
    editIbanZurFreigabe(): void {
        this.ibanZurFreigabeDisabled.set(false);
        this.showIbanZurFreigabeEditButtons.set(true);
        this.changeEditedStatus(true);
    }

    /**
     * Marks the IBAN awaiting approval as officially approved and updates the state.
     */
    ibanFreigeben(): void {
        if (this.currentId()) {
            return;
        }

        this.ibanService
            .freigabeIban({
                id: this.currentId(),
                ibanZurFreigabe: this.ibanZurFreigabeControl()?.value.replaceAll(' ', ''),
            } as Iban)
            .pipe(
                catchError(() => EMPTY),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((updatedData) => {
                this.ibanZurFreigabe.set(null);
                this.ibanBearbeiter.set(null);
                this.ibanFreigegeben.set(updatedData.iban);
                this.ibanZurFreigabeControl()?.markAsUntouched();
                this.ibanZurFreigabeControl()?.markAsPristine();
                this.ibanZurFreigabeDisabled.set(true);
                this.ibanZurFreigabeControl()?.setValue(this.ibanZurFreigabe());
                this.ibanControl()?.setValue(updatedData.iban);
                this.showIbanZurFreigabeEditButtons.set(false);
                this.changeEditedStatus(false);
            });
    }

    /**
     * Determines if the IBAN approval action should be disabled based on the user.
     * @returns `true` if the logged-in user is the same as the IBAN editor, otherwise `false`.
     */
    disableFreigabe(): boolean {
        return !this.ibanBearbeiter() || this.ibanBearbeiter() === this.currentUser();
    }

    /**
     * Loads the currently logged-in user's account information from the service.
     */
    loadCurrentUser(): void {
        this.accountService
            .get()
            .pipe(
                map((response) => response.body),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((value) => this.currentUser.set(value.login));
    }

    /**
     * Sends an IBAN for approval by updating the corresponding data model using the DolmetscherBuroService.
     *
     * @param ibanValue.
     */
    private storeIbanZurFreigabe(ibanValue: string) {
        if (!this.currentId()) {
            return;
        }

        this.ibanService
            .updateIbanZurFreigabe({
                id: this.currentId(),
                ibanZurFreigabe: ibanValue.replaceAll(' ', ''),
            } as Iban)
            .pipe(
                catchError(() => EMPTY),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((updatedData) => {
                this.ibanZurFreigabe.set(updatedData.ibanZurFreigabe);
                this.ibanBearbeiter.set(updatedData.ibanBearbeiter);
                this.ibanControl()?.setValue(updatedData.iban);
                this.ibanZurFreigabeControl()?.setValue(updatedData.ibanZurFreigabe);
                this.ibanControl()?.markAsUntouched();
                this.ibanControl()?.markAsPristine();
                this.ibanZurFreigabeDisabled.set(true);
                this.showIbanZurFreigabeEditButtons.set(false);
                this.changeEditedStatus(false);
            });
    }

    /**
     * Kümmert sich um die Änderung des Geändert Status vom IBAN Feld
     * @param value - true wenn die IBAN als geändert angesehen wird, sonst false
     * @private
     */
    private changeEditedStatus(value: boolean) {
        this.isIbanEdited.set(value);
        this.editIban.emit(value);
    }
}
