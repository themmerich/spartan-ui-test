import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Chip } from 'primeng/chip';

@Component({
    selector: 'babs-chip-value',
    templateUrl: './table-chip-value.component.html',
    styleUrls: ['table-chip-value.component.scss'],
    imports: [TableModule, FormsModule, Chip],
})
export class TableChipValueComponent {
    options = input.required<string[]>();
}
