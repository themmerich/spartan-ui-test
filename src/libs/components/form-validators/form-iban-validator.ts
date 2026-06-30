/**
 * Validiert IBAN mit:
 * - Nur "DE" erlaubt
 * - Länge 22 (DE)
 * - nur [A-Z0-9]
 * - MOD-97 Prüfzifferncheck
 */
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function deIbanValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const raw = (control.value ?? '').toString();

        if (!raw.trim()) {
            return null;
        }

        const iban = raw.replaceAll(' ', '').toUpperCase();

        // DE + 20 weitere Zeichen = 22
        if (!/^DE[0-9A-Z]{20}$/.test(iban) || iban.length !== 22) {
            return { ibanInvalid: { reason: 'ibanFormat' } };
        }

        const rearranged = iban.slice(4) + iban.slice(0, 4);
        const expanded = rearranged.replace(/[A-Z]/g, (ch) => (ch.charCodeAt(0) - 55).toString());

        let remainder = 0;
        for (let i = 0; i < expanded.length; i += 9) {
            const block = remainder.toString() + expanded.substring(i, i + 9);
            remainder = parseInt(block, 10) % 97;
        }

        if (remainder !== 1) {
            return { ibanInvalid: { reason: 'checksum' } };
        }
        return null;
    };
}
