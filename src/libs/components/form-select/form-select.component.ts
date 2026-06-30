import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { Select, SelectChangeEvent } from 'primeng/select';
import { FormSelectValue } from '@components/form-select/form-select-value';
import { startWith } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-select',
    imports: [FloatLabel, ReactiveFormsModule, TranslatePipe, Message, Select, HistoryDialogComponent],
    templateUrl: './form-select.component.html',
    styleUrls: ['./form-select.component.scss'],
})
export class FormSelectComponent extends HistoryBase implements OnInit {
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly options = input.required<any>();
    readonly optionLabel = input<string>('name');
    readonly optionValue = input<string>('value');
    readonly showClear = input<boolean>(false);
    readonly showFilter = input<boolean>(false);
    readonly group = input<boolean>(false);
    readonly scrollHeight = input<string>('200px');
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly selectedChange = output<FormSelectValue>();
    readonly selectedValue = signal<FormSelectValue>(null);

    private readonly controlContainer = inject(ControlContainer, { optional: true });
    private readonly destroyRef = inject(DestroyRef);

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl | null {
        return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
    }

    ngOnInit() {
        const control = this.formControl;
        if (!control) {
            return;
        }

        this.selectedValue.set(control.value);
        control.valueChanges.pipe(startWith(control.value), takeUntilDestroyed(this.destroyRef)).subscribe((value) => this.selectedValue.set(value));
    }

    change(event: SelectChangeEvent) {
        this.selectedValue.set(event.value);
        this.selectedChange.emit(event.value);
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-name';
        if (this.formControl.errors?.['deactivatable']) return 'entity.validation.deactivatable';
        return '';
    }
}
