import { Component, computed, inject, input, output } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'babs-form-editor',
  imports: [ReactiveFormsModule, TranslatePipe, HlmLabelImports, QuillEditorComponent],
  templateUrl: './form-editor.component.html',
  styleUrl: './form-editor.component.scss',
})
export class FormEditorComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly disabled = input(false);
  readonly required = input(false);
  readonly height = input<string>('140px');
  // Kept for API compatibility with the PrimeNG component; not used here.
  readonly group = input<boolean>(false);
  readonly minLength = input(0);
  readonly maxLength = input(0);
  readonly isReadOnly = computed(() => (this.disabled() ? 'readonly' : null));
  readonly placeholder = computed(() => this.label());
  readonly blury = output<FocusEvent>();

  /** Toolbar configuration for the rich-text editor. */
  readonly modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'clean'],
    ],
  };

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
    if (errors['minLength']) return 'entity.validation.minlength';
    if (errors['maxLength']) return 'entity.validation.maxlength';
    return '';
  }

  onBlur(event: FocusEvent): void {
    this.blury.emit(event);
  }
}
