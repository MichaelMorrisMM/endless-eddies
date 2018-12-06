import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ConfiguratorService} from '../services/configurator.service';
import {Config} from '../configurator/config.interface';
import {ResultsService} from '../services/results.service';
import {ResultFile} from "../configurator/result-file.model";
import {saveAs} from "../../../node_modules/file-saver";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {GetRequestResult} from "../requests/get-request-result.interface";
import {Request} from "../requests/request.interface";
import {Application} from "../configurator/application.model";

import * as html2canvas from "html2canvas";
import {ThemesService} from "../services/themes.service";
import {HttpResponse} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styles: [`
        div.graph-container {
            width: 80%;
            height: 300px;
        }
    `]
})

export class ResultsComponent implements OnInit {
    public config: Config;
    public request: Request;
    public application: Application;
    public result: GetRequestResult;

    public inlineFiles: ResultFile[];

    @ViewChild("graphContainer") graphContainer: ElementRef;

    public graphResults: any[];

    constructor(private configuratorService: ConfiguratorService,
                private resultsService: ResultsService,
                private route: ActivatedRoute,
                private router: Router,
                public themesService: ThemesService,
                private sanitizer: DomSanitizer) {
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
            this.graphResults = null;
            this.inlineFiles = [];

            this.resultsService.getRequest(idRequest).subscribe((result: GetRequestResult) => {
                if (result.success && result.request && result.application) {
                    this.result = result;
                    this.request = result.request;
                    this.application = result.application;
                    this.graphResults = result.graphResults;

                    let inlineFilesTemp: ResultFile[] = this.application.resultFiles.filter((rf: ResultFile) => {
                        return rf.displayInline;
                    });
                    for (let inlineFile of inlineFilesTemp) {
                        this.resultsService.downloadFile(this.request.name, inlineFile).subscribe(
                            (res: HttpResponse<Blob>) => {
                                let contentDisposition: string = res.headers.get('Content-Disposition');
                                if (contentDisposition && contentDisposition.includes('attachment')) {
                                    inlineFile.src = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(res.body));
                                    this.inlineFiles.push(inlineFile);
                                } else {
                                    alert('An error occurred while downloading an image');
                                }
                            },
                            null,
                            () => {
                                this.inlineFiles.sort((a, b) => a.sortOrder - b.sortOrder);
                            });
                    }
                } else {
                    alert(result.message);
                }
            });
        });
    }

    public downloadFile(rf: ResultFile): void {
        if (this.request) {
            this.resultsService.downloadFile(this.request.name, rf).subscribe((res: HttpResponse<Blob>) => {
                let contentDisposition: string = res.headers.get("Content-Disposition");
                if (contentDisposition && contentDisposition.includes('attachment')) {
                    let filename: string = contentDisposition.substring(contentDisposition.indexOf('"') + 1, contentDisposition.lastIndexOf('"'));
                    saveAs(res.body, filename);
                } else {
                    alert("An error occurred while downloading the file");
                }
            });
        }
    }

    public printGraphs(): void {
        if (this.application.graphs && this.application.graphs.length > 0 && this.graphResults) {
            let printWindow = window.open();
            printWindow.document.open();
            html2canvas(this.graphContainer.nativeElement).then((canvas) => {
                printWindow.document.write('<img style="width: 100%;" src="' + canvas.toDataURL() + '" />');
                printWindow.document.close(); // necessary for IE >= 10
                printWindow.addEventListener("load", function() {
                    printWindow.focus(); // necessary for IE >= 10
                    printWindow.print();
                    printWindow.close();
                });
            });
        }
    }

    public backToAllResults(): void {
        this.router.navigateByUrl('/all-results');
    }
}
