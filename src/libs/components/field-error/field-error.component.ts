import { Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';

/**
 * Komponente die Fehler-Meldungen an einem Feld darstellt
 */
@Component({
    selector: 'babs-field-error',
    templateUrl: './field-error.component.html',
    imports: [BabsTranslateDirective],
})
export class FieldErrorComponent {
    /**
     * wenn eine ID in der Parent component gibt stelle Fehler Grundsätzlich dar, auch wenn sie untouched / nicht dirty sind
     */
    @Input() savedId: any;
    /**
     * Das Modell des referenzierten Controls
     */
    @Input() field: NgModel | any;
    /**
     * Bei exakter Längenvalidierung eine Zahl
     */
    @Input() exactLength: string;
    /**
     * bei Control Pattern Validation der Key aus der de.json (ohne Vorsatz)
     */
    @Input() patternKey: string;
    /**
     * bei Control Pattern Validation ein optionaler Parameter für Message
     */
    @Input() patternParameter: string;

    /**
     * zusätzliche Fehlercodes die hier zusätzlich behandelt werden sollen
     */
    @Input() customErrors: string[];
    @Input() customErrorValue: Object;
    /**
     * Die benutzerdefinierte Meldung für "required".
     */
    @Input() customRequired: string;

    /**
     * CSS class für field_errors div
     */
    @Input() className: string;

    /**
     * Konstruktor der FieldErrorComponent Komponente.
     */
    constructor() {}
}
