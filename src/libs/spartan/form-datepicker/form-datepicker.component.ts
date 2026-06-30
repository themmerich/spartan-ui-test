import { Component, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'babs-form-datepicker',
  imports: [ReactiveFormsModule, TranslatePipe, HlmDatePickerImports, HlmLabelImports],
  templateUrl: './form-datepicker.component.html',
})
export class FormDatepickerComponent {
  readonly translateService = inject(TranslateService);
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly formGruppe = input<FormGroup>();
  readonly dataType = input<string>('date');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly minDate = input<Date | null>(null);
  readonly maxDate = input<Date | null>(null);
  // Kept for API compatibility with the PrimeNG component but not wired:
  // the helm date-picker/calendar does not offer these out of the box.
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

  /** German day-level display for the trigger (dd.MM.yyyy). */
  readonly formatDate = (date: Date): string =>
    `${this.pad(date.getDate())}.${this.pad(date.getMonth() + 1)}.${date.getFullYear()}`;

  selectDate(date: Date): void {
    this.currentChange.emit(date);
  }

  getErrorMessage(): string {
    const errors = this.formControl?.errors;
    if (!errors) return '';

    if (errors['minDate'] && errors['maxDate']) {
      return this.translateService.instant('entity.validation.requiredBetweenPrefix', {
        pattern: 'DD.MM.JJJJ HH:MM',
        minDatum: this.formatDateTime(errors['minDate']),
        maxDatum: this.formatDateTime(errors['maxDate']),
      });
    }

    if (errors['required']) {
      if (this.minDate()) {
        return this.translateService.instant('entity.validation.requiredPatternBeforePrefix', {
          pattern: 'DD.MM.JJJJ HH:MM',
          datum: this.formatDateTime(this.minDate()!),
        });
      }
      if (this.maxDate()) {
        return this.translateService.instant('entity.validation.requiredPatternAfterPrefix', {
          pattern: 'DD.MM.JJJJ HH:MM',
          datum: this.formatDateTime(this.maxDate()!),
        });
      }
      return this.translateService.instant('entity.validation.requiredPattern', {
        pattern: 'DD.MM.JJJJ HH:MM',
      });
    }

    if (errors['dateRangeInvalid']) {
      return this.translateService.instant('entity.validation.requiredBeforeStart');
    }

    return '';
  }

  private formatDateTime(date: Date): string {
    return `${this.pad(date.getDate())}.${this.pad(date.getMonth() + 1)}.${date.getFullYear()} ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`;
  }

  private pad(value: number): string {
    return `${value}`.padStart(2, '0');
  }
}
