import { Component, computed, inject, input, output } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputMask } from 'primeng/inputmask';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';

@Component({
    selector: 'babs-form-input-mask',
    imports: [FloatLabel, ReactiveFormsModule, TranslatePipe, Message, InputGroup, InputGroupAddon, Button, RouterModule, InputMask, HistoryDialogComponent],
    templateUrl: './form-input-mask.component.html',
    styleUrls: ['./form-input-mask.component.scss'],
})
export class FormInputMaskComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly unit = input<string>('');
    readonly link = input<string>('');
    readonly placeholder = input<string>('');
    readonly mask = input<string>('');
    readonly disabled = input(false);
    readonly required = input(false);
    readonly showUnit = input(false);
    readonly uppercase = input(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly autocomplete = input('off');
    readonly variant = computed(() => (this.disabled() ? 'filled' : 'outlined'));
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly blury = output<FocusEvent>();
    readonly inputChanged = output<void>();

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
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-name';
        if (this.formControl.errors?.['uniqueCode']) return 'entity.validation.uniqueCode';
        if (this.formControl.errors?.['ibanInvalid']) return 'entity.validation.germanIBAN';
        if (this.formControl.errors?.['steuernummerInvalid']) return 'entity.validation.germanSteuernummer';
        return '';
    }

    onBlur(event: FocusEvent) {
        if (!this.blury) {
            return;
        }

        this.blury.emit(event);
    }

    handleInput(event: Event) {
        const target = event.target;

        if (!target || !('value' in target)) {
            return;
        }

        let value = String(target['value']);
        if (this.uppercase()) {
            value = value.toUpperCase();
            target['value'] = value;
        }

        this.formControl?.setValue(value);
        this.inputChanged.emit();
    }
}
