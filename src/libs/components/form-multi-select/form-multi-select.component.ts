import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { Message } from 'primeng/message';
import { TranslatePipe } from '@ngx-translate/core';
import { MultiSelect, MultiSelectChangeEvent } from 'primeng/multiselect';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-multi-select',
    imports: [ReactiveFormsModule, FloatLabel, Message, TranslatePipe, MultiSelect, HistoryDialogComponent],
    templateUrl: './form-multi-select.component.html',
    styleUrls: ['./form-multi-select.component.scss'],
})
export class FormMultiSelectComponent extends HistoryBase {
    readonly label = input.required<string>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly options = input.required<any>();
    readonly optionLabel = input<string>('label');
    readonly optionValue = input<string>('value');
    readonly help = input<string | null>(null);
    readonly dataKey = input<string>();
    readonly showFilter = input<boolean>(false);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly group = input<boolean>(false);
    readonly maxSelectedLabels = input<number>(5);
    readonly filter = input<boolean>(false);
    readonly filterBy = input<string>('label');
    readonly filterFunction = input<(event: any) => any[]>();
    readonly showToggleAll = input<boolean>(false);
    readonly showClear = input<boolean>(false);
    readonly selectionLimit = input<number | null>(null);
    readonly selectionChange = output<string[]>();

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

    onChange(event: MultiSelectChangeEvent) {
        this.selectionChange.emit(event.value as string[]);
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-name';
        return '';
    }
}
