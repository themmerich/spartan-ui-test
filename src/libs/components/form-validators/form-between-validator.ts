/**
 * Validiert zwischen zwei Zahlenwerten.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function betweenValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const raw = (control.value ?? '').toString();

        if (!raw.trim() || !min || !max) {
            return null;
        }

        const value = Number(control.value);

        if (value < min || value > max) {
            return { between: { min, max, actual: value } };
        }
        return null;
    };
}
