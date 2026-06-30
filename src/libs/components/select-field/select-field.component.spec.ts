import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectFieldComponent } from './select-field.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { COOKIE_OPTIONS, COOKIE_WRITER, CookieOptionsProvider, CookieService } from 'ngx-cookie';
import { NGX_MASK_CONFIG } from 'ngx-mask';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SelectFieldComponent', () => {
    let component: SelectFieldComponent;
    let fixture: ComponentFixture<SelectFieldComponent>;

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
                NgForOf,
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

        fixture = TestBed.createComponent(SelectFieldComponent);
        component = fixture.componentInstance;

        // Initialize a mock FormGroup with a FormControl for the field
        component.formGroup = new FormGroup({
            testField: new FormControl(''), // Mock FormControl for field
        });

        // Set default component inputs
        component.fieldName = 'testField';
        component.isRequired = true;
        component.items = [
            { id: 1, label: 'Option 1' },
            { id: 2, label: 'Option 2' },
        ];
    });

    it('should create the component', () => {
        fixture.detectChanges(); // Trigger the Angular lifecycle
        expect(component).toBeTruthy(); // Ensures the component initializes correctly
    });

    describe('ngOnInit', () => {
        it('should initialize input bindings and control correctly', () => {
            component.ngOnInit(); // Call ngOnInit explicitly

            // Check input bindings
            expect(component.id).toBe('field_testField');
            expect(component.name).toBe('testField');
            expect(component.label).toBe('babsappApp.dolmetscher.testField.label');
            expect(component.labelValues).toBe('babsappApp.dolmetscher.testField.values.');
            expect(component.labelHelp).toBe('dolmetscher.field.testField');
            expect(component.labelStatic).toBe('TestField');
            expect(component.patternKey).toBe('pattern-testField');

            // Check FormControl initialization
            expect(component.control).toBeTruthy();
            expect(component.control).toBe(component.formGroup.get('testField'));
        });

        it('should set a default patternKey if none is provided', () => {
            component.patternKey = undefined; // Ensure patternKey is undefined
            component.ngOnInit();

            expect(component.patternKey).toBe('pattern-testField');
        });

        it('should not overwrite patternKey if it is provided', () => {
            const customPattern = 'custom-pattern';
            component.patternKey = customPattern;

            component.ngOnInit();

            expect(component.patternKey).toBe(customPattern);
        });
    });

    describe('Template Integration', () => {
        it('should render the correct number of select options', () => {
            component.items = [
                { id: 1, label: 'Option 1' },
                { id: 2, label: 'Option 2' },
                { id: 3, label: 'Option 3' },
            ];
            fixture.detectChanges();

            // Query all <option> elements in the template
            const optionElements = fixture.nativeElement.querySelectorAll('option');

            expect(optionElements.length).toBe(4);
        });

        it('should bind label and required attributes correctly', () => {
            component.isRequired = true;
            component.label = 'Select a value';
            fixture.detectChanges();

            const selectElement: HTMLSelectElement = fixture.nativeElement.querySelector('select');
            const labelElement: HTMLElement = fixture.nativeElement.querySelector('label');

            expect(selectElement.required).toBe(true);
            expect(labelElement.textContent).toContain('babsappApp.dolmetscher.testField.label');
        });
    });
});
