import {Component, OnInit} from '@angular/core';
import {ResultsService} from "../services/results.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {CheckStatusResult} from "./check-status-result.interface";

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styles: [`
    `]
})
export class LoadingComponent implements OnInit {

    public label: string = "";
    private timer: any;

    constructor(private resultsService: ResultsService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.label = "Your request is enqueued and will finish shortly";

        this.route.paramMap.forEach((map: ParamMap) => {
            let requestName: string = map.get("requestName");

            this.timer = setInterval(() => {
                this.resultsService.checkStatus(requestName).subscribe((result: CheckStatusResult) => {
                    if (result && result.idRequest) {
                        clearInterval(this.timer);
                        this.router.navigate(['/results', result.idRequest]);
                    } else if (result && result.error) {
                        clearInterval(this.timer);
                        alert(result.error);
                        this.router.navigateByUrl('/home');
                    }
                });
            }, 5000);
        });
    }

}
