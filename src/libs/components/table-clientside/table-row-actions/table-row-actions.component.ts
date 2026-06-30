import { Component, input, output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { getFieldValue } from '../table-row-formatter';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'td[babsTableRowActions]',
    imports: [ButtonDirective],
    styles: `
        .btn-text {
            color: black;
        }
    `,
    templateUrl: './table-row-actions.component.html',
})
export class TableRowActionsComponent {
    readonly rowData = input.required<any>();
    readonly index = input.required<number>();

    readonly inTerminKontext = input(false);
    readonly isReadOnly = input(false);
    readonly showView = input(false);
    readonly showEdit = input(false);
    readonly showDelete = input(false);
    readonly showViewMitarbeiter = input(false);
    readonly showHistory = input(false);
    readonly showLocations = input(false);
    readonly showDownload = input(false);
    readonly showFile = input(false);
    readonly showAssign = input(false);
    readonly showAssignUser = input(false);
    readonly showRemoveUser = input(false);
    readonly showActivate = input(false);
    readonly showDeactivate = input(false);

    readonly view = output<any>();
    readonly edit = output<any>();
    readonly delete = output<any>();
    readonly viewMitarbeiter = output<any>();
    readonly history = output<any>();
    readonly locations = output<any>();
    readonly download = output<any>();
    readonly file = output<any>();
    readonly assign = output<any>();
    readonly assignUser = output<any>();
    readonly removeUser = output<any>();
    readonly activate = output<any>();
    readonly deactivate = output<any>();

    protected readonly getFieldValue = getFieldValue;
}
