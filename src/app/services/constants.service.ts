import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {

    constructor() {
    }

    public static readonly URL_PREFIX: string = '/endless-eddies';
    public readonly DIRTY_NOTE_MESSAGE: string = 'Changes have not been saved';
    public static readonly VALIDATOR_TYPE_REQUIRED: string = "required";
    public static readonly VALIDATOR_TYPE_MIN: string = "min";
    public static readonly VALIDATOR_TYPE_MAX: string = "max";
    public static readonly VALIDATOR_TYPE_MIN_LENGTH: string = "minlength";
    public static readonly VALIDATOR_TYPE_MAX_LENGTH: string = "maxlength";
    public static readonly XSRF_TOKEN: string = "xsrfToken";

    public static readonly GRAPH_VERT_BAR: string = "Vertical Bar Chart";
    public static readonly GRAPH_HOR_BAR: string = "Horizontal Bar Chart";
    public static readonly GRAPH_PIE: string = "Pie Chart";

    public GRAPH_TYPES: string[] = [
        ConstantsService.GRAPH_VERT_BAR,
        ConstantsService.GRAPH_HOR_BAR,
        ConstantsService.GRAPH_PIE,
    ];
}
