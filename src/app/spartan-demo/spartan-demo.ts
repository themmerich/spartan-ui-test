import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { FormCheckboxComponent } from '../../libs/spartan/form-checkbox/form-checkbox.component';
import { FormInputComponent } from '../../libs/spartan/form-input/form-input.component';
import { FormNumberComponent } from '../../libs/spartan/form-number/form-number.component';
import { FormPhoneComponent } from '../../libs/spartan/form-phone/form-phone.component';
import { FormSelectComponent } from '../../libs/spartan/form-select/form-select.component';

@Component({
  selector: 'app-spartan-demo',
  imports: [
    ReactiveFormsModule,
    FormCheckboxComponent,
    FormInputComponent,
    FormNumberComponent,
    FormPhoneComponent,
    FormSelectComponent,
    HlmCardImports,
    JsonPipe,
  ],
  templateUrl: './spartan-demo.html',
})
export class SpartanDemo {
  private readonly translate = inject(TranslateService);

  protected readonly form = new FormGroup({
    firstName: new FormControl('Thomas'),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    weight: new FormControl('72'),
    homepage: new FormControl('spartan-ui.com'),
    code: new FormControl(''),
    readonlyField: new FormControl('Nicht editierbar'),
  });

  protected readonly numberForm = new FormGroup({
    amount: new FormControl<number | null>(1250.5),
    percentage: new FormControl<number | null>(19),
    quantity: new FormControl<number | null>(3, [Validators.min(1), Validators.max(100)]),
    price: new FormControl<number | null>(null, [Validators.required]),
  });

  protected readonly selectForm = new FormGroup({
    country: new FormControl<string | null>('de'),
    department: new FormControl<string | null>(null, [Validators.required]),
  });

  protected readonly phoneForm = new FormGroup({
    mobile: new FormControl('+49 170 1234567', [Validators.pattern(/^[+0-9 /()-]{6,}$/)]),
    landline: new FormControl('', [Validators.required]),
  });

  protected readonly checkboxForm = new FormGroup({
    newsletter: new FormControl(true),
    terms: new FormControl(false, [Validators.requiredTrue]),
    notifications: new FormControl({ value: false, disabled: true }),
  });

  protected readonly countries = [
    { name: 'Deutschland', value: 'de' },
    { name: 'Österreich', value: 'at' },
    { name: 'Schweiz', value: 'ch' },
    { name: 'Frankreich', value: 'fr' },
  ];

  protected readonly departmentGroups = [
    {
      name: 'Technik',
      items: [
        { name: 'Entwicklung', value: 'dev' },
        { name: 'IT-Betrieb', value: 'ops' },
      ],
    },
    {
      name: 'Verwaltung',
      items: [
        { name: 'Personal', value: 'hr' },
        { name: 'Finanzen', value: 'fin' },
      ],
    },
  ];

  constructor() {
    // Minimal in-memory translations so the demo renders readable labels
    // and validation messages without a translation backend.
    this.translate.setTranslation('de', {
      demo: {
        firstName: 'Vorname',
        username: 'Benutzername',
        weight: 'Gewicht',
        homepage: 'Webseite',
        code: 'Ländercode',
        readonly: 'Schreibgeschützt',
        amount: 'Betrag',
        percentage: 'Steuersatz',
        quantity: 'Menge',
        price: 'Preis',
        country: 'Land',
        department: 'Abteilung',
        mobile: 'Mobil',
        landline: 'Festnetz',
        newsletter: 'Newsletter abonnieren',
        terms: 'AGB akzeptieren',
        notifications: 'Benachrichtigungen aktivieren',
      },
      entity: {
        validation: {
          required: 'Dieses Feld ist erforderlich.',
          minlength: 'Mindestens {{min}} Zeichen erforderlich.',
          maxlength: 'Höchstens {{max}} Zeichen erlaubt.',
          'pattern-name': 'Ungültiges Format.',
          uniqueCode: 'Dieser Code ist bereits vergeben.',
          germanIBAN: 'Ungültige IBAN.',
          germanSteuernummer: 'Ungültige Steuernummer.',
          'pattern-plz': 'Ungültige Postleitzahl.',
          'pattern-postfach': 'Ungültiges Postfach.',
          min: 'Wert muss mindestens {{min}} sein.',
          max: 'Wert darf höchstens {{max}} sein.',
          inBetweenNew: 'Wert muss zwischen {{min}} und {{max}} liegen.',
          minlengthNew: 'Mindestens {{minLength}} Stellen erforderlich.',
          maxlengthNew: 'Höchstens {{maxLength}} Stellen erlaubt.',
          deactivatable: 'Dieser Eintrag kann nicht deaktiviert werden.',
          'pattern-phone-new': 'Ungültige Telefonnummer.',
        },
      },
    });
    this.translate.use('de');
  }
}
