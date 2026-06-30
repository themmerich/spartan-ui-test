import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { Checkbox } from 'primeng/checkbox';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-checkbox',
    imports: [ReactiveFormsModule, TranslatePipe, Message, Checkbox],
    templateUrl: './form-checkbox.component.html',
    styleUrls: ['./form-checkbox.component.scss'],
})
export class FormCheckboxComponent extends HistoryBase {
    readonly id = input.required<string>();
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly binary = input(true);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl | null {
        return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
    }

    constructor() {
        super();
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        return '';
    }
}
