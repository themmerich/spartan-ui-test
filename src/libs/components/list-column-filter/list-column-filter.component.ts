import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'babs-list-columnfilter',
    templateUrl: './list-column-filter.component.html',
    imports: [TableModule, MultiSelect, FormsModule],
})
export class ListColumnFilterComponent {
    readonly field = input.required<any>();
    readonly options = input.required<string[]>();
    readonly matchMode = input<string>('in');
}
