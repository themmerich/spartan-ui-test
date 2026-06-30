import { Component, inject, input, signal } from '@angular/core';
import { HistoryDialogService } from '@components/history-dialog/history-dialog.service';

@Component({
    template: `<ng-content />`,
    imports: [],
})
export class HistoryBase {
    private readonly historyDialogService = inject(HistoryDialogService);
    readonly id = input.required<string>();
    readonly showHistoryDialog = signal(false);

    handleRightClick(event: MouseEvent) {
        if (!this.historyDialogService.resourceUrl() || this.historyDialogService.history?.error()) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        this.historyDialogService.id.set(this.id());
        this.showHistoryDialog.set(true);
    }

    cancelHistoryDialog() {
        this.historyDialogService.id.set(null);
        this.showHistoryDialog.set(false);
    }
}
