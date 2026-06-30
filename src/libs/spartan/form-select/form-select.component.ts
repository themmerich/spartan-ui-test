import { Component, computed, DestroyRef, inject, input, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { startWith } from 'rxjs';
import { FormSelectValue } from './form-select-value';

@Component({
  selector: 'babs-form-select',
  imports: [ReactiveFormsModule, TranslatePipe, HlmLabelImports, HlmSelectImports],
  templateUrl: './form-select.component.html',
})
export class FormSelectComponent implements OnInit {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly formGruppe = input<FormGroup>();
  readonly disabled = input(false);
  readonly required = input(false);
  readonly options = input.required<any[]>();
  readonly optionLabel = input<string>('name');
  readonly optionValue = input<string>('value');
  readonly showClear = input<boolean>(false);
  readonly showFilter = input<boolean>(false);
  readonly group = input<boolean>(false);
  readonly scrollHeight = input<string>('200px');
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
  readonly selectedChange = output<FormSelectValue>();
  readonly selectedValue = signal<FormSelectValue>(null);

  // Map a selected value back to its display label. The dropdown items are
  // rendered lazily inside the overlay, so the trigger cannot derive the label
  // from a rendered item before the panel is first opened — this resolves it
  // straight from the options instead.
  readonly itemToString = computed(() => {
    const labelKey = this.optionLabel();
    const valueKey = this.optionValue();
    const flat: any[] = this.group()
      ? this.options().flatMap((grp) => grp?.items ?? [])
      : this.options();
    return (value: FormSelectValue): string => {
      const match = flat.find((opt) => opt?.[valueKey] === value);
      return match ? String(match[labelKey]) : value == null ? '' : String(value);
    };
  });

  private readonly controlContainer = inject(ControlContainer, { optional: true });
  private readonly destroyRef = inject(DestroyRef);

  get formGroup(): FormGroup {
    return this.controlContainer?.control as FormGroup;
  }

  get formControl(): FormControl | null {
    return (this.formGruppe()?.get(this.id()) ?? this.formGroup?.get(this.id()) ?? null) as FormControl | null;
  }

  ngOnInit(): void {
    const control = this.formControl;
    if (!control) {
      return;
    }

    this.selectedValue.set(control.value);
    control.valueChanges
      .pipe(startWith(control.value), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.selectedValue.set(value));
  }

  change(value: FormSelectValue | undefined): void {
    const normalized = value ?? null;
    this.selectedValue.set(normalized);
    this.selectedChange.emit(normalized);
  }

  getErrorMessage(): string {
    const errors = this.formControl?.errors;
    if (!errors) return '';
    if (errors['required']) return 'entity.validation.required';
    if (errors['minlength']) return 'entity.validation.minlength';
    if (errors['maxlength']) return 'entity.validation.maxlength';
    if (errors['pattern']) return 'entity.validation.pattern-name';
    if (errors['deactivatable']) return 'entity.validation.deactivatable';
    return '';
  }
}
