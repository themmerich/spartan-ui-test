import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';

@Component({
  selector: 'babs-form-input',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    TranslatePipe,
    HlmInputGroupImports,
    HlmLabelImports,
  ],
  providers: [provideIcons({ lucideExternalLink })],
  templateUrl: './form-input.component.html',
})
export class FormInputComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly formGruppe = input<FormGroup>();
  readonly unit = input<string>('');
  readonly link = input<string>('');
  readonly placeholder = input<string>('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly showUnit = input(false);
  readonly uppercase = input(false);
  readonly minLength = input(0);
  readonly maxLength = input(0);
  readonly autocomplete = input('off');
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
  readonly value = input<string | null>(null);
  readonly blury = output<FocusEvent>();

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
    if (errors['minlength']) return 'entity.validation.minlength';
    if (errors['maxlength']) return 'entity.validation.maxlength';
    if (errors['pattern'] || errors['pattern-name']) return 'entity.validation.pattern-name';
    if (errors['uniqueCode']) return 'entity.validation.uniqueCode';
    if (errors['ibanInvalid']) return 'entity.validation.germanIBAN';
    if (errors['steuernummerInvalid']) return 'entity.validation.germanSteuernummer';
    if (errors['pattern-plz']) return 'entity.validation.pattern-plz';
    if (errors['pattern-postfach']) return 'entity.validation.pattern-postfach';
    return '';
  }

  onBlur(event: FocusEvent): void {
    this.blury.emit(event);
  }

  handleInput(event: Event): void {
    const target = event.target;

    if (!target || !('value' in target)) {
      return;
    }

    let value = String(target['value']);
    if (this.uppercase()) {
      value = value.toUpperCase();
      target['value'] = value;
    }

    this.formControl?.setValue(value, { emitEvent: false });
  }
}
