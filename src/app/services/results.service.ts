import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";
import {Application} from "../configurator/application.model";
import {ResultFile} from "../configurator/result-file.model";
import {AuthService} from "./auth.service";
import {Request} from "../requests/request.interface";
import {GetRequestResult} from "../requests/get-request-result.interface";
import {CheckStatusResult} from "../requests/check-status-result.interface";

@Injectable()
export class ResultsService {

    constructor(private http: HttpClient,
                private authService: AuthService) {
    }

    public submitRequest(application: Application, request: FormData): Observable<PostResult> {
        let headers: HttpHeaders = this.authService.setXSRFPayloadTokenHeader(new HttpHeaders());
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/execute', request, {headers: headers});
    }

    public downloadFile(requestName: string, rf: ResultFile): Observable<HttpResponse<Blob>> {
        let params: HttpParams = new HttpParams()
            .set("requestName", requestName)
            .set("filename", rf.filename);
        return this.http.get(ConstantsService.URL_PREFIX + '/download-file', {params: params, responseType: 'blob', observe: 'response'});
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

        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/delete-request', params.toString(), {headers: headers});
    }

    public deleteExpiredResults(): Observable<PostResult> {
        let params: HttpParams = this.authService.setXSRFPayloadToken(new HttpParams());
        let headers: HttpHeaders = new HttpHeaders().set("Content-Type", "application/x-www-form-urlencoded");
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/manage-expired-results', params.toString(), {headers: headers});
    }

    public checkStatus(requestName: string): Observable<CheckStatusResult> {
        let params: HttpParams = new HttpParams().set("requestName", requestName);
        return this.http.get<CheckStatusResult>(ConstantsService.URL_PREFIX + '/check-status', {params: params});
    }

}
