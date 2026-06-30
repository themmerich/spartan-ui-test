import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { FieldErrorComponent } from '@babs/babs-frontend-shared/lib/components/field-error/field-error.component';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/components/help/help.component';

@Component({
    selector: 'babs-geo-select-field',
    templateUrl: './geo-select-field.component.html',
    styleUrls: ['./geo-select-field.component.scss'],
    imports: [ReactiveFormsModule, NgbPopover, NgbTooltip, NgSelectModule, BabsTranslateDirective, BabsTranslatePipe, FieldErrorComponent, HelpComponent],
})
export class GeoSelectFieldComponent implements OnInit {
    @Input() fieldName: string;

    @Input() id: string;
    @Input() name: string;
    @Input() formGroup!: FormGroup;
    @Input() placeholder: string = '';
    @Input() isEditGeo: boolean;
    @Input() isGeoManuellFlag: boolean;
    @Input() formValue: string;
    @Input() items: string[];

    @Input() tabindex: number = 0;
    @Input() label: string;
    @Input() labelStatic: string;
    @Input() labelHelp: string;

    @Input() savedId: number;

    control: FormControl;

    ngOnInit(): void {
        if (this.fieldName) {
            this.id = 'field_' + this.fieldName;
            this.name = this.fieldName;
            this.label = 'babsappApp.dolmetscher.' + this.fieldName;
            this.labelHelp = 'dolmetscher.field.' + this.fieldName;
            this.labelStatic = this.fieldName.charAt(0).toUpperCase() + this.fieldName.slice(1);
        }
        this.control = this.formGroup.get(this.fieldName) as FormControl;
    }
}
