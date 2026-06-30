import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddressSearchComponent } from '../address-search/address-search.component';
import { NgxMaskDirective } from 'ngx-mask';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { FieldErrorComponent } from '@babs/babs-frontend-shared/lib/components/field-error/field-error.component';
import { AutofocusDirective } from '@babs/babs-frontend-shared/lib/autofocus/autofocus.directive';
import { ExtFormControlNameDirective } from '@babs/babs-frontend-shared/lib/directives/formcontrolname-ext.directive';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/components/help/help.component';

@Component({
    selector: 'babs-address-autocomplete',
    templateUrl: './address-autocomplete.component.html',
    styleUrls: ['./address-autocomplete.component.scss'],
    imports: [
        ReactiveFormsModule,
        NgxMaskDirective,
        BabsTranslateDirective,
        BabsTranslatePipe,
        FieldErrorComponent,
        AutofocusDirective,
        ExtFormControlNameDirective,
        HelpComponent,
    ],
})
export class AddressAutocompleteComponent implements OnInit {
    @Input() fieldName: string;

    @Input() id: string;
    @Input() name: string;
    @Input() formGroup!: FormGroup;
    @Input() placeholder: string = '';
    @Input() type: string = 'text';
    @Input() autocomplete: string = 'off';
    @Input() maxLength: number = 255;
    @Input() minLength: number = 0;
    @Input() mask: string = '';

    @Input() tabindex: number = 0;
    @Input() label: string;
    @Input() labelStatic: string;
    @Input() labelHelp: string;

    @Input() savedId: number;
    @Input() patternKey: string;
    @Input() exactLength: number;
    @Input() customErrors: string[] = [];

    control: FormControl;

    private modalService = inject(NgbModal);

    ngOnInit() {
        if (this.fieldName) {
            this.id = 'field_' + this.fieldName;
            this.name = this.fieldName;
            this.label = 'babsappApp.dolmetscher.' + this.fieldName;
            this.labelHelp = 'dolmetscher.field.' + this.fieldName;
            this.labelStatic = this.fieldName.charAt(0).toUpperCase() + this.fieldName.slice(1);
            if (!this.patternKey) {
                this.patternKey = 'pattern-' + this.fieldName;
            }
        }
        this.control = this.formGroup.get(this.fieldName) as FormControl;
    }

    openAddressSearch() {
        const modalRef = this.modalService.open(AddressSearchComponent, { size: 'md', backdrop: 'static' });

        modalRef.result.then(
            (data: { street: string; number: string; zip: string; city: string }) => {
                this.formGroup.controls.strasse.setValue(data.street);
                this.formGroup.controls.strasse.markAsDirty();
                this.formGroup.controls.hausnummer.setValue(data.number);
                this.formGroup.controls.hausnummer.markAsDirty();
                this.formGroup.controls.plz.setValue(data.zip);
                this.formGroup.controls.plz.markAsDirty();
                this.formGroup.controls.ort.setValue(data.city);
                this.formGroup.controls.ort.markAsDirty();
            },
            () => {}
        );
    }
}
