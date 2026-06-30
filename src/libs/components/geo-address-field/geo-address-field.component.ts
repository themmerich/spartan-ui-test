import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtFormControlNameDirective } from '../../directives/formcontrolname-ext.directive';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { DecimalPipe } from '@angular/common';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { FieldErrorComponent } from '@babs/babs-frontend-shared/lib/field-errors/field-error.component';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/components/help/help.component';

@Component({
    selector: 'babs-geo-address-field',
    templateUrl: './geo-address-field.component.html',
    styleUrls: ['./geo-address-field.component.scss'],
    imports: [
        ReactiveFormsModule,
        ExtFormControlNameDirective,
        NgbPopover,
        NgbTooltip,
        DecimalPipe,
        BabsTranslateDirective,
        BabsTranslatePipe,
        FieldErrorComponent,
        HelpComponent,
    ],
})
export class GeoAddressFieldComponent implements OnInit {
    @Input() fieldName: string;

    @Input() id: string;
    @Input() name: string;
    @Input() formGroup!: FormGroup;
    @Input() placeholder: string = '';
    @Input() type: string = 'number';
    @Input() autocomplete: string = 'off';
    @Input() step: string = '0.000001';
    @Input() isEditGeo: boolean;
    @Input() isGeoManuellFlag: boolean;
    @Input() formValue: number;

    @Input() tabindex: number = 0;
    @Input() label: string;
    @Input() labelStatic: string;
    @Input() labelHelp: string;

    @Input() savedId: number;
    @Input() patternKey: string = 'pattern-koordinaten';

    control: FormControl;

    ngOnInit(): void {
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
}
