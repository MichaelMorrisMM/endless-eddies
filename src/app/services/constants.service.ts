import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

    constructor() {
    }

    public static readonly URL_PREFIX: string = 'http://localhost:8080/endless-eddies';
    public readonly DIRTY_NOTE_MESSAGE: string = 'Changes have not been saved';
    public static readonly VALIDATOR_TYPE_REQUIRED: string = "required";
    public static readonly VALIDATOR_TYPE_MIN: string = "min";
    public static readonly VALIDATOR_TYPE_MAX: string = "max";
    public static readonly VALIDATOR_TYPE_MIN_LENGTH: string = "minlength";
    public static readonly VALIDATOR_TYPE_MAX_LENGTH: string = "maxlength";

}
