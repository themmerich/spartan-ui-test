import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Message } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { Editor } from 'primeng/editor';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-editor',
    imports: [ReactiveFormsModule, Message, TranslatePipe, Editor, HistoryDialogComponent],
    templateUrl: './form-editor.component.html',
    styleUrls: ['./form-editor.component.scss'],
})
export class FormEditorComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly height = input<string>('140px');
    readonly group = input<boolean>(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly placeholder = computed(() => (!this.required() ? this.label() : `${this.label()} *`));
    readonly blury = output<FocusEvent>();

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
        if (this.formControl.errors?.['minLength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxLength']) return 'entity.validation.maxlength';
        return '';
    }

    onBlur(event: FocusEvent) {
        if (!this.blury) {
            return;
        }

        this.blury.emit(event);
    }
}
