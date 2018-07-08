export interface Request {
    readonly idRequest: string;
    readonly name: string;
    readonly idUser: string;
    readonly userEmail: string;
    readonly date: string;
    readonly expiration: string;
    readonly size: number;
}
