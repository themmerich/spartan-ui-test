import { Component, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Message } from 'primeng/message';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { DateTime } from 'luxon';
import { HistoryBase } from '@components/history-dialog/history-base/history-base.component';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';

@Component({
    selector: 'babs-form-datepicker',
    imports: [ReactiveFormsModule, TranslatePipe, Message, DatePicker, FloatLabel, HistoryDialogComponent],
    templateUrl: './form-datepicker.component.html',
    styleUrls: ['./form-datepicker.component.scss'],
})
export class FormDatepickerComponent extends HistoryBase {
    readonly translateService = inject(TranslateService);
    readonly id = input.required<string>();
    readonly label = input.required<string>();
    readonly formGruppe = input<FormGroup>();
    readonly dataType = input<string>('date');
    readonly disabled = input(false);
    readonly required = input(false);
    readonly minDate = input<Date | null>(null);
    readonly maxDate = input<Date | null>(null);
    readonly showClear = input(true);
    readonly showIcon = input(true);
    readonly showTime = input(false);
    readonly showWeek = input(true);
    readonly appendTo = input<string | null>(null);
    readonly baseZIndex = input<number | null>(null);
    readonly currentChange = output<Date>();

    private readonly controlContainer = inject(ControlContainer, { optional: true });

    get formGroup(): FormGroup {
        return this.controlContainer?.control as FormGroup;
    }

    get formControl(): FormControl | null {
        return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
    }

    selectDate(date: Date) {
        this.currentChange.emit(date);
    }

    blurDate() {
        const value = this.formControl.value;
        this.currentChange.emit(value);
    }

    getErrorMessage() {
        if (this.formControl.errors?.['minDate'] && this.formControl.errors?.['maxDate']) {
            const minDatum = DateTime.fromJSDate(this.formControl.errors?.['minDate']).toFormat('dd.MM.yyyy HH:mm');
            const maxDatum = DateTime.fromJSDate(this.formControl.errors?.['maxDate']).toFormat('dd.MM.yyyy HH:mm');
            return this.translateService.instant('entity.validation.requiredBetweenPrefix', {
                pattern: 'DD.MM.JJJJ HH:MM',
                minDatum,
                maxDatum,
            });
        }

        if (this.formControl.errors?.['required']) {
            if (this.minDate()) {
                const datum = DateTime.fromJSDate(this.minDate()).toFormat('dd.MM.yyyy HH:mm');
                return this.translateService.instant('entity.validation.requiredPatternBeforePrefix', { pattern: 'DD.MM.JJJJ HH:MM', datum });
            }

            if (this.maxDate()) {
                const datum = DateTime.fromJSDate(this.maxDate()).toFormat('dd.MM.yyyy HH:mm');
                return this.translateService.instant('entity.validation.requiredPatternAfterPrefix', { pattern: 'DD.MM.JJJJ HH:MM', datum });
            }
            return this.translateService.instant('entity.validation.requiredPattern', { pattern: 'DD.MM.JJJJ HH:MM' });
        }

        if (this.formControl.errors?.['dateRangeInvalid']) {
            return this.translateService.instant('entity.validation.requiredBeforeStart');
        }

        return '';
    }
}
