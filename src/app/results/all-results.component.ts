import {Component, OnInit} from '@angular/core';
import {GridReadyEvent, SelectionChangedEvent} from "ag-grid";
import {ResultsService} from "../services/results.service";
import {Request} from "../requests/request.interface";
import {PostResult} from "../configurator/post-result.interface";

@Component({
    selector: 'all-results',
    templateUrl: './all-results.component.html',
    styles: [`
        div.grid-div {
            height: 600px;
        }
    `]
})
export class AllResultsComponent implements OnInit {
    public requestList: Request[] = [];
    public selectedRequest: Request;
    public gridColumnDefs: any[] = [];

    constructor(private resultsService: ResultsService) {
    }

    ngOnInit() {
        this.gridColumnDefs = [
            {headerName: 'ID', field: 'idRequest', checkboxSelection: true},
            {headerName: 'Name', field: 'name'},
        ];
        this.loadRequests();
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

    public viewRequest(): void {
        if (this.selectedRequest) {
            // TODO
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

}
