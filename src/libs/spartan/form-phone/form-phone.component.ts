import { Component, computed, inject, input } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'babs-form-phone',
  imports: [ReactiveFormsModule, TranslatePipe, HlmInputImports, HlmLabelImports],
  templateUrl: './form-phone.component.html',
})
export class FormPhoneComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly required = input(false);
  readonly autocomplete = input('off');
  readonly minLength = input(0);
  readonly maxLength = input(0);
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));

  private readonly controlContainer = inject(ControlContainer, { optional: true });

  get formGroup(): FormGroup {
    return this.controlContainer?.control as FormGroup;
  }

  get formControl(): FormControl | null {
    return (this.formGroup?.get(this.id()) ?? null) as FormControl | null;
  }

  getErrorMessage(): string {
    const errors = this.formControl?.errors;
    if (!errors) return '';
    if (errors['required']) return 'entity.validation.required';
    if (errors['minlength']) return 'entity.validation.minlength';
    if (errors['maxlength']) return 'entity.validation.maxlength';
    if (errors['pattern']) return 'entity.validation.pattern-phone-new';
    return '';
  }
}
