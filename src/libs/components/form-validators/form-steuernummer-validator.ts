import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SteuernummerInputService } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/data/steuernummer-input.service';

/**
 * ValidatorFn für Steuernummer abhängig vom Bundesland.
 *
 * - bundeslandGetter: Funktion, die das aktuell ausgewählte Bundesland liefert
 * - required: wenn true, ist leerer Wert invalid (sonst: leer = ok)  */
export function steuernummerByBundeslandValidator(bundeslandGetter: () => string | null | undefined, options?: { required?: boolean }): ValidatorFn {
    const required = options?.required ?? false;

    return (control: AbstractControl): ValidationErrors | null => {
        const valueRaw = control.value;

        // keine Eingabe
        if (valueRaw === null || valueRaw === undefined || String(valueRaw).trim() === '') {
            return required ? { steuernummerRequired: true } : null;
        }

        const value = String(valueRaw).trim();
        const bundesland = bundeslandGetter();
        const { pattern, placeholder } = SteuernummerInputService.get(bundesland);
        return pattern.test(value)
            ? null
            : {
                  steuernummerInvalid: {
                      bundesland: (bundesland ?? '').trim(),
                      expectedPlaceholder: placeholder,
                      actual: value,
                  },
              };
    };
}
