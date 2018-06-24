import {Component, OnInit} from '@angular/core';
import {User} from "../login/user.interface";
import {UsersService} from "../services/users.service";
import {GridReadyEvent, SelectionChangedEvent} from "ag-grid";
import {PostResult} from "../configurator/post-result.interface";

@Component({
    selector: 'manage-users',
    templateUrl: './manage-users.component.html',
    styles: [`
        div.grid-div {
            height: 600px;
        }
    `]
})
export class ManageUsersComponent implements OnInit {
    public userList: User[] = [];
    public selectedList: User[] = [];
    public gridColumnDefs: any[] = [];

    public disableNormal: boolean = true;
    public disableAdmin: boolean = true;
    public disableDelete: boolean = true;

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.gridColumnDefs = [
            {headerName: 'Email', field: 'email', checkboxSelection: true, headerCheckboxSelection: true},
            {headerName: 'Is Admin', field: 'isAdmin'},
        ];
        this.loadUsers();
    }

    private loadUsers(): void {
        this.userList = [];
        this.selectedList = [];
        this.resetButtons();
        this.usersService.getManageUsersList().subscribe((list: User[]) => {
            this.userList = list;
        });
    }

    private resetButtons(): void {
        this.disableNormal = true;
        this.disableAdmin = true;
        this.disableDelete = true;
    }

    public onGridReady(event: GridReadyEvent): void {
        event.api.sizeColumnsToFit();
    }

    public onGridSelectionChanged(event: SelectionChangedEvent): void {
        this.resetButtons();
        this.selectedList = event.api.getSelectedRows();
        if (this.selectedList.length > 0) {
            this.disableDelete = false;
        }
        for (let u of this.selectedList) {
            if (u.isAdmin) {
                this.disableNormal = false;
            } else {
                this.disableAdmin = false;
            }
        }
    }

    private handleAction(action: string): void {
        if (this.selectedList.length > 0) {
            this.usersService.manageUsers(action, this.selectedList).subscribe((result: PostResult) => {
                alert((result.success ? "Success: " : "Failure: ") + result.message);
                this.loadUsers();
            });
        }
    }

    public giveNormal(): void {
        this.handleAction(UsersService.ACTION_MAKE_NORMAL);
    }

    public giveAdmin(): void {
        this.handleAction(UsersService.ACTION_MAKE_ADMIN);
    }

    public deleteUsers(): void {
        this.handleAction(UsersService.ACTION_DELETE);
    }

}
