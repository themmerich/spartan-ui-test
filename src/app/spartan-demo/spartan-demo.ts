import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { FormInputComponent } from '../../libs/spartan/form-input/form-input.component';

@Component({
  selector: 'app-spartan-demo',
  imports: [ReactiveFormsModule, FormInputComponent, HlmCardImports, JsonPipe],
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
        },
      },
    });
    this.translate.use('de');
  }
}
