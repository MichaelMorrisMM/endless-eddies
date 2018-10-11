export interface User {
    readonly idUser: string;
    readonly idGuest: string;
    readonly email: string;
    readonly isAdmin: boolean;
    readonly isGuest: boolean;
    readonly isExternal: boolean;
    readonly storageUsed: number;
    xsrfToken?: string;
}
