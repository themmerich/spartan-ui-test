import { Component, computed, inject, input, output } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { InputNumber } from 'primeng/inputnumber';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-number',
    imports: [FloatLabel, ReactiveFormsModule, TranslatePipe, Message, InputNumber, InputGroup, InputGroupAddon, HistoryDialogComponent],
    templateUrl: './form-number.component.html',
    styleUrls: ['./form-number.component.scss'],
})
export class FormNumberComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly unit = input<string>('');
    readonly disabled = input(true);
    readonly required = input(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly min = input(0);
    readonly max = input(0);
    readonly minFractionDigits = input(2);
    readonly maxFractionDigits = input(2);
    readonly suffix = input('');
    readonly autocomplete = input('off');
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly blury = output<Event>();

    readonly name = computed(() => {
        if (!this.id()) {
            return '';
        }
        return `${this.id().charAt(0).toUpperCase()}${this.id().slice(1).toLowerCase()}`;
    });

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
        if (this.formControl.errors?.['between']) return 'entity.validation.inBetweenNew';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlengthNew';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlengthNew';
        if (this.formControl.errors?.['min']) return 'entity.validation.min';
        if (this.formControl.errors?.['max']) return 'entity.validation.max';
        return '';
    }

    onBlur(event: Event) {
        if (!this.blury) {
            return;
        }

        this.blury.emit(event);
    }
}
