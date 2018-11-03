import {Component, OnInit} from '@angular/core';
import {GridReadyEvent, RowDoubleClickedEvent, SelectionChangedEvent} from "ag-grid-community";
import {ResultsService} from "../services/results.service";
import {Request} from "../requests/request.interface";
import {PostResult} from "../configurator/post-result.interface";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {ThemesService} from "../services/themes.service";
import {ValueFormatterParams} from "ag-grid-community/dist/lib/entities/colDef";

@Component({
    selector: 'all-results',
    templateUrl: './all-results.component.html',
    styles: [`
        div.grid-div {
            height: 600px;
            width: 75%;
        }
    `]
})
export class AllResultsComponent implements OnInit {
    public requestList: Request[] = [];
    public selectedRequest: Request;
    public gridColumnDefs: any[] = [];

    constructor(private resultsService: ResultsService,
                public authService: AuthService,
                private router: Router,
                public themesService: ThemesService) {
    }

    ngOnInit() {
        this.gridColumnDefs = [
            {headerName: 'Application', field: 'applicationName', checkboxSelection: true},
            {headerName: 'Date', field: 'date', valueFormatter: this.dateDisplayFormatter},
            {headerName: 'Expires', field: 'expiration', valueFormatter: this.expirationDisplayFormatter},
            {headerName: 'Size (bytes)', field: 'size', type: "numericColumn"},
        ];
        if (this.authService.getCurrentUser().isAdmin) {
            this.gridColumnDefs.push(
                {headerName: 'User Email', field: 'userEmail'}
            );
        }
        this.loadRequests();
    }

    private dateDisplayFormatter(params: ValueFormatterParams): any {
        return params.data.dateDisplay;
    }

    private expirationDisplayFormatter(params: ValueFormatterParams): any {
        return params.data.expirationDisplay;
    }

    private loadRequests(): void {
        this.requestList = [];
        this.selectedRequest = null;
        this.resultsService.getAllRequests().subscribe((list: Request[]) => {
            this.requestList = list;
        });
    }

    public onGridReady(event: GridReadyEvent): void {
        event.api.sizeColumnsToFit();
    }

    public onGridSelectionChanged(event: SelectionChangedEvent): void {
        let selectedRows: Request[] = event.api.getSelectedRows();
        if (selectedRows.length > 0) {
            this.selectedRequest = selectedRows[0];
        } else {
            this.selectedRequest = null;
        }
    }

    public onGridRowDoubleClicked(event: RowDoubleClickedEvent): void {
        if (event && event.node && event.node.data && event.node.data.idRequest) {
            this.viewRequest(event.node.data.idRequest);
        }
    }

    public viewRequest(idRequest?: string): void {
        let id: string;
        if (idRequest) {
            id = idRequest;
        } else if (this.selectedRequest) {
            id = this.selectedRequest.idRequest;
        }
        if (id) {
            this.router.navigate(['/results', id]);
        }
    }

    public deleteRequest(): void {
        if (this.selectedRequest) {
            this.resultsService.deleteRequest(this.selectedRequest.idRequest).subscribe((result: PostResult) => {
                if (result.success) {
                    this.loadRequests();
                } else {
                    alert(result.message);
                }
            });
        }
    }

    public deleteExpiredResults(): void {
        if (this.authService.getCurrentUser().isAdmin) {
            this.resultsService.deleteExpiredResults().subscribe((result: PostResult) => {
                if (result.success) {
                    this.loadRequests();
                }
                alert(result.message);
            });
        }
    }

}
