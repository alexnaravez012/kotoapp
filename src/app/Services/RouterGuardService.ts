import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";

@Injectable({
    providedIn: "root"
})
export class RouterGuardService implements CanActivate {
    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot) {
        console.log(route);

        if(localStorage.getItem("RouterHome") == "true"){
            return this.router.parseUrl('/home');
        }
        // let authInfo = {
        //     authenticated: false
        // };
        //
        // if (!authInfo.authenticated) {
        //     this.router.navigate(["login"]);
        //     return false;
        // }

        return true;
    }
}
