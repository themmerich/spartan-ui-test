import { Component, computed, input, model } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { FieldState, FormValueControl } from '@angular/forms/signals';

@Component({
    selector: 'babs-form-select-signal',
    imports: [FloatLabel, ReactiveFormsModule, TranslatePipe, Message],
    templateUrl: './form-select-signal.component.html',
    styleUrls: ['./form-select-signal.component.scss'],
})
export class FormSelectSignalComponent implements FormValueControl<string> {
    readonly value = model<string>('');
    readonly formObject = input.required<FieldState<any, any>>();
    readonly id = input.required<string>();
    readonly label = input.required<string>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly options = input.required<any>();
    readonly optionLabel = input<string>('name');
    readonly optionValue = input<string>('value');
    readonly showFilter = input<boolean>(false);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));

    getErrorMessage() {
        /*if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        if (this.formControl.errors?.['pattern']) return 'entity.validation.pattern-name';
        if (this.formControl.errors?.['deactivatable']) return 'entity.validation.deactivatable';*/
        return 'some errors...';
    }
}
