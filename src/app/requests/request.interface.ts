export interface Request {
    readonly idRequest: string;
    readonly name: string;
    readonly idUser: string;
    readonly idGuest: string;
    readonly userEmail: string;
    readonly date: string;
    readonly expiration: string;
    readonly size: number;
    readonly applicationName: string;
}
