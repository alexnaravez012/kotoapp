import {Injectable} from '@angular/core';

import {Third} from './copiados/third';
import {Session} from './session';
import {Person} from './models/person';
import {Token} from './token';
import {Menu} from './menu';
import {Rol} from './rol';

@Injectable({
    providedIn:'root'
})
export class LocalStorage {
    private isnav = false;
    private baseCaja = 0;
    private openedBox: boolean = false;
    //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
    private codigoDeBarras: String;
    //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
    private session: Session;
    private person: Person;
    private token: Token;
    private menu: Menu[];
    private third: Third;
    private rol: Rol[];
    private caja: Boolean = false;
    //------------------------LINEA PARA LUCHO-------------------------------
    private id_caja: number;
    //------------------------LINEA PARA LUCHO-------------------------------
    private id_store: number;

    private listaTipo: [number];

    private doIRefund: boolean = false;
    private idRefund: number = 0;

    //-----------MACHETE PARA DIRECCION Y TELEFONO
    private direccion: String;
    private telefono: String;
    //-----------MACHETE PARA DIRECCION Y TELEFONO


    constructor() {
        if (localStorage.getItem('currentUserSessionStore724')) {
            this.session = JSON.parse(localStorage.getItem('currentUserSessionStore724'));
        }

        //-------------------CAMBIO EN CAJA A ARCHIVO LOCAL--------------------------------------------
        //------------------------LINEA PARA LUCHO-------------------------------
        this.id_caja = 1;
        //------------------------LINEA PARA LUCHO-------------------------------
        //-------------------CAMBIO EN CAJA A ARCHIVO LOCAL--------------------------------------------

        this.id_store = 1;

        //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
        this.codigoDeBarras = "-1";
        //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO


        if (localStorage.getItem('currentUserPersonStore724')) {
            this.person = JSON.parse(localStorage.getItem('currentUserPersonStore724'));
        }
        if (localStorage.getItem('currentUserTokenStore724')) {
            this.token = JSON.parse(localStorage.getItem('currentUserTokenStore724'));
        }

        if (localStorage.getItem('currentUserMenuStore724')) {
            this.menu = JSON.parse(localStorage.getItem('currentUserMenusStore724'));
        }

        if (localStorage.getItem('currentUserRolStore724')) {
            this.rol = JSON.parse(localStorage.getItem('currentUserRolStore724'));
        }

        if (localStorage.getItem('currentThirdFatherStore724')) {
            this.rol = JSON.parse(localStorage.getItem('currentThirdFatherStore724'));
        }

    }

    private personClient: any;

    setPersonClient(elem) {
        this.personClient = elem;
    }

    getPersonClient() {
        return this.personClient;
    }

    setDoINav(elemn) {
        this.isnav = elemn;
    };

    getDoINav() {
        return this.isnav;
    }

    setBase(tel) {
        this.baseCaja = tel;
    }

    getBase() {
        return this.baseCaja;
    }

    //---------------MACHETE PARA DIRECCION Y TELEFONO

    setTelefono(tel) {
        this.telefono = tel;
    }

    getTelefono() {
        return this.telefono
    }

    setBoxStatus(op) {
        this.openedBox = op;
    }

    getBoxStatus() {
        return this.openedBox;
    }

    setDireccion(dir) {
        this.direccion = dir;
    }

    getDireccion() {
        return this.direccion
    }

    //_____________REFUND

    getDoIMakeRefund() {
        return this.doIRefund;
    }

    setDoIMakeRefund(state) {
        this.doIRefund = state;
    }

    getIdRefund() {
        return this.idRefund;
    }

    setIdRefund(state) {
        this.idRefund = state;
    }

    //---------------MACHETE PARA DIRECCION Y TELEFONO


    setTipo(lista) {
        this.listaTipo = lista;
    }

    getTipo() {
        return this.listaTipo;
    }

    //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
    setCodigoBarras(CB) {
        this.codigoDeBarras = CB;
    }

    getCodigoBarras() {
        return this.codigoDeBarras;
    }
    //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO

    getCaja() {
        return this.caja;
    }

    setCaja(state) {
        this.caja = state;
    }

    //------------------------LINEA PARA LUCHO-------------------------------
    getIdCaja() {
        return this.id_caja;
    }

    setIdCaja(state) {
        this.id_caja = state;
    }

    getIdStore() {
        return this.id_store;
    }

    setIdStore(state) {
        this.id_store = state;
    }
    //------------------------LINEA PARA LUCHO-------------------------------

    getSession() {
        this.session = JSON.parse(localStorage.getItem('currentUserSessionStore724'));
        return this.session;
    }
    getToken() {
        this.token = JSON.parse(localStorage.getItem('currentUserTokenStore724'));
        return this.token;
    }
    getThird() {
        this.third = JSON.parse(localStorage.getItem('currentThirdFatherStore724'));
        return this.third;
    }

    getIdThird() {
        return localStorage.getItem('idThird724');
    }

    getTokenValue() {
        return '3020D4:0DD-2F413E82B-A1EF04559-78CA';
    }

    getUUID() {
        return JSON.parse(localStorage.getItem('UUIDThird724'));
    }

    getPerson() {
        this.person = JSON.parse(localStorage.getItem('currentUserPersonStore724'));
        return this.person;
    }

    getMenu() {
        this.menu = JSON.parse(localStorage.getItem('currentUserMenuStore724'));
        return this.menu;
    }

    getRol() {
        this.rol = JSON.parse(localStorage.getItem('currentUserRolStore724'));
        return this.rol;
    }

    getIdPersonApp() {
        return (this.person['id_person']) ? this.person['id_person'] : null;
    }
    getUIdPersonApp() {
        return (this.person['uid_usuario']) ? this.person['uid_usuario'] : null;
    }

    getUser() {
        return (this.token['user']) ? this.token['user'] : null;
    }

    isSession() {
        if (localStorage.getItem('currentUserSessionStore724') !== null) {
            return true;
        }
        return false;
    }

    getIdApplication() {
        return 21;
    }

    cleanSession() {

        localStorage.removeItem('currentThirdFatherStore724');
        localStorage.removeItem('currentUserSessionStore724');
        localStorage.removeItem('currentUserPersonStore724');
        localStorage.removeItem('currentUserTokenStore724');
        localStorage.removeItem('currentUserMenuStore724');
        localStorage.removeItem('currentUserRolStore724');
        localStorage.removeItem('currentUserStore724');
    }

}
