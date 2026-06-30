import { Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe, NgClass, SlicePipe } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TableTagValueComponent } from '@components/table-tag-value/table-tag-value.component';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';
import { SprachePipe } from '@babs/babs-frontend-shared/lib/formatting/sprache.pipe';
import { LanguageFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/language-formatter.pipe';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { DolmetscherStatus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/dolmetscher-status';
import { Tooltip } from 'primeng/tooltip';
import { SpracheService } from '@babs/babs-frontend-shared/lib/sprache/sprache.service';
import { ListColumnFilterServerComponent } from '@components/list-column-filter-server/list-column-filter-server.component';
import { MitarbeiterRollenFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/mitarbeiter-rollen-formatter.pipe';
import { HasAnyAuthorityDirective } from '@babs/babs-frontend-shared/lib/auth/has-any-authority.directive';
import { WiedervorlageGrund } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-grund';
import { WiedervorlageModus } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-modus';
import { WiedervorlageStand } from '../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/wiedervorlage-stand';
import { FilterMetadata, SortMeta } from 'primeng/api';

type Column = {
    field: string;
    header: string;
    type: string;
    sort: boolean;
    show: boolean;
};

type Option = {
    label: string;
    value: string;
};

@Component({
    selector: 'babs-table-serverside',
    templateUrl: './table-serverside.component.html',
    styleUrls: ['./table-serverside.component.scss'],
    imports: [
        TableModule,
        ButtonDirective,
        MultiSelect,
        FormsModule,
        NgClass,
        IconField,
        InputIcon,
        InputText,
        DatePipe,
        TranslatePipe,
        TableTagValueComponent,
        DecimalPipe,
        BabsTranslatePipe,
        SprachePipe,
        LanguageFormatterPipe,
        NgbPopover,
        Tooltip,
        ListColumnFilterServerComponent,
        MitarbeiterRollenFormatterPipe,
        SlicePipe,
        HasAnyAuthorityDirective,
    ],
})
export class TableServersideComponent implements OnInit {
    private readonly translateService = inject(TranslateService);
    private readonly sprachenService = inject(SpracheService);

    // required inputs
    readonly data = input.required<any>();
    readonly columns = input.required<Column[]>();
    readonly stateKey = input.required<string>();
    readonly totalRecords = input.required<number>();
    readonly loading = input.required<boolean>();

    // optional inputs
    readonly showView = input(false);
    readonly showEdit = input(false);
    readonly showDelete = input(false);
    readonly showAdd = input(false);
    readonly showHistory = input(false);
    readonly showExport = input(false);

    readonly isReadOnly = input(true);
    readonly emptyMsg = input('');
    readonly rows = input(25);

    // output events
    readonly view = output<any>();
    readonly edit = output<any>();
    readonly add = output<any>();
    readonly delete = output<any>();
    readonly history = output<any>();
    readonly lazyLoad = output<any>();
    readonly export = output<any>();

    // internal variables
    readonly internalColumns = signal<Column[]>([]);
    readonly internalSelectedColumns = signal<Column[]>([]);
    readonly selectedRow = signal<any>(null);
    readonly globalFilterValue = signal<string>('');
    readonly globalFilterColumns = computed(() => this.internalSelectedColumns().map((column) => column.field));

    // filter list values
    wiedervorlageGrundTemp = Object.values(WiedervorlageGrund);
    wiedervorlageGrund = this.wiedervorlageGrundTemp.map(
        (grund) =>
            ({
                label: this.translateService.instant('babsappApp.vorlagen.grund.' + grund),
                value: grund,
            }) as Option
    );
    wiedervorlageModusTemp = Object.values(WiedervorlageModus);
    wiedervorlageModus = this.wiedervorlageModusTemp.map(
        (modus) =>
            ({
                label: this.translateService.instant('babsappApp.wiedervorlage.wvView.modus.' + modus),
                value: modus,
            }) as Option
    );
    wiedervorlageStandTemp = Object.values(WiedervorlageStand);
    wiedervorlageStand = this.wiedervorlageStandTemp.map(
        (stand) =>
            ({
                label: this.translateService.instant('babsappApp.wiedervorlage.wvView.stand.' + stand),
                value: stand,
            }) as Option
    );
    profilTypenTemp = ['PP', 'BI', 'ED', 'BD'];
    profilTypen = this.profilTypenTemp.map(
        (typ) =>
            ({
                label: this.translateService.instant('babsappApp.ProfilTyp.' + typ),
                value: typ,
            }) as Option
    );
    statusListTemp = Object.values(DolmetscherStatus);
    statusList = this.statusListTemp.map(
        (status) =>
            ({
                label: this.translateService.instant('babsappApp.DolmetscherStatus.' + status),
                value: status,
            }) as Option
    );
    sprachen = this.sprachenService.getAll();

    ngOnInit() {
        // init current selected columns
        const storedColumns = localStorage.getItem(this.stateKey() + '-columns');
        if (storedColumns) {
            this.internalSelectedColumns.set(JSON.parse(storedColumns));
        } else {
            const col = this.columns().filter((c) => c.show);
            for (const c of col) {
                c.header = this.translateService.instant(c.header);
            }
            this.internalSelectedColumns.set(col);
        }

        // init list of available columns
        const col2 = [...this.columns()];
        for (const c of col2) {
            c.header = this.translateService.instant(c.header);
        }
        this.internalColumns.set(col2);
    }

    onEdit(event: any) {
        this.selectedRow.set(event.data);
        this.edit.emit(event);
    }

    onView(event: any) {
        this.selectedRow.set(event.data);
        this.view.emit(event);
    }

    onExport(filters: Record<string, FilterMetadata | FilterMetadata[]>, sorting: SortMeta[] | null) {
        const event = { filters: filters, sorting: sorting ?? [] };
        this.export.emit(event);
    }

    onAdd(event: any) {
        this.add.emit(event);
    }

    onDelete(event: any) {
        this.delete.emit(event);
    }

    onHistory(event: any) {
        this.history.emit(event);
    }

    onLazyLoad(event: TableLazyLoadEvent) {
        console.log('onLazyLoad', event); // TODO: bitte stehen lassen bis Backend implementiert wurde!
        if (event.rows > 0) {
            this.lazyLoad.emit(event);
        }
    }

    onColumnsChange(event: any) {
        localStorage.setItem(this.stateKey() + '-columns', JSON.stringify(event));
    }

    getColumnLength() {
        let additionalLength = 0;
        if (this.showEdit()) {
            additionalLength++;
        }
        return this.internalSelectedColumns().length + additionalLength;
    }

    getMitarbeiterSeverity(status: boolean): 'success' | 'danger' {
        if (status) {
            return 'success';
        } else {
            return 'danger';
        }
    }

    getSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' {
        if (status === 'INAKTIV') {
            return 'warn';
        } else if (status === 'GELOESCHT') {
            return 'contrast';
        } else if (status === 'NICHT_EINSETZBAR') {
            return 'danger';
        } else if (status === 'IN_WIEDERVORLAGE') {
            return 'success';
        } else if (status === 'UEBERPRUEFT_UND_GEEIGNET') {
            return 'info';
        } else if (status === 'WIRD_UEBERPRUEFT') {
            return 'info';
        } else if (status === 'IN_BEWERBUNG') {
            return 'info';
        } else if (status === 'AKKREDITIERT') {
            return 'success';
        } else {
            return null;
        }
    }

    clearFilters(table: Table) {
        table.clear();
        this.globalFilterValue.set('');
    }

    getFieldValue(row: any, field: string): any {
        return field.split('.').reduce((acc, part) => acc?.[part], row);
    }
}
