import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TableLinkComponent } from './table-link.component';
import { provideRouter, Router } from '@angular/router';
import { Principal } from '../../auth/principal.service';

describe('TableLinkComponent', () => {
    let component: TableLinkComponent;
    let fixture: ComponentFixture<TableLinkComponent>;
    let router: Router;
    const principalMock = {
        hasAnyAuthority: jest.fn<Promise<boolean>, [string[]]>(),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [],
            providers: [provideRouter([]), { provide: Principal, useValue: principalMock }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TableLinkComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);
        jest.spyOn(router, 'navigate').mockResolvedValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('setzt hasAuthority und isLink korrekt (mit Berechtigung)', fakeAsync(() => {
        principalMock.hasAnyAuthority.mockResolvedValueOnce(true);
        component.link = 'mitarbeiter';
        component.linkText = 'Details';
        component.linkId = 123;
        component.isAdminOrZentraleMA = false;

        fixture.detectChanges();
        tick();

        expect(component.hasAuthority).toBe(true);
        expect(component.isLink).toBe(true);
    }));

    it('setzt isLink auf false, wenn Text, ID oder Link fehlen/leer sind', fakeAsync(() => {
        principalMock.hasAnyAuthority.mockResolvedValueOnce(true);

        component.link = 'mitarbeiter';
        component.linkText = '   ';

        fixture.detectChanges();
        tick();

        expect(component.isLink).toBe(false);
    }));

    it('setzt Zusatz auf default "edit" wenn Link "dolmetscher" ist', fakeAsync(() => {
        principalMock.hasAnyAuthority.mockResolvedValueOnce(true);

        component.link = 'dolmetscher';
        component.linkText = 'Öffnen';
        // kein modus gesetzt -> default 'edit'
        component.linkId = 5;
        component.page = 2;
        component.selected = 42;

        fixture.detectChanges();
        tick();

        component.navigateTo();

        expect(router.navigate).toHaveBeenCalledWith(['/dolmetscher', 5, 'edit'], { queryParams: { selected: 42, page: 2 } });
    }));

    it('verwendet uebergebenen Modus bei "dolmetscher-buro"', fakeAsync(() => {
        principalMock.hasAnyAuthority.mockResolvedValueOnce(true);

        component.link = 'dolmetscher-buro';
        component.linkText = 'Anzeigen';
        component.modus = 'view';
        component.linkId = 7;
        component.page = 2;
        component.selected = 42;

        fixture.detectChanges();
        tick();

        component.navigateTo();

        expect(router.navigate).toHaveBeenCalledWith(['/dolmetscher-buro', 7, 'view'], { queryParams: { selected: 42, page: 2 } });
    }));

    it('navgiert ohne Zusatz, wenn Link nicht "dolmetscher*" ist', fakeAsync(() => {
        principalMock.hasAnyAuthority.mockResolvedValueOnce(true);

        component.link = 'mitarbeiter';
        component.linkText = 'NACHNAME Vorname (babs)';
        component.linkId = 1;

        fixture.detectChanges();
        tick();

        component.navigateTo();

        expect(router.navigate).toHaveBeenCalledWith(['/mitarbeiter', 1], { queryParams: { selected: 0, page: 0 } });
    }));

    it('navigiert nicht, wenn link oder linkId fehlen', fakeAsync(() => {
        component.linkText = 'NACHNAME Vorname (babs)';

        component.link = undefined;
        component.linkId = undefined;
        component.navigateTo();

        expect(router.navigate).not.toHaveBeenCalled();
    }));
});
