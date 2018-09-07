import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Services from '../../services/index';
import * as Models from '../../models/index';

@Component({
    selector: 'item-list',
    templateUrl: './itemlist.component.html'
})
export class ItemListComponent implements OnInit, OnDestroy {
    connection;

    private mUsers: any[] = [];
    private mSelectedUser: Models.User = new Models.User();
    private mSelectedRow: number;

    constructor(
        private httpClient: Services.HttpClient,
        private notificationService: Services.NotificationService) {
    }

    ngOnInit(): void {
        this.notificationService.connect();
        this.connection = this.notificationService.getMessages().subscribe(message => {
            this.InitializeUsers(message);
        });
    }

    ngOnDestroy(): void {
        this.connection.unsubscribe();
    }

    get Users(): any[] {
        return this.mUsers;
    }

    get SelectedUser(): Models.User {
        return this.mSelectedUser;
    }

    get SelectedRow(): number {
        return this.mSelectedRow;
    }

    async GetUsers() {
        this.mUsers = [];
        this.httpClient.UseHeader();
        let data = await this.httpClient.Get('http://localhost:9981/users');
        this.InitializeUsers(data);
    }

    private InitializeUsers(data: any) {
        for (let item in data) {
            let raw = data[item];
            let rawdata = JSON.parse(raw);
            let user = new Models.User();
            user.Username = rawdata.username;
            user.Password = rawdata.password;
            user.Email = rawdata.email;
            this.mUsers.push(user);
        }
    }

    async UpdateSelected() {
        let raw = { username: this.mSelectedUser.Username, password: this.mSelectedUser.Password, email: this.mSelectedUser.Email };
        await this.httpClient.Post('http://localhost:9981/users', raw);
        this.GetUsers();
    }

    async DeleteSelected() {
        await this.httpClient.Delete(`http://localhost:9981/user/${this.mSelectedUser.Username}`);
        this.GetUsers();
    }

    OnSelect(user: Models.User, row: number): void {
        this.mSelectedUser.Username = user.Username;
        this.mSelectedUser.Password = user.Password;
        this.mSelectedUser.Email = user.Email;
        this.mSelectedRow = row;
    }
}
