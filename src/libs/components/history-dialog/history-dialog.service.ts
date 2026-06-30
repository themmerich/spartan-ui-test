import { computed, inject, Injectable, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { HistoryDialogItem } from '@components/history-dialog/history-dialog-item';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class HistoryDialogService {
    private readonly router = inject(Router);
    readonly resourceUrl = signal<string | null>(null);
    readonly id = signal<string | null>(null);

    private readonly property = computed(() => this.id());

    readonly history = httpResource<HistoryDialogItem[]>(() => {
        const url = this.resourceUrl();
        const prop = this.property();
        if (!url || !prop) {
            return undefined;
        }

        return {
            url,
            params: {
                property: prop,
            },
        };
    });

    constructor() {
        this.router.events.pipe(filter((event) => event instanceof NavigationStart)).subscribe(() => this.resourceUrl.set(null));
    }

    reload() {
        if (this.history) {
            this.history.reload();
        }
    }
}
