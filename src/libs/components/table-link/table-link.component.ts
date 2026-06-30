import { Component, inject, Input, OnInit } from '@angular/core';
import { Principal } from '../../auth/principal.service';

import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'babs-table-link',
    templateUrl: './table-link.component.html',
    styleUrls: ['./table-link.component.scss'],
    imports: [RouterModule],
})
export class TableLinkComponent implements OnInit {
    private readonly principal = inject(Principal);
    private readonly router = inject(Router);

    hasAuthority: boolean;
    isLink: boolean = false;

    @Input() page?: number;
    @Input() selected!: number;
    @Input() erstesFeld!: string;
    @Input() zweitesFeld?: string;
    @Input() linkText?: string;
    @Input() link?: string;
    @Input() linkId?: number;
    @Input() isAdminOrZentraleMA?: boolean;
    @Input() modus?: string;

    private zusatz: string = '';

    ngOnInit(): void {
        // wartet ab, bis Rollen des Benutzers initialisiert werden
        this.principal.hasAnyAuthority(['ROLE_ZENTRALEMA', 'ROLE_ADMIN', 'ROLE_LESER_KOR']).then((hasAuthority) => {
            this.hasAuthority = hasAuthority;
            // optional zur Verlinkung zur Detail-Ansicht von Mitarbeiter / Dolmetscher / Büro durch ID
            this.isLink = !!this.linkText?.trim() && this.linkId != null && !!this.link?.trim() && (this.isAdminOrZentraleMA || this.hasAuthority);
            const modus = this.modus ? this.modus : 'edit';
            this.zusatz = this.link === 'dolmetscher-buro' || this.link === 'dolmetscher' ? modus : '';
        });
    }

    navigateTo(): void {
        if (!this.link || !this.linkId) {
            return;
        }

        const navigateParams = [`/${this.link}`, this.linkId];
        if (this.zusatz) {
            navigateParams.push(this.zusatz);
        }
        const page = this.page ?? 0;
        const selected = this.selected ?? 0;
        const queryParams = { queryParams: { selected, page } };
        this.router.navigate(navigateParams, queryParams);
    }
}
