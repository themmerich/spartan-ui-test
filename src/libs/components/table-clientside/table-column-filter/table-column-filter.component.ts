import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ListColumnFilterComponent } from '@components/list-column-filter/list-column-filter.component';
import { Column } from '../table-column.model';
import { TableFilterOptions } from '../table-filter-options';

@Component({
    selector: 'babs-table-column-filter',
    imports: [TableModule, ListColumnFilterComponent],
    templateUrl: './table-column-filter.component.html',
})
export class TableColumnFilterComponent {
    readonly col = input.required<Column>();
    readonly options = input.required<TableFilterOptions>();
}
