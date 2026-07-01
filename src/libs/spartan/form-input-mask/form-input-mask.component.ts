import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideExternalLink } from '@ng-icons/lucide';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'babs-form-input-mask',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIcon,
    TranslatePipe,
    HlmInputGroupImports,
    HlmLabelImports,
    NgxMaskDirective,
  ],
  providers: [provideIcons({ lucideExternalLink }), provideNgxMask()],
  templateUrl: './form-input-mask.component.html',
})
export class FormInputMaskComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly formGruppe = input<FormGroup>();
  readonly unit = input<string>('');
  readonly link = input<string>('');
  readonly placeholder = input<string>('');
  /** Mask in PrimeNG syntax (a = letter, 9 = digit, * = alphanumeric). */
  readonly mask = input<string>('');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly showUnit = input(false);
  readonly uppercase = input(false);
  readonly minLength = input(0);
  readonly maxLength = input(0);
  readonly autocomplete = input('off');
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
  readonly blury = output<FocusEvent>();
  readonly inputChanged = output<void>();

  /** Translate the PrimeNG mask tokens to the ones ngx-mask understands. */
  readonly ngxMask = computed(() =>
    this.mask().replace(/9/g, '0').replace(/a/g, 'S').replace(/\*/g, 'A'),
  );

  /** Uppercases typed characters when `uppercase` is set (e.g. IBAN). */
  readonly inputTransformFn = (value: unknown): string | number =>
    this.uppercase() ? String(value).toUpperCase() : (value as string | number);

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
    if (errors['pattern']) return 'entity.validation.pattern-name';
    if (errors['uniqueCode']) return 'entity.validation.uniqueCode';
    if (errors['ibanInvalid']) return 'entity.validation.germanIBAN';
    if (errors['steuernummerInvalid']) return 'entity.validation.germanSteuernummer';
    return '';
  }

  onBlur(event: FocusEvent): void {
    this.blury.emit(event);
  }

  handleInput(): void {
    this.inputChanged.emit();
  }
}
