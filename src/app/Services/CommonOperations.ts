import {ElementRef, Injectable, NgZone} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Urlbase} from '../utils/urls';



@Injectable({
    providedIn:'root'
})
export class CommonOperations{
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    public mostrandoCargando = true;

    public ModalBuscadorProductos:HTMLIonModalElement = null;
    public ModalCarrito:HTMLIonModalElement = null;

    public ModalesLineas:Array<HTMLIonModalElement> = [];

    KeyboardH = 0;
    public MainScroll: ElementRef;

    constructor(
        private http: HttpClient,
        private ngZone:NgZone) {

    }
}
