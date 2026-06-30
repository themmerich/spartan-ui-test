import { Component, input } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { Tag } from 'primeng/tag';

type severity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined | null;

@Component({
    selector: 'babs-tag-value',
    templateUrl: './table-tag-value.component.html',
    imports: [TableModule, FormsModule, Tag],
})
export class TableTagValueComponent {
    value = input.required<any>();
    severity = input.required<severity>();
}
