import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmCheckboxImports } from '@spartan-ng/helm/checkbox';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'babs-form-checkbox',
  imports: [ReactiveFormsModule, TranslatePipe, HlmCheckboxImports, HlmLabelImports],
  templateUrl: './form-checkbox.component.html',
})
export class FormCheckboxComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly formGruppe = input<FormGroup>();
  readonly disabled = input(false);
  readonly required = input(false);
  // hlm-checkbox is always a binary boolean control, so this is inert;
  // kept only for API compatibility with the PrimeNG component.
  readonly binary = input(true);
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));

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
    return '';
  }
}
