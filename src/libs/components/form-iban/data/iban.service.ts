import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '@babs/babs-frontend-shared/lib/app.constants.shared';
import { Observable } from 'rxjs';
import { Iban } from '../model/iban';
import { IbanEntityType } from '@components/form-iban/model/iban-entity-type';
import { Personenprofil } from '../../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/personenprofil';
import { DolmetscherBuero } from '../../../../../../../apps/babs-frontend-int/src/app/domains/zentrale-steuerungen/model/dolmetscher-buero';

@Injectable({
    providedIn: 'root',
})
export class IbanService {
    private http = inject(HttpClient);

    private readonly resourceUrls: Record<IbanEntityType, string> = {
        personenprofil: `${SERVER_API_URL}api/dolmetschers`,
        dolmetscherbuero: `${SERVER_API_URL}api/dolmetscher-buros`,
    };

    readonly selectedEntityType = signal<IbanEntityType | null>(null);
    readonly selectedEntity = signal<Personenprofil | DolmetscherBuero | null>(null);

    setSelectedEntityIban(entity: Personenprofil | DolmetscherBuero | null, type: IbanEntityType | null): void {
        this.selectedEntity.set(entity);
        this.selectedEntityType.set(type);
    }

    readonly resourceUrl = computed(() => {
        const type = this.selectedEntityType();
        return type ? this.resourceUrls[type] : '';
    });

    /**
     * Gibt an, dass die IBAN aktualisiert wurde und eine Freigabe erfolgen kann.
     *
     * @param {Iban} ibanData Die IBAN Daten.
     * @return {Observable<Iban>} Die IBAN Daten nach der Verarbeitung.
     */
    updateIbanZurFreigabe(ibanData: Iban): Observable<Iban> {
        return this.http.put<Iban>(`${this.resourceUrl()}/iban/update-zur-freigabe`, ibanData);
    }

    /**
     * Liefert die aktuellen IBAN Daten für ein Personenprofil oder Dolmetscher-Büro.
     *
     * @param {number} id - die ID des Personenprofils oder Dolmetscher-Büros.
     * @return {Observable<Iban>} Die IBAN Daten nach der Verarbeitung.
     */
    getIbanZurFreigabe(id: number): Observable<Iban> {
        return this.http.get<Iban>(`${this.resourceUrl()}/${id}/iban`);
    }

    /**
     * Gibt die zwischengespeicherte IBAN frei.
     *
     * @param {Iban} ibanData - die IBAN Daten, die freigegeben werden sollen.
     * @return {Observable<Iban>} Die IBAN Daten nach der Verarbeitung.
     */
    freigabeIban(ibanData: Iban): Observable<Iban> {
        return this.http.put<Iban>(`${this.resourceUrl()}/iban/freigabe`, ibanData);
    }
}
