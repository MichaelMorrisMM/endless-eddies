export interface User {
    readonly idUser: string;
    readonly email: string;
    readonly isAdmin: boolean;
    xsrfToken?: string;
}
