import { Component, inject, input } from '@angular/core';
import { AsyncPipe, DatePipe, DecimalPipe, NgClass, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Tooltip } from 'primeng/tooltip';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { BabsTranslateDirective } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate';
import { StripHtmlPipe } from '@babs/babs-frontend-shared/lib/formatting/strip-html.pipe';
import { LanguageFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/language-formatter.pipe';
import { SprachePipe } from '@babs/babs-frontend-shared/lib/formatting/sprache.pipe';
import { NameFormatterPipe } from '../../../../../../../apps/babs-frontend-int/src/app/shared/formatting/name-formatter.pipe';
import { TableTagValueComponent } from '@components/table-tag-value/table-tag-value.component';
import { TableChipValueComponent } from '@components/table-chip-value/table-chip-value.component';
import { Column } from '../table-column.model';
import { getFieldValue } from '../table-row-formatter';
import * as severity from '../table-severity';
import { Severity } from '../table-severity';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'td[babsTableCell]',
    imports: [
        AsyncPipe,
        DatePipe,
        DecimalPipe,
        NgClass,
        SlicePipe,
        RouterLink,
        TranslatePipe,
        Tooltip,
        NgbPopover,
        NgbTooltip,
        BabsTranslatePipe,
        BabsTranslateDirective,
        StripHtmlPipe,
        LanguageFormatterPipe,
        SprachePipe,
        NameFormatterPipe,
        TableTagValueComponent,
        TableChipValueComponent,
    ],
    host: {
        '[class.text-center]': "col().type === 'boolean'",
        '[class.chips]': "col().type === 'mitarbeiter_rollen'",
    },
    templateUrl: './table-cell.component.html',
})
export class TableCellComponent {
    private readonly translateService = inject(TranslateService);

    readonly col = input.required<Column>();
    readonly rowData = input.required<any>();
    readonly isReadOnly = input(false);

    protected readonly getFieldValue = getFieldValue;

    getSeverity(status: string): Severity {
        return severity.getSeverity(this.translateService, status);
    }

    getEinsatzortSeverity(status: string): Severity {
        return severity.getEinsatzortSeverity(this.translateService, status);
    }

    getDmsSeverity(status: string): Severity {
        return severity.getDmsSeverity(this.translateService, status);
    }

    getTerminSeverity(status: string): Severity {
        return severity.getTerminSeverity(this.translateService, status);
    }

    getNewsSeverity(status: string): Severity {
        return severity.getNewsSeverity(this.translateService, status);
    }

    getRegelSeverity(status: string): Severity {
        return severity.getRegelSeverity(this.translateService, status);
    }

    getPlatzStatusSeverity(status: string): Severity {
        return severity.getPlatzStatusSeverity(this.translateService, status);
    }

    getVorlagenStandSeverity(status: string): Severity {
        return severity.getVorlagenStandSeverity(this.translateService, status);
    }

    getMitarbeiterSeverity(status: boolean): Severity {
        return severity.getMitarbeiterSeverity(status);
    }
}
