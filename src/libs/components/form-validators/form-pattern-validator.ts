/**
 * Validiert eine Regex und gibt einen eigenen Error-Code zurück.
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function patternValidator(regex: RegExp, errorKey: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) {
            return null;
        }

        return regex.test(control.value) ? null : { [errorKey]: true };
    };
}
