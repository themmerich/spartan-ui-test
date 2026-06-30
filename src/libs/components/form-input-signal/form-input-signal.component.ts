import { Component, computed, input, model, output } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { FieldState, FormValueControl } from '@angular/forms/signals';
import { Message } from 'primeng/message';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-input-signal',
    imports: [FloatLabel, InputText, ReactiveFormsModule, TranslatePipe, InputGroup, InputGroupAddon, Button, RouterModule, Message],
    templateUrl: './form-input-signal.component.html',
    styleUrls: ['./form-input-signal.component.scss'],
})
export class FormInputSignalComponent extends HistoryBase implements FormValueControl<string> {
    readonly value = model<string>('');
    readonly formObject = input.required<FieldState<any, any>>();
    readonly label = input.required<string>();
    readonly unit = input<string>('');
    readonly link = input<string>('');
    readonly disabled = input(false);
    readonly required = input(false);
    readonly showUnit = input(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly autocomplete = input('off');
    readonly variant = computed(() => (this.disabled() ? 'filled' : 'outlined'));
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly blury = output<FocusEvent>();

    constructor() {
        super();
    }

    getErrorMessage() {
        /*if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-name';
        if (this.formControl.errors?.['uniqueCode']) return 'entity.validation.uniqueCode';*/
        return 'some Errors...';
    }

    onBlur(event: FocusEvent) {
        if (!this.blury) {
            return;
        }

        this.blury.emit(event);
    }
}
