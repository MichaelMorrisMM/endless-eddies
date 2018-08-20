import {Component, OnInit} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from '../configurator/config.interface';
import {ResultsService} from '../services/results.service';
import {ResultFile} from "../configurator/result-file.model";
import {saveAs} from "../../../node_modules/file-saver";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {GetRequestResult} from "../requests/get-request-result.interface";
import {Request} from "../requests/request.interface";
import {Application} from "../configurator/application.model";

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styles: []
})

export class ResultsComponent implements OnInit {
    public config: Config;
    public request: Request;
    public application: Application;
    public result: GetRequestResult;

    constructor(private configuratorService: ConfiguratorService,
                private resultsService: ResultsService,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.configuratorService.getConfiguration().subscribe((response: Config) => {
            this.config = response;
        });

        this.route.paramMap.forEach((map: ParamMap) => {
            let idRequest: string = map.get("idRequest");

            this.request = null;
            this.application = null;
            this.result = null;

            this.resultsService.getRequest(idRequest).subscribe((result: GetRequestResult) => {
                if (result.success && result.request && result.application && result.systemOut) {
                    this.result = result;
                    this.request = result.request;
                    this.application = result.application;
                } else {
                    alert(result.message);
                }
            });
        });
    }

    public downloadFile(rf: ResultFile): void {
        if (this.request) {
            this.resultsService.downloadFile(this.request.name, rf).subscribe((blob: Blob) => {
                saveAs(blob, rf.fileName);
            });
        }
    }

    public backToAllResults(): void {
        this.router.navigateByUrl('/all-results');
    }
}
