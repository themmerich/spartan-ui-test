/**
 * Usage: <span babsHelp="HILFETEXT-IDENTIFIER">
 *      Das <span> kann je nach Usecase das Hilfetext-Label umgeben, da das HTML-Template ein <ng-content></ng-content> beinhaltet
 *      Der 'HILFETEXT-IDENTIFIER' erschließt sich, bzw. muss auch in die i18n 'de.json eingetragen werden
 *      HTML ist in der de.json erlaubt, da wir hier mit [innerHTML] arbeiten
 */
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie';
import { animationFrameScheduler, Subscription } from 'rxjs';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { BabsEventManager } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-event-manager';
import { TRANSLATION_NOT_FOUND } from '@babs/babs-frontend-shared/lib/app.constants.shared';
import { BabsTranslatePipe } from '@babs/babs-frontend-shared/lib/jhipster-migration/babs-translate.pipe';

/**
 * Komponente zum Darstellen von Hilfetexten.
 */
@Component({
    selector: 'babs-help, [babsHelp]',
    templateUrl: './help.component.html',
    styleUrls: ['help.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgbPopover, BabsTranslatePipe],
})
export class HelpComponent implements AfterContentInit, OnDestroy {
    private element = inject(ElementRef);
    private translateService = inject(TranslateService);
    private babsEventManager = inject(BabsEventManager);
    private cookieService = inject(CookieService);
    private cdr = inject(ChangeDetectorRef);

    /**
     * Den Hilfetext als Schlüssel in den i18n JSON Dateien.
     */
    @Input() babsHelp: string;
    /**
     * Position für den Hilfetext, z.B. 'bottom-right'
     */
    @Input() helpPos: string;
    /**
     * Falls True, werden Hilfetexte nur mittels Popover angezeigt und können nicht via 'Klick' eingeblendet werden.
     */
    @Input() doNotOpenOnClick: boolean;
    /**
     * Falls True, werde Hilfetext wie es ist angezeigt, TranslateService wird nicht verwendet.
     */
    @Input() doNotTranslate: boolean;
    /**
     * Der übersetzte Hilfetext (wenn der Key in einer i18n JSON Dateien gefunden wird)
     */
    helpText: string;
    /**
     * True falls der Hilfetext nicht im i18n JSON Dateien gefunden worden ist.
     */
    helpNotAvailable: boolean;
    /**
     * Bereits angezeigter Hilfetext. Dessen Popover wird geschlossen bevor ein neues Popover angezeigt wird.
     */
    oldPopover: any;
    /**
     * Timer für die Anzeige des Popover
     */
    oldTimer: any;
    /**
     * True, falls Hilfe aktiviert ist (Über Schalter bzw. Cookie babsHelp)
     */
    isHelpActivated: boolean;
    isHelpOpen: boolean;
    private sub = new Subscription();

    /**
     * Erstellt die HelpComponent Komponente
     */
    constructor() {
        this.isHelpActivated = true;
    }

    /**
     * Zeigt den Hilfetext während Tastenkompination [Ctrl] + [Shift] + H ein / aus
     * @param event
     * @param popover
     */
    showHelpOnKeydown(event, popover) {
        const aPressed = event.key.toLowerCase() === '\u0001' || event.key.toLowerCase() === 'h';
        if (aPressed && event.ctrlKey && event.shiftKey) {
            if (this.isHelpOpen) {
                this.hideHelpOnMouseout(popover);
                this.isHelpOpen = false;
            } else {
                this.showHelpOnMouseover(popover);
                this.isHelpOpen = true;
            }
        }
    }

    /**
     * Bereitet den Hilfetext, damit den Text eingeblendet und ausgeblendet werden kann.
     */
    ngAfterContentInit(): void {
        if (this.cookieService.get('babsHelp')) {
            this.isHelpActivated = this.cookieService.get('babsHelp') === 'true';
        }
        if (!this.isHelpActivated) {
            return;
        }
        this.helpNotAvailable = true;
        const notFoundText = TRANSLATION_NOT_FOUND;

        animationFrameScheduler.schedule(() => {
            const elemPosBottom: number = this.element.nativeElement.getBoundingClientRect().bottom;
            const elemPosRight: number = this.element.nativeElement.getBoundingClientRect().right;
            if (this.helpPos === undefined) {
                const horizontal = window.innerWidth - elemPosRight < 250 ? 'right' : 'left';
                const vertical = window.innerHeight - elemPosBottom < 250 ? 'top' : 'bottom';
                this.helpPos = vertical + '-' + horizontal;
            }
            this.cdr.markForCheck();
        });
        if (this.babsHelp) {
            if (this.doNotTranslate) {
                this.helpText = this.babsHelp;
                this.helpNotAvailable = false;
            } else {
                this.sub.add(
                    this.translateService.stream('babsHelp.' + this.babsHelp).subscribe((hText) => {
                        if (!(hText.indexOf(notFoundText) > -1 || hText.length === 0)) {
                            this.helpNotAvailable = false;
                        } else {
                            // TODO: remove this else if help-texts have been delivered
                            if (hText.indexOf(notFoundText) > -1) {
                                console.log('DEVELOPER__', this.babsHelp);
                                // Es existiert kein KEY für 'babsHelp.' + this.babsHelp in der help.json <-- Developer, Developer, Developer
                            } else if (hText.length === 0) {
                                console.log('FACHBEREICH', this.babsHelp);
                                // Es existiert zwar ein KEY für 'babsHelp.' + this.babsHelp in der help.json aber kein VALUE <-- Productowner, Productowner, Productowner
                                this.helpText = null;
                            }
                        }
                        this.helpText = hText;
                        this.cdr.markForCheck();
                    })
                );
            }
        }

        this.sub.add(
            this.babsEventManager.subscribe('closeOldPopovers', (newPopover) => {
                // Schließe alte Popover aber schieße dir nicht selbst in den Fuss
                if (this.oldPopover && this.oldPopover !== newPopover.content) {
                    if (this.oldPopover.isOpen()) {
                        this.oldPopover.close();
                    }
                }
            })
        );
    }

    /**
     * Blendet den Hilfetext ein / aus.
     * @param popover Der Popover der ein/ausgeblendet werden soll.
     */
    toggleHelpOnClick(popover): void {
        if (!this.helpNotAvailable) {
            if (popover.isOpen()) {
                popover.close();
            } else {
                if (!this.doNotOpenOnClick) {
                    this.openPopover(popover);
                }
            }
        }
    }

    /**
     * Zeigt den Hilfetext während "mouse over" aber erst nach 200ms, damit unabsichliches
     * Berühren des Hilfetext-Icons nicht direkt zur Anzeige des Textes führt
     * @param popover Der Popover der geöfnet werden soll.
     */
    showHelpOnMouseover(popover): void {
        if (!this.helpNotAvailable) {
            this.oldTimer = setTimeout(() => {
                this.openPopover(popover);
            }, 200);
        }
    }

    /**
     * Blendet den Hilfetext aus
     * @param popover Den Popover der geschlossen werden soll.
     */
    hideHelpOnMouseout(popover): void {
        if (!this.helpNotAvailable) {
            if (this.oldPopover && !this.oldPopover.isOpen()) {
                clearTimeout(this.oldTimer);
            }
            setTimeout(() => {
                popover.close();
            }, 200);
        }
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    /**
     * private
     */
    private openPopover(popover): void {
        this.oldPopover = popover;
        popover.open();
        this.babsEventManager.broadcast({ name: 'closeOldPopovers', content: popover });
    }
}
