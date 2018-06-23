import {Component, OnInit} from '@angular/core';
import {User} from "../login/user.interface";
import {UsersService} from "../services/users.service";

@Component({
    selector: 'manage-users',
    templateUrl: './manage-users.component.html',
    styles: [`
        div.grid-div {
            height: 500px;
        }
    `]
})
export class ManageUsersComponent implements OnInit {
    public userList: User[] = [];
    public gridColumnDefs: any[] = [];

    constructor(private usersService: UsersService) {
    }

    ngOnInit() {
        this.gridColumnDefs = [
            {headerName: 'Email', field: 'email'},
            {headerName: 'Is Admin', field: 'isAdmin'},
        ];
        this.loadUsers();
    }

    private loadUsers(): void {
        this.userList = [];
        this.usersService.getManageUsersList().subscribe((list: User[]) => {
            this.userList = list;
        });
    }

}
