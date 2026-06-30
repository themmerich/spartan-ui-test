# Spartan-Wrapper-Komponenten

Migrierte Komponenten (von PrimeNG auf [Spartan UI](https://spartan.ng)), die in der echten App die bisherigen `src/libs/components/*`-Wrapper ersetzen.

Stand: aktuell migriert: `form-input`, `form-number`, `form-select`.

---

## Eine migrierte Komponente ins echte Projekt übernehmen

Das Generieren der helm-Komponenten ist nur ein Teil. Damit eine migrierte Komponente
(z. B. `form-input`) funktioniert **und gleich aussieht**, ist Folgendes nötig — sortiert
nach „leicht zu übersehen".

### 1. Spartan-Grundsetup (einmalig)

- **Tailwind v4** + `@tailwindcss/postcss` + `.postcssrc.json`
- In `styles.scss`:
  - die Tailwind-Imports (`theme.css`, `preflight.css`, `utilities.css`)
  - `@import '@spartan-ng/brain/hlm-tailwind-preset.css'`
  - die **Theme-Tokens** (`--background`, `--primary`, … im `.theme-stone`-Block, hell **und** dunkel)
- ⚠️ **Die `theme-stone`-Klasse muss gesetzt sein** (hier auf `<body>` in `index.html`).
  Fehlt sie, sind alle CSS-Variablen leer → die Komponente rendert **farblos/unstyled**.
  Das ist der häufigste „warum sieht das kaputt aus"-Fehler.
- tsconfig-Pfad-Aliase `@spartan-ng/helm/*`

### 2. Laufzeit-Dependencies

Direkt oder transitiv benötigt:

- `@spartan-ng/brain` **und** `@angular/cdk`
- `@ng-icons/core` **und** `@ng-icons/lucide` (z. B. `lucideExternalLink` im Link-Addon)
- `class-variance-authority`, `clsx`, `tailwind-merge` (helm-utils)
- `@ngx-translate/core` (in der App bereits vorhanden)

### 3. Die richtigen helm-Komponenten generieren

`form-input` importiert `@spartan-ng/helm/input-group` und `@spartan-ng/helm/label`.
**Transitiv** zusätzlich nötig: **`input`** (`HlmInput` → `BrnInput`), **`button`**
(für das Link-Addon `hlmInputGroupButton`) und **`utils`**.

Also mindestens generieren: `input-group`, `label`, `input`, `button`
(die Spartan-CLI zieht Abhängigkeiten i. d. R. mit).

### 4. Austausch / Drop-in

- **Gleicher Selektor** (`babs-form-input`) → es darf **nicht** die alte PrimeNG- und die
  neue Spartan-Version gleichzeitig importiert sein. Pro Aufrufer einfach den Import-Pfad
  auf `src/libs/spartan/form-input/form-input.component` umbiegen. Inputs/Outputs sind identisch.
- **i18n-Keys**: `getErrorMessage()` nutzt dieselben Keys (`entity.validation.*`); Label bleibt ein Translation-Key.

### 5. Bewusste Verhaltens-/Optik-Unterschiede (prüfen!)

- 🔴 **`babs-history-dialog` entfällt** — der Rechtsklick → Historie auf Eingabefeldern ist in der
  migrierten Version **entfernt**. Wird das in der echten App genutzt, muss entschieden werden,
  ob/wie es ersetzt wird.
- **Floating-Label → Label über dem Feld** (Spartan-Konvention). Ändert Höhe/Abstände —
  Layouts, die auf die Float-Label-Höhe gebaut sind, ggf. anpassen.
- **`variant` (filled/outlined) entfällt**; disabled wird über native `readonly`/`disabled` abgebildet.
- Link-Icon ist jetzt Lucide statt PrimeNG `pi pi-external-link`.

### 6. Tailwind-Content-Scan

Sicherstellen, dass Tailwind v4 die Templates unter `src/libs/spartan/**` **und** `src/libs/ui/**`
scannt (bei expliziten content-Globs ergänzen), sonst fehlen die Utility-Klassen.

---

## Komponentenstatus

| Komponente    | Status     | Anmerkung                                                                                   |
| ------------- | ---------- | ------------------------------------------------------------------------------------------- |
| `form-input`  | ✅ migriert | ohne `babs-history-dialog`-Abhängigkeit                                                       |
| `form-number` | ✅ migriert | natives `type="number"`; ohne `babs-history-dialog`; `minFractionDigits` ohne native Anzeige |
| `form-select` | ✅ migriert | helm `select` (Overlay via `*hlmSelectPortal`); ohne `babs-history-dialog`; `showFilter`/`showClear` nicht unterstützt |
