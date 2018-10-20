import { Injectable } from '@angular/core';
import {colorSets} from "@swimlane/ngx-charts/release/utils";

@Injectable()
export class ConstantsService {

    constructor() {
    }

    public static readonly GOOGLE_OAUTH_CLIENT_ID: string = '700225778985-vcmmj9gk7v17rh6app9cak2o70ht4469.apps.googleusercontent.com';
    public static readonly URL_PREFIX: string = '/endless-eddies';
    public readonly DIRTY_NOTE_MESSAGE: string = 'Changes have not been saved';
    public static readonly VALIDATOR_TYPE_REQUIRED: string = "required";
    public static readonly VALIDATOR_TYPE_MIN: string = "min";
    public static readonly VALIDATOR_TYPE_MAX: string = "max";
    public static readonly VALIDATOR_TYPE_MIN_LENGTH: string = "minlength";
    public static readonly VALIDATOR_TYPE_MAX_LENGTH: string = "maxlength";
    public static readonly VALIDATOR_TYPE_REGEX = "pattern";
    public static readonly VALIDATOR_TYPE_MOD = "modulo";
    public static readonly VALIDATOR_TYPE_MAX_SIZE = "maxSize";
    public static readonly XSRF_TOKEN: string = "xsrfToken";

    public readonly GRAPH_VERT_BAR: string = "Vertical Bar Chart";
    public readonly GRAPH_HOR_BAR: string = "Horizontal Bar Chart";
    public readonly GRAPH_PIE: string = "Pie Chart";
    public readonly GRAPH_LINE_CHART: string = "Line Chart";
    public readonly GRAPH_HEAT_MAP: string = "Heat Map";
    public readonly GRAPH_3D_COLUMN: string = "3D Column Chart";
    public readonly GRAPH_3D_PIE: string = "3D Pie Chart";
    public readonly GRAPH_3D_SCATTER: string = "3D Scatter Chart";

    public GRAPH_TYPES: string[] = [
        this.GRAPH_VERT_BAR,
        this.GRAPH_HOR_BAR,
        this.GRAPH_PIE,
        this.GRAPH_LINE_CHART,
        this.GRAPH_HEAT_MAP,
        this.GRAPH_3D_COLUMN,
        this.GRAPH_3D_PIE,
        this.GRAPH_3D_SCATTER,
    ];

    public static readonly GRAPH_TOOLTIP_SINGLE_SERIES: string = 'Data source must be a json file formatted with single series data (e.g. [{"name": "Germany", "value": 100}, {"name": "USA", "value": 200}])';
    public static readonly GRAPH_TOOLTIP_MULTI_SERIES: string = 'Data source must be a json file formatted with multi series data (e.g. [{"name": "Germany", "series": [{ "name": "2010", "value": 100}, {"name": "2011", "value": 200}]}, {"name": "USA", "series": [{ "name": "2010", "value": 500}, {"name": "2011", "value": 15}]}])';
    public static readonly GRAPH_TOOLTIP_HIGHCHARTS: string = 'Please reference https://www.highcharts.com/docs/chart-concepts/series. Data source must be a json file parsable as a "series" array for the corresponding graph type';

    public readonly GRAPH_COLOR_SCHEMES: any[] = colorSets;

    public getGraphDataSourceTooltip(type: string): string {
        if (type == this.GRAPH_VERT_BAR || type === this.GRAPH_HOR_BAR || type === this.GRAPH_PIE) {
            return ConstantsService.GRAPH_TOOLTIP_SINGLE_SERIES;
        } else if (type === this.GRAPH_LINE_CHART || type === this.GRAPH_HEAT_MAP) {
            return ConstantsService.GRAPH_TOOLTIP_MULTI_SERIES;
        } else if (type === this.GRAPH_3D_COLUMN || type === this.GRAPH_3D_PIE || type === this.GRAPH_3D_SCATTER) {
            return ConstantsService.GRAPH_TOOLTIP_HIGHCHARTS;
        } else {
            return '';
        }
    }

    public getGraphColorScheme(name: string): any {
        let filteredList: any[] = this.GRAPH_COLOR_SCHEMES.filter((scheme: any) => {
            return scheme.name === name;
        });
        if (filteredList.length === 1) {
            return filteredList[0];
        } else {
            return this.GRAPH_COLOR_SCHEMES[0];
        }
    }
}
