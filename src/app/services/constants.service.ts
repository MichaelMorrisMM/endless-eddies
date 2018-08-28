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

    public readonly GRAPH_VERT_BAR: string = "Vertical Bar Chart";
    public readonly GRAPH_HOR_BAR: string = "Horizontal Bar Chart";
    public readonly GRAPH_PIE: string = "Pie Chart";

    public GRAPH_TYPES: string[] = [
        this.GRAPH_VERT_BAR,
        this.GRAPH_HOR_BAR,
        this.GRAPH_PIE,
    ];

    public static readonly GRAPH_TOOLTIP_SINGLE_SERIES: string = 'Data source must be a json file formatted with single series data (e.g. [{"name": "Germany", "value": 100}, {"name": "USA", "value": 200}])';
    public static readonly GRAPH_TOOLTIP_MULTI_SERIES: string = 'Data source must be a json file formatted with multi series data (e.g. [{"name": "Germany", "series": [{ "name": "2010", "value": 100}, {"name": "2011", "value": 200}]}, {"name": "USA", "series": [{ "name": "2010", "value": 500}, {"name": "2011", "value": 15}]}])';

    public getGraphDataSourceTooltip(type: string): string {
        if (type == this.GRAPH_VERT_BAR || type === this.GRAPH_HOR_BAR || type === this.GRAPH_PIE) {
            return ConstantsService.GRAPH_TOOLTIP_SINGLE_SERIES;
        } else {
            return '';
        }
    }
}
