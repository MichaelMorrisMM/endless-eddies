import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";
import {Application} from "../configurator/application.model";
import {ResultFile} from "../configurator/result-file.model";
import {AuthService} from "./auth.service";
import {Request} from "../requests/request.interface";
import {GetRequestResult} from "../requests/get-request-result.interface";

@Injectable()
export class ResultsService {

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    public submitRequest(application: Application, request: any): Observable<PostResult> {
        let params: HttpParams = this.authService.setXSRFPayloadToken(new HttpParams());
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/execute', JSON.stringify(request), {params: params});
    }

    public downloadFile(requestName: string, rf: ResultFile): Observable<Blob> {
        let params: HttpParams = new HttpParams()
            .set("requestName", requestName)
            .set("filename", rf.fileName);
        return this.http.get(ConstantsService.URL_PREFIX + '/download-file', {params: params, responseType: 'blob'});
    }

    public getRequest(idRequest: string): Observable<GetRequestResult> {
        let params: HttpParams = new HttpParams().set("idRequest", idRequest);
        return this.http.get<GetRequestResult>(ConstantsService.URL_PREFIX + '/get-request', {params: params});
    }

    public getAllRequests(): Observable<Request[]> {
        return this.http.get<Request[]>(ConstantsService.URL_PREFIX + '/get-requests');
    }

    public deleteRequest(idRequest: string): Observable<PostResult> {
        let params: HttpParams = new HttpParams()
            .set("idRequest", idRequest);
        params = this.authService.setXSRFPayloadToken(params);

        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/delete-request', null, {params: params});
    }

}
