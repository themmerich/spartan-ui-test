import { Component, input, model, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormNumberComponent } from '@components/form-number/form-number.component';
import { Button } from 'primeng/button';
import { FormAddressAutocompleteComponent } from '@components/form-address-autocomplete/form-address-autocomplete.component';

@Component({
    selector: 'babs-form-address',
    imports: [ReactiveFormsModule, FormInputComponent, FormNumberComponent, Button, FormAddressAutocompleteComponent],
    styleUrls: ['./form-address.component.scss'],
    templateUrl: './form-address.component.html',
})
export class FormAddressComponent {
    readonly showGEOFelder = input<boolean>(true);
    readonly showPostfach = input<boolean>(false);
    readonly showBundesland = input<boolean>(false);
    readonly formGruppe = input<FormGroup>();
    readonly isDisabled = input<boolean>(false);
    readonly isDisabledGeo = model<boolean>(true);
    readonly isDisabledBundesland = model<boolean>(true);
    readonly isDisabledPlz = input<boolean>(false);
    readonly isAutofill = input<boolean>(false);
    readonly showActivateGeoBundeslandButtons = signal(false);

    activateGeoBundesland() {
        this.isDisabledGeo.set(false);
        this.isDisabledBundesland.set(false);
    }

    deactivateGeoBundesland() {
        this.isDisabledGeo.set(true);
        this.isDisabledBundesland.set(true);
    }
}