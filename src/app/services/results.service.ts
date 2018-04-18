import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from "rxjs/operators";
import {ConstantsService} from './constants.service';
import {PostResult} from "../configurator/post-result.interface";

@Injectable()
export class ResultsService {

    public lastResult: PostResult;

    constructor(private http: HttpClient) {
    }

    public submitRequest(request: any): Observable<PostResult> {
        return this.http.post<PostResult>(ConstantsService.URL_PREFIX + '/execute', JSON.stringify(request)).pipe(map((result: PostResult) => {
            this.lastResult = result;
            return result;
        }));
    }

}
