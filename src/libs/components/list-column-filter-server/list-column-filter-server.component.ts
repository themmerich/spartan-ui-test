import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'babs-list-columnfilter-server',
    templateUrl: './list-column-filter-server.component.html',
    imports: [TableModule, MultiSelect, FormsModule],
})
export class ListColumnFilterServerComponent {
    readonly field = input.required<any>();
    readonly options = input.required<any[]>();
    readonly matchMode = input<string>('in');
    readonly optionLabel = input<string>('label');
    readonly optionValue = input<string>('value');
}
