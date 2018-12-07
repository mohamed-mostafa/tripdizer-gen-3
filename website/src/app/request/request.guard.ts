import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';

/* Services */
import { RequestService } from './request.service';

@Injectable({
  providedIn: 'root',
})
export class RequestGuard implements CanActivate {

  constructor(private service: RequestService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.service.setRequestType(route.queryParams);
  }

}
