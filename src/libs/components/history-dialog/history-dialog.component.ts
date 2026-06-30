import { Component, computed, effect, inject, input, model, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HistoryDialogService } from '@components/history-dialog/history-dialog.service';
import { TableClientsideComponent } from '@components/table-clientside/table-clientside.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Button } from 'primeng/button';

@Component({
    selector: 'babs-history-dialog',
    imports: [TranslatePipe, Dialog, ReactiveFormsModule, TableClientsideComponent, Button],
    templateUrl: './history-dialog.component.html',
    styleUrls: ['./history-dialog.component.scss'],
})
export class HistoryDialogComponent {
    private readonly historyDialogService = inject(HistoryDialogService);

    readonly id = input<string>();

    readonly visible = model<boolean>(false);
    readonly showHistoryDialog = output<boolean>();
    readonly resourceUrl = this.historyDialogService.resourceUrl;
    readonly history = this.historyDialogService.history;

    readonly isNotFound = computed(() => {
        const error = this.history.error();
        return error instanceof HttpErrorResponse && error.status === 404;
    });

    readonly columns = [
        { field: 'value', header: 'auditHistory.columns.value', type: 'string', sort: true, show: true },
        { field: 'revisionDate', header: 'auditHistory.columns.revisionDate', type: 'date', sort: true, show: true },
        { field: 'revisionType', header: 'auditHistory.columns.revisionType', type: 'revision_typ', sort: true, show: true },
        { field: 'revisionId', header: 'auditHistory.columns.revisionId', type: 'number', sort: true, show: true },
        { field: 'userLogin', header: 'auditHistory.columns.author', type: 'string', sort: true, show: true },
    ];

    constructor() {
        effect(() => {
            this.historyDialogService.reload();
        });
    }

    cancel() {
        this.visible.set(false);
        this.showHistoryDialog.emit(false);
    }
}
