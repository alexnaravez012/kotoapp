import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { City } from '../types/city';


@Injectable()
export class CityService {

  private cities: City[];


  constructor() {
      
  }

  setCities(cities){
      this.cities = cities;
  }




  getPorts(page?: number, size?: number): City[] {
    let cities2 = [];

    this.cities.forEach(city => {
        cities2.push(city);
    });

    if (page && size) {
      cities2 = cities2.slice((page - 1) * size, ((page - 1) * size) + size);
    }

    return cities2;
  }

  getCitiesAsync(page?: number, size?: number, timeout = 1000): Observable<City[]> {
    return new Observable<City[]>(observer => {
      observer.next(this.getPorts(page, size));
      observer.complete();
    }).pipe(delay(timeout));
  }
}
