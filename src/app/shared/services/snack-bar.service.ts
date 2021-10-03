import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SnackBarService {

    constructor() { }

    // Observable string sources
    private _success = new Subject<any>();
    private _error = new Subject<any>();
    onSuccess$ = this._success.asObservable();
    onError$ = this._error.asObservable();

    success(message: string): void {
        this._success.next({ message: message, });
    }

    error(message: string): void {
        this._error.next({ message: message });
    }
}