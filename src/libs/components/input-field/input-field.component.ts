import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExtFormControlNameDirective } from '../../directives/formcontrolname-ext.directive';
import { NgxMaskDirective } from 'ngx-mask';

import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { FieldErrorComponent } from '@babs/babs-frontend-shared/lib/components/field-error/field-error.component';
import { HelpComponent } from '@babs/babs-frontend-shared/lib/components/help/help.component';

@Component({
    selector: 'babs-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss'],
    imports: [ReactiveFormsModule, ExtFormControlNameDirective, NgxMaskDirective, FieldErrorComponent, HelpComponent, BabsTranslateDirective],
})
export class InputFieldComponent implements OnInit {
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

    @Input() showInfo: boolean = false;
    @Input() infoText: string = 'Hinweis: Da Sie aktuell keine Telefonnummer...';
    @Input() hidden: boolean = true;
    @Input() infoMsg: string = 'babsappApp.dolmetscher.telefon1NichtHinterlegt';

    @Input() savedId: number;
    @Input() patternKey: string;
    @Input() exactLength: number;
    @Input() customErrors: string[] = [];

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

    onInput(event) {
        this.hidden = event.target.value.length > 0;
    }
}
