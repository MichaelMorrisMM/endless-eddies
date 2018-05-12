import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from "rxjs/operators";
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";
import {Application} from "../configurator/application.model";
import {ResultFile} from "../configurator/result-file.model";

@Injectable()
export class ResultsService {

    public lastResult: PostResult;
    public lastResultApplication: Application;

    constructor(private http: HttpClient) {
    }

    public submitRequest(application: Application, request: any): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/execute', JSON.stringify(request)).pipe(map((result: PostResult) => {
            this.lastResult = result;
            this.lastResultApplication = application;
            return result;
        }));
    }

    public downloadFile(requestName: string, rf: ResultFile): Observable<Blob> {
        let params: HttpParams = new HttpParams()
            .set("requestName", requestName)
            .set("filename", rf.fileName);
        return this.http.get(ConstantsService.URL_PREFIX + '/download-file', {params: params, responseType: 'blob'});
    }

}
