import { Component, inject, input, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonDirective } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoryGroup } from '@components/table-clientside-history/history-group';
import { HistoryDialogComponent } from '@components/history-dialog/history-dialog.component';
import { HistoryDialogService } from '@components/history-dialog/history-dialog.service';
import { TableClientsideComponent } from '@components/table-clientside/table-clientside.component';

type ExpandedRows = Record<string, boolean>;

@Component({
    selector: 'babs-table-clientside-history',
    templateUrl: './table-clientside-history.component.html',
    styleUrls: ['./table-clientside-history.component.scss'],
    imports: [CommonModule, TableModule, ButtonDirective, FormsModule, DatePipe, HistoryDialogComponent, TableClientsideComponent],
})
export class TableClientsideHistoryComponent {
    private readonly historyDialogService = inject(HistoryDialogService);
    readonly id = input<string>('p-table');
    readonly history = input.required<any>();
    readonly expandedRows = signal<ExpandedRows>({});
    readonly showHistoryDialog = signal(false);

    subTableColumns = [
        { field: 'feld', header: 'babsappApp.historie.columns.feld', type: 'string', sort: false, show: false },
        { field: 'feldname', header: 'babsappApp.historie.columns.feld', type: 'string', sort: true, show: true },
        { field: 'wert', header: 'babsappApp.historie.columns.wertaenderung', type: 'string', sort: true, show: true },
        { field: 'datumZeit', header: 'babsappApp.historie.columns.datum', type: 'date', sort: true, show: true },
    ];

    toggleRow(row: HistoryGroup): void {
        this.expandedRows.update((rows) => {
            const next = { ...rows };
            if (next[row.id]) {
                delete next[row.id];
            } else {
                next[row.id] = true;
            }
            return next;
        });
    }

    openHistoryDialog(feld: string): void {
        if (!feld) {
            return;
        }

        const value = this.toCamelCase(feld);
        this.historyDialogService.id.set(value);
        this.showHistoryDialog.set(true);
    }

    cancelHistoryDialog(): void {
        this.historyDialogService.id.set(null);
        this.showHistoryDialog.set(false);
    }

    private toCamelCase(value: string): string {
        return value
            .trim()
            .toLowerCase()
            .split('_')
            .filter(Boolean)
            .map((part, index) => (index === 0 ? part : `${part[0].toUpperCase()}${part.slice(1)}`))
            .join('');
    }
}
