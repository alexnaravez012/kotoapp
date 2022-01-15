import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import {AccountService} from '../Services/AccountService';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(
      public router: Router,
      public accountService: AccountService,
      public toastr: ToastrService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if(!request.url.includes("hereapi")){
      request = request.clone({
        withCredentials: true
      });
    }

    //return next.handle(request);
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      return event;
    },async (EventError:HttpErrorResponse) => {
      console.log("EventError2 es:");
      console.log(EventError);
      console.log(JSON.stringify(EventError));
      if(EventError.status == 401 && localStorage.getItem("SesionExpirada") != "true"){
        if(localStorage.getItem("SesionExpirada") != "true"){
          this.toastr.error('Su sesión ha Expirado, vuelva a iniciarla.');
        }
        this.accountService.ClearUserData();
        localStorage.setItem("SesionExpirada","true");
        localStorage.setItem("LastCheckClosestProv",null);
        localStorage.setItem("TiendaProv",null);
        this.goIndex();
        return new Observable<HttpEvent<any>>();
      }
    }));
  }

  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }
}
