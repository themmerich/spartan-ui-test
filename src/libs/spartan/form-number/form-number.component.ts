import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'babs-form-number',
  imports: [ReactiveFormsModule, TranslatePipe, HlmInputGroupImports, HlmLabelImports],
  templateUrl: './form-number.component.html',
})
export class FormNumberComponent {
  readonly id = input.required<string>();
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

  // Derive the native step from the allowed fraction digits so decimal entry
  // matches the configured precision (e.g. 2 digits -> 0.01). Native number
  // inputs cannot enforce a *minimum* number of fraction digits the way
  // PrimeNG's p-inputNumber did, so minFractionDigits no longer pads display.
  readonly step = computed(() =>
    this.maxFractionDigits() > 0 ? Math.pow(10, -this.maxFractionDigits()) : 1,
  );

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

  getErrorMessage(): string {
    const errors = this.formControl?.errors;
    if (!errors) return '';
    if (errors['required']) return 'entity.validation.required';
    if (errors['between']) return 'entity.validation.inBetweenNew';
    if (errors['minlength']) return 'entity.validation.minlengthNew';
    if (errors['maxlength']) return 'entity.validation.maxlengthNew';
    if (errors['min']) return 'entity.validation.min';
    if (errors['max']) return 'entity.validation.max';
    return '';
  }

  onBlur(event: Event): void {
    this.blury.emit(event);
  }
}
