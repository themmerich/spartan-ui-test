import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { SERVER_API_URL } from '@babs/babs-frontend-shared/lib/app.constants.shared';

export interface BKGResponse {
    suggestion: string;
    type: string;
    score: number;
    count: number;
    highlighted: string;
}

export interface GeoDataResponse {
    suggestion: string;
    street?: string;
    streetNumber?: string;
    postalCode?: string;
    city?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AddressSearchService {
    private geoDatenSuggestUrl = SERVER_API_URL + 'api/geodaten/suggest?query=';

    private http = inject(HttpClient);

    /**
     * Search for an address.
     *
     * @param term the search term
     */
    search(term: string): Observable<GeoDataResponse[]> {
        if (term === '') {
            return of([]);
        }

        return this.http.get<BKGResponse[]>(this.geoDatenSuggestUrl + term).pipe(map((response) => this.convertBKGResponse(response)));
    }

    /**
     * Converts the BKG reponse object into a geo data response, having split values for street, number, zip and city.
     *
     * @param response the BKG response
     * @private
     */
    private convertBKGResponse(response: BKGResponse[]): any {
        const result: GeoDataResponse[] = [];

        for (const bkg of response) {
            if (bkg.type === 'Haus' || bkg.type === 'Strasse' || bkg.type === 'Ort') {
                // cut off additonal infos, ie. Nuernberg-Moegeldorf -> Nuernberg
                let suggestion: string = bkg.suggestion;
                const index = bkg.suggestion.lastIndexOf(' - ');
                if (index > -1) {
                    suggestion = suggestion.substring(0, index);
                }

                // split suggestion by type into single objects
                let regex;
                if (bkg.type === 'Haus') {
                    regex = /^(?<street>.+?)\s(?<number>\d+\w*),\s(?<postalcode>\d{5})\s(?<city>.+)$/;
                } else if (bkg.type === 'Strasse') {
                    regex = /^(?<street>.+?),\s(?<postalcode>\d{5})\s(?<city>.+)$/;
                } else {
                    regex = /^(?<postalcode>\d{5})\s(?<city>.+)$/;
                }
                const match = suggestion.match(regex);
                if (match?.groups) {
                    result.push({
                        suggestion: suggestion,
                        street: match.groups.street,
                        streetNumber: match.groups.number,
                        postalCode: match.groups.postalcode,
                        city: match.groups.city,
                    } as GeoDataResponse);
                }
            }
        }
        return result;
    }
}
