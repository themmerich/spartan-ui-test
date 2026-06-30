import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFieldComponent } from './input-field.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NGX_MASK_CONFIG, NgxMaskDirective } from 'ngx-mask';
import { ExtFormControlNameDirective } from '../../directives/formcontrolname-ext.directive';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { COOKIE_OPTIONS, COOKIE_WRITER, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('InputFieldComponent', () => {
    let component: InputFieldComponent;
    let fixture: ComponentFixture<InputFieldComponent>;

    beforeEach(async () => {
        const mockCookieWriter = {
            readAllAsString: jest.fn().mockReturnValue(''),
            write: jest.fn(),
        };

        function HttpLoaderFactory(httpClient: HttpClient) {
            return new TranslateHttpLoader(httpClient, 'assets/i18n/', '.json');
        }

        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                ExtFormControlNameDirective,
                NgxMaskDirective,
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useFactory: HttpLoaderFactory,
                        deps: [HttpClient],
                    },
                }),
            ],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                CookieService,
                CookieOptionsProvider,
                { provide: COOKIE_OPTIONS, useValue: {} },
                { provide: COOKIE_WRITER, useValue: mockCookieWriter },
                { provide: NGX_MASK_CONFIG, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;

        const parentFormGroup = new FormGroup({
            kontaktdatenform: new FormGroup({
                testField: new FormControl(''),
            }),
        });
        component.formGroup = parentFormGroup.controls.kontaktdatenform as FormGroup;

        component.fieldName = 'testField'; // Reference the form control by name
        component.placeholder = 'Enter text';
        component.type = 'text';
    });

    it('should create the component', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    describe('ngOnInit', () => {
        it('should initialize component inputs and control correctly', () => {
            // Call ngOnInit explicitly
            component.ngOnInit();

            // Check component inputs are mapped correctly
            expect(component.id).toBe('field_testField');
            expect(component.name).toBe('testField');
            expect(component.label).toBe('babsappApp.dolmetscher.testField');
            expect(component.labelHelp).toBe('dolmetscher.field.testField');
            expect(component.labelStatic).toBe('TestField');
            expect(component.patternKey).toBe('pattern-testField');

            // Check control is assigned correctly
            expect(component.control).toBeTruthy();
            expect(component.control).toBe(component.formGroup.get('testField'));
        });

        it('should set a default patternKey if not provided', () => {
            component.patternKey = undefined; // Clear patternKey value
            component.ngOnInit();

            expect(component.patternKey).toBe('pattern-testField');
        });

        it('should not overwrite patternKey if already provided', () => {
            component.patternKey = 'custom-pattern';
            component.ngOnInit();

            expect(component.patternKey).toBe('custom-pattern');
        });
    });

    describe('onInput', () => {
        it('should toggle the hidden property based on input value', () => {
            // Simulate an input event with a non-empty value
            const mockEvent = { target: { value: 'Test Value' } };
            component.onInput(mockEvent);
            expect(component.hidden).toBe(true);

            // Simulate an input event with an empty value
            mockEvent.target.value = '';
            component.onInput(mockEvent);
            expect(component.hidden).toBe(false);
        });
    });

    describe('Template Integration', () => {
        it('should bind input attributes correctly', () => {
            // Update the placeholder, type, and other attributes
            component.placeholder = 'Test Placeholder';
            component.type = 'text';
            fixture.detectChanges();

            // Query the input element from the rendered template
            const inputElement: HTMLInputElement = fixture.nativeElement.querySelector('input');

            // Assert input properties
            expect(inputElement).toBeTruthy();
            expect(inputElement.getAttribute('placeholder')).toBe('Test Placeholder');
            expect(inputElement.getAttribute('type')).toBe('text');
        });

        it('should show the info message when showInfo is true', () => {
            component.showInfo = true;
            component.hidden = false;
            fixture.detectChanges();

            // Check if the info text is rendered in the DOM
            const infoMessageElement = fixture.nativeElement.querySelector('small');
            expect(infoMessageElement).toBeTruthy();
            expect(infoMessageElement.textContent).toContain('babsappApp.dolmetscher.telefon1NichtHinterlegt');
        });

        it('should hide the info message when showInfo is false', () => {
            component.showInfo = false;
            fixture.detectChanges();

            // Check that the info message is NOT rendered in the DOM
            const infoMessageElement = fixture.nativeElement.querySelector('.info-text');
            expect(infoMessageElement).toBeFalsy();
        });
    });
});
