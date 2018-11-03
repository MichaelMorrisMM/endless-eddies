export interface Request {
    readonly idRequest: string;
    readonly name: string;
    readonly idUser: string;
    readonly idGuest: string;
    readonly userEmail: string;
    readonly date: number;
    readonly dateDisplay: string;
    readonly expiration: number;
    readonly expirationDisplay: string;
    readonly size: number;
    readonly applicationName: string;
}
