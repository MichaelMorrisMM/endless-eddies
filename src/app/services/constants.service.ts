import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

    constructor() {
    }

    public static readonly URL_PREFIX: string = "http://localhost:8080/endless-eddies";

}