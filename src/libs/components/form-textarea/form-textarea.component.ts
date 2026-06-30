import { Component, computed, inject, input, OnInit } from '@angular/core';
import { FloatLabel } from 'primeng/floatlabel';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';

@Component({
    selector: 'babs-form-textarea',
    imports: [FloatLabel, ReactiveFormsModule, TranslatePipe, Message, Textarea, AsyncPipe, HistoryDialogComponent],
    templateUrl: './form-textarea.component.html',
    styleUrls: ['./form-textarea.component.scss'],
})
export class FormTextareaComponent extends HistoryBase implements OnInit {
    readonly id = input.required<string>();
    readonly label = input.required<string>();
    readonly disabled = input(false);
    readonly required = input(false);
    readonly minLength = input(0);
    readonly maxLength = input(0);
    readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
    readonly showLength = input(false);
    availableLength$?: Observable<number>;

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl {
        return this.formGroup?.get(this.id()) as FormControl;
    }

    ngOnInit() {
        const control = this.formControl;

        if (!control || !this.showLength()) {
            return;
        }

        this.availableLength$ = control.valueChanges.pipe(
            startWith(control.value),
            map((value) => Math.max(0, this.maxLength() - (value?.length ?? 0)))
        );
    }

    getErrorMessage() {
        if (this.formControl.errors?.['required']) return 'entity.validation.required';
        if (this.formControl.errors?.['minlength']) return 'entity.validation.minlength';
        if (this.formControl.errors?.['maxlength']) return 'entity.validation.maxlength';
        return '';
    }
}
