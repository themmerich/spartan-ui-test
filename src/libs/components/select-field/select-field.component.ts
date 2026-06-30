import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { FieldErrorComponent } from '@babs/babs-frontend-shared/lib/components/field-error/field-error.component';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/components/help/help.component';

@Component({
    selector: 'babs-select-field',
    templateUrl: './select-field.component.html',
    styleUrls: ['./select-field.component.scss'],
    imports: [ReactiveFormsModule, BabsTranslateDirective, BabsTranslatePipe, FieldErrorComponent, HelpComponent],
})
export class SelectFieldComponent implements OnInit {
    @Input() fieldName: string;

    @Input() id: string;
    @Input() name: string;
    @Input() formGroup!: FormGroup;
    @Input() isRequired: boolean;
    @Input() items: any[];

    @Input() tabindex: number = 0;
    @Input() label: string;
    @Input() labelValues: string;
    @Input() labelStatic: string;
    @Input() labelHelp: string;

    @Input() savedId: number;
    @Input() patternKey: string;

    control: FormControl;

    ngOnInit(): void {
        if (this.fieldName) {
            this.id = 'field_' + this.fieldName;
            this.name = this.fieldName;
            this.label = 'babsappApp.dolmetscher.' + this.fieldName + '.label';
            this.labelValues = 'babsappApp.dolmetscher.' + this.fieldName + '.values.';
            this.labelHelp = 'dolmetscher.field.' + this.fieldName;
            this.labelStatic = this.fieldName.charAt(0).toUpperCase() + this.fieldName.slice(1);
            if (!this.patternKey) {
                this.patternKey = 'pattern-' + this.fieldName;
            }
        }
        this.control = this.formGroup.get(this.fieldName) as FormControl;
    }
}
