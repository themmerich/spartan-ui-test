import { Component, computed, inject, input } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';

@Component({
    selector: 'babs-form-phone',
    imports: [FloatLabel, InputText, ReactiveFormsModule, TranslatePipe, Message, HistoryDialogComponent],
    templateUrl: './form-phone.component.html',
    styleUrls: ['./form-phone.component.scss'],
})
export class FormPhoneComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly autocomplete = input('off');
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl {
        return this.formGroup?.get(this.id()) as FormControl;
    }

    constructor() {
        super();
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-phone-new';
        return '';
    }
}
