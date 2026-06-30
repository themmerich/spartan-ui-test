import { Component, computed, inject, input, output } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { Button } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-input',
    imports: [FloatLabel, InputText, ReactiveFormsModule, TranslatePipe, Message, InputGroup, InputGroupAddon, Button, RouterModule, HistoryDialogComponent],
    templateUrl: './form-input.component.html',
    styleUrls: ['./form-input.component.scss'],
})
export class FormInputComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly unit = input<string>('');
    readonly link = input<string>('');
    readonly placeholder = input<string>('');
    readonly disabled = input(false);
    readonly required = input(false);
    readonly showUnit = input(false);
    readonly uppercase = input(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly autocomplete = input('off');
    readonly variant = computed(() => (this.disabled() ? 'filled' : 'outlined'));
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly value = input<string>(null);
    readonly blury = output<FocusEvent>();

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    constructor() {
        super();

        if (this.value() && this.formControl) {
            this.formControl.setValue(this.value(), { emitEvent: false });
        }
    }

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl | null {
        return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern'] || this.formControl.errors?.['pattern-name']) return 'entity.validation.pattern-name';
        if (this.formControl.errors?.['uniqueCode']) return 'entity.validation.uniqueCode';
        if (this.formControl.errors?.['ibanInvalid']) return 'entity.validation.germanIBAN';
        if (this.formControl.errors?.['steuernummerInvalid']) return 'entity.validation.germanSteuernummer';
        if (this.formControl.errors?.['pattern-plz']) return 'entity.validation.pattern-plz';
        if (this.formControl.errors?.['pattern-postfach']) return 'entity.validation.pattern-postfach';
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

        this.formControl.setValue(value, { emitEvent: false });
    }
}
