import { AfterViewInit, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { Table, TableModule, TableRowReorderEvent } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { HasAnyAuthorityDirective } from '@babs/babs-frontend-shared/lib/auth/has-any-authority.directive';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { BooleanFormatterPipe, SwitchValueFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/boolean-formatter.pipe';
import { FilterService } from 'primeng/api';
import { NameFormatterPipe } from '../../../../../../apps/babs-frontend-int/src/app/shared/formatting/name-formatter.pipe';
import { LanguageFormatterPipe } from '@babs/babs-frontend-shared/lib/formatting/language-formatter.pipe';
import { SprachePipe } from '@babs/babs-frontend-shared/lib/formatting/sprache.pipe';
import { Ripple } from 'primeng/ripple';
import { Column } from './table-column.model';
import { buildFilterOptions, TableFilterOptions } from './table-filter-options';
import { FormatContext, formatRows } from './table-row-formatter';
import { TableColumnFilterComponent } from '@components/table-clientside/table-column-filter/table-column-filter.component';
import { TableCellComponent } from '@components/table-clientside/table-cell/table-cell.component';
import { TableRowActionsComponent } from '@components/table-clientside/table-row-actions/table-row-actions.component';

@Component({
    selector: 'babs-table-clientside',
    templateUrl: './table-clientside.component.html',
    styleUrls: ['./table-clientside.component.scss'],
    providers: [NameFormatterPipe, AsyncPipe, SwitchValueFormatterPipe, BooleanFormatterPipe],
    imports: [
        TableModule,
        ButtonDirective,
        MultiSelect,
        FormsModule,
        IconField,
        InputIcon,
        InputText,
        HasAnyAuthorityDirective,
        TranslatePipe,
        Ripple,
        TableColumnFilterComponent,
        TableCellComponent,
        TableRowActionsComponent,
    ],
})
export class TableClientsideComponent implements OnInit, AfterViewInit {
    private readonly translateService = inject(TranslateService);
    private readonly filterService = inject(FilterService);
    private readonly switchValueFormatterPipe = inject(SwitchValueFormatterPipe);
    private readonly booleanFormatterPipe = inject(BooleanFormatterPipe);
    private readonly babsSprachePipe = inject(SprachePipe);
    private readonly babsLanguagePipe = inject(LanguageFormatterPipe);

    private readonly formatContext: FormatContext = {
        translate: this.translateService,
        switchValueFormatter: this.switchValueFormatterPipe,
        booleanFormatter: this.booleanFormatterPipe,
        sprache: this.babsSprachePipe,
        language: this.babsLanguagePipe,
    };

    readonly data = input.required<any>();
    readonly columns = input.required<Column[]>();
    readonly internalData = computed(() => formatRows(this.data(), this.columns(), this.formatContext));
    readonly internalColumns = signal<Column[]>([]);
    readonly internalSelectedColumns = signal<Column[]>([]);
    readonly exportFilename = input('');
    readonly scrollHeight = input<string>('flex');
    readonly id = input<string>('p-table');
    readonly columnLength = computed(() => this.getColumnLength());

    readonly rowGroupMode = input<'subheader' | 'rowspan' | null>(null);
    readonly groupRowsBy = input<string>('');

    readonly showView = input(false);
    readonly showEdit = input(false);
    readonly showDelete = input(false);
    readonly showAdd = input(false);
    readonly showViewMitarbeiter = input(false);
    readonly showHistory = input(false);
    readonly showSearch = input(true);
    readonly showColumnToggle = input(true);
    readonly showLocations = input(false);
    readonly showDownload = input(false);
    readonly showFile = input(false);
    readonly showAssign = input(false);
    readonly showAssignUser = input(false);
    readonly showRemoveUser = input(false);
    readonly showActivate = input(false);
    readonly showDeactivate = input(false);

    readonly canReorder = input(false);
    readonly isReadOnly = input(false);
    readonly stateKey = input.required<string>();
    readonly emptyMsg = input('');
    readonly view = output<any>();
    readonly viewMitarbeiter = output<any>();
    readonly viewDokumentenhistorie = output<any>();
    readonly edit = output<any>();
    readonly add = output<any>();
    readonly delete = output<any>();
    readonly history = output<any>();
    readonly locations = output<any>();
    readonly download = output<any>();
    readonly file = output<any>();
    readonly reorder = output<any>();
    readonly assign = output<any>();
    readonly assignUser = output<any>();
    readonly removeUser = output<any>();
    readonly activate = output<any>();
    readonly deactivate = output<any>();

    readonly selectedRow = signal<any>(null);
    readonly globalFilterValue = signal<string>('');
    readonly globalFilterColumns = computed(() => this.internalSelectedColumns().map((column) => column.field));
    readonly buttonsByCondition = input('');
    readonly inTerminKontext = computed(() => this.buttonsByCondition() === 'termin');

    /** Pre-translated column-filter option lists, populated in `ngOnInit`. */
    protected options!: TableFilterOptions;

    ngOnInit() {
        // init custom filters
        this.registerCustomFilter();

        // init translated filter option lists
        this.options = buildFilterOptions(this.translateService);

        // init current selected columns (clone so the `columns` input is not mutated in place)
        const storedColumns = localStorage.getItem(this.stateKey() + '-columns');
        if (storedColumns) {
            this.internalSelectedColumns.set(JSON.parse(storedColumns));
        } else {
            const selected = this.columns()
                .filter((c) => c.show)
                .map((c) => ({ ...c, header: this.translateService.instant(c.header) }));
            this.internalSelectedColumns.set(selected);
        }

        // init list of available columns
        const all = this.columns().map((c) => ({
            ...c,
            header: this.translateService.instant(c.header),
        }));
        this.internalColumns.set(all);
    }

    ngAfterViewInit() {
        // restore stored global filter
        const storedFilters = JSON.parse(localStorage.getItem(this.stateKey()));
        if (!storedFilters) {
            return;
        }

        if (storedFilters.filters?.global?.value !== null) {
            this.globalFilterValue.set(storedFilters.filters?.global?.value);
        }
    }

    onEdit(event: any) {
        this.selectedRow.set(event.data);
        this.edit.emit(event);
    }

    onView(event: any) {
        this.selectedRow.set(event.data);
        this.view.emit(event);
    }

    onViewMitarbeiter(event: any) {
        this.selectedRow.set(event.data);
        this.viewMitarbeiter.emit(event);
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

    onLocations(event: any) {
        this.locations.emit(event);
    }

    onDownload(event: any) {
        this.download.emit(event);
    }

    onFile(event: any) {
        this.file.emit(event);
    }

    onAssign(event: any) {
        this.selectedRow.set(event.data);
        this.assign.emit(event);
    }

    onAssignUser(event: any) {
        this.assignUser.emit(event);
    }

    onRemoveUser(event: any) {
        this.removeUser.emit(event);
    }

    onReorder(event: TableRowReorderEvent) {
        this.reorder.emit(event);
    }

    onColumnsChange(event: any) {
        localStorage.setItem(this.stateKey() + '-columns', JSON.stringify(event));
    }

    onActivate(event: any) {
        this.selectedRow.set(event.data);
        this.activate.emit(event);
    }

    onDeactivate(event: any) {
        this.selectedRow.set(event.data);
        this.deactivate.emit(event);
    }

    getColumnLength() {
        let additionalLength = 0;
        if (
            this.showEdit() ||
            this.showHistory() ||
            this.showDownload() ||
            this.showAdd() ||
            this.showAssign() ||
            this.showDelete() ||
            this.showLocations() ||
            this.showActivate() ||
            this.showDeactivate()
        ) {
            additionalLength++;
        }
        return this.internalSelectedColumns().length + additionalLength;
    }

    clearFilters(table: Table) {
        table.clear();
        this.globalFilterValue.set('');
        localStorage.removeItem(this.stateKey());
    }

    registerCustomFilter() {
        this.filterService.register('arrayContains', (value: string[], filter: string[]): boolean => {
            if (!filter || filter.length === 0) {
                return true;
            }
            if (!value || value.length === 0) {
                return false;
            }
            return filter.every((filterValue) => value.includes(filterValue));
        });

        this.filterService.register('categoryContains', (value: string[], filter: string[]): boolean => {
            if (!filter || filter.length === 0) {
                return true;
            }
            if (!value || value.length === 0) {
                return false;
            }
            return filter.every((filterValue) => value.some((val) => val === filterValue));
        });

        this.filterService.register('zielgruppeContains', (value: string[], filter: string[]): boolean => {
            if (!filter || filter.length === 0) {
                return true;
            }
            if (!value || value.length === 0) {
                return false;
            }
            return filter.every((filterValue) => value.some((val) => val === filterValue));
        });
    }
}
