import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpComponent } from './help.component';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { of, Subject } from 'rxjs';
import { BabsEventManager } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-event-manager';
import { provideHttpClient } from '@angular/common/http';

describe('HelpComponent', () => {
    let component: HelpComponent;
    let fixture: ComponentFixture<HelpComponent>;

    const mockTranslateService = {
        stream: jest.fn(),
    };
    const mockEventManager = {
        subscribe: jest.fn(),
        broadcast: jest.fn(),
    };
    const mockCookieService = {
        get: jest.fn(),
    };
    const mockCdr = {
        markForCheck: jest.fn(),
    };
    const mockElementRef = {
        nativeElement: {
            getBoundingClientRect: jest.fn().mockReturnValue({ bottom: 50, right: 100 }),
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [], // Include standalone component
            providers: [
                provideHttpClient(),
                { provide: TranslateService, useValue: mockTranslateService },
                { provide: BabsEventManager, useValue: mockEventManager },
                { provide: CookieService, useValue: mockCookieService },
                { provide: ChangeDetectorRef, useValue: mockCdr },
                { provide: ElementRef, useValue: mockElementRef },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(HelpComponent);
        component = fixture.componentInstance;

        mockEventManager.subscribe.mockReturnValue(new Subject()); // Mock event subscription

        fixture.detectChanges(); // Trigger lifecycle methods
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('ngAfterContentInit', () => {
        it('should set helpNotAvailable and isHelpActivated to false if cookie "babsHelp" is not true', () => {
            mockCookieService.get.mockReturnValue('false');
            component.ngAfterContentInit();
            expect(component.isHelpActivated).toBe(false);
        });

        /*it('should translate the help key if present and not "doNotTranslate"', () => {
            const mockTranslation = 'Translated Help Text';
            mockCookieService.get.mockReturnValue('true');
            component.babsHelp = 'HELP_KEY';
            mockTranslateService.stream.mockReturnValue(of(mockTranslation));

            component.ngAfterContentInit();

            expect(component.helpNotAvailable).toBe(false);
            expect(component.helpText).toBe(mockTranslation);
        });

        it('should not translate the help key if "doNotTranslate" is true', () => {
            component.babsHelp = 'HELP_KEY';
            component.doNotTranslate = true;

            component.ngAfterContentInit();

            expect(mockTranslateService.stream).not.toHaveBeenCalled();
            expect(component.helpText).toBe('HELP_KEY');
            expect(component.helpNotAvailable).toBe(false);
        });*/
    });

    describe('ngOnDestroy', () => {
        it('should unsubscribe from subscriptions', () => {
            const spy = jest.spyOn(component['sub'], 'unsubscribe');
            component.ngOnDestroy();
            expect(spy).toHaveBeenCalled();
        });
    });
});
