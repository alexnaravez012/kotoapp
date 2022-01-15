import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Urlbase} from '../utils/urls';
import {Router} from '@angular/router';

@Injectable({
    providedIn:'root'
})
export class AccountService{
    private headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(private http: HttpClient, private router: Router) {
        if(localStorage.getItem("FullUser") != null && localStorage.getItem("FullUser") != "" && localStorage.getItem("FullUser") != "null"){
            this.usuarioCompleto = JSON.parse(localStorage.getItem("FullUser"))
        }
        if(this.usuarioCompleto == null || this.usuarioCompleto.third == null || this.usuarioCompleto.third.profile == null){
            localStorage.setItem("RouterHome","false");
            localStorage.setItem("FullUser",null);
            localStorage.setItem("LastCheckClosestProv",null);
            localStorage.setItem("TiendaProv",null);
            this.router.navigateByUrl("/login");
        }
    }

    usuarioCompleto : {
        uuid:string,
        roles: Array<{}>,
        third: {
            id_third:number,
            id_third_father:number,
            profile:{
                id_person: number,
                first_name: string,
                second_name: string,
                first_lastname: string,
                second_lastname: string,
                birthday: Date,
                info:{
                    id_common_basicinfo: number,
                    id_document_type: number,
                    fullname: string,
                    img: string,
                    document_number: string,
                    type_document: string
                },
                directory:number
            },
            directory:number
        },
        address:string,
        phone:string,
        email:string,
        genero:string,
        latitud:string,
        longitud:string,
        city_ID:number,
        city_NAME:string
    } = {uuid:"",roles:[],third:null,address:"",email:"",phone:"",genero:"",latitud:"",longitud:"",city_ID:-1,city_NAME:""}

    GetFullName(){
        let salida = [];
        let name1 = this.usuarioCompleto.third.profile.first_name;
        let name2 = this.usuarioCompleto.third.profile.second_name;
        let name3 = this.usuarioCompleto.third.profile.first_lastname;
        let name4 = this.usuarioCompleto.third.profile.second_lastname;
        if(name1 != null && name1 != ""){salida.push(name1);}
        if(name2 != null && name2 != ""){salida.push(name2);}
        if(name3 != null && name3 != ""){salida.push(name3);}
        if(name4 != null && name4 != ""){salida.push(name4);}
        return salida.join(" ");
    }

    GetNormalName(){
        let salida = [];
        let name1 = this.usuarioCompleto.third.profile.first_name;
        let name3 = this.usuarioCompleto.third.profile.first_lastname;
        if(name1 != null && name1 != ""){salida.push(name1);}
        if(name3 != null && name3 != ""){salida.push(name3);}
        return salida.join(" ");
    }

    async CheckClosestProv():Promise<any>{
        if(localStorage.getItem("LastCheckClosestProv") == null || localStorage.getItem("TiendaProv") == null || localStorage.getItem("TiendaProv") == "" || localStorage.getItem("TiendaProv") == "-1"){localStorage.setItem("LastCheckClosestProv","1");}
        let LastCheckTimestamp = parseInt(localStorage.getItem("LastCheckClosestProv"));
        return await new Promise<string>((resolve, reject) => {
            if((Date.now()-LastCheckTimestamp) < 86400000){//esto es, volver a buscar el prov mas cerado cada 7 dias para no spamear consultas
                resolve(localStorage.getItem("TiendaProv"));
            }else{
                //petición al servidor para verificar sesión
                this.http.get<string>(Urlbase.facturacion +"/pedidos/CheckClosestProv?id_store=10&lat="+(this.usuarioCompleto.latitud||4.6)+"&lng="+(this.usuarioCompleto.longitud||-74.1),{
                    responseType: 'text' as 'json'
                }).subscribe(value => {
                    resolve(value);
                },error => {
                    reject(error);
                })
            }
        });
    }

    async IsLogued():Promise<boolean>{
        return await new Promise<boolean>(resolve => {
            if(localStorage.getItem("CurrentSession") == "-1" || localStorage.getItem("CurrentSession") == null){
                resolve(false);
            }else{
                //petición al servidor para verificar sesión
                this.http.post(Urlbase.auth +"/CheckSession",null).subscribe(value => {
                    resolve(true);
                },error => {
                    console.log(error);
                    resolve(false);
                })
            }
        });
    }

    async createUser(bodyPosteo:{}):Promise<[boolean,any]>{
        return await new Promise<[boolean,any]>(resolve => {
            this.http.post(Urlbase.auth+"/CreateClient",bodyPosteo).subscribe(value => {
                resolve([true, value]);
            }, error => {
                resolve([false, error]);
            })
        });
    }


    async loginUser(usuario:string,clave:string):Promise<[boolean,any]>{
        return await new Promise<[boolean,any]>(resolve => {
            this.http.post(Urlbase.auth+"/loginClient?id_aplicacion=26",{usuario:usuario,clave:clave}).subscribe(value => {
                // @ts-ignore
                this.usuarioCompleto.uuid = value.uuid;
                // @ts-ignore
                this.usuarioCompleto.roles = value.roles;
                // @ts-ignore
                this.usuarioCompleto.third = value.third[0];
                // @ts-ignore
                this.usuarioCompleto.address = value.address;
                // @ts-ignore
                this.usuarioCompleto.email = value.email;
                // @ts-ignore
                this.usuarioCompleto.phone = value.phone;
                // @ts-ignore
                this.usuarioCompleto.genero = value.genero;
                // @ts-ignore
                this.usuarioCompleto.latitud = value.latitud;
                // @ts-ignore
                this.usuarioCompleto.longitud = value.longitud;
                // @ts-ignore
                this.usuarioCompleto.city_ID = value.city_ID;
                // @ts-ignore
                this.usuarioCompleto.city_NAME = value.city_NAME;
                localStorage.setItem("FullUser",JSON.stringify(this.usuarioCompleto));
                resolve([true, value]);
            }, error => {
                resolve([false, error]);
            })
        });
    }

    async checkUser(usuario:string):Promise<[boolean,any]>{
        return await new Promise<[boolean,any]>(resolve => {
            this.http.post(Urlbase.auth+"/userExists",{usuario:usuario,AppID:26}).subscribe(value => {
                resolve([true, value]);
            }, error => {
                resolve([false, error]);
            })
        });
    }

    async checkPerson(docnumber:string):Promise<[boolean,any]>{
        return await new Promise<[boolean,any]>(resolve => {
            this.http.post(Urlbase.auth+"/CheckPerson",{docnumber:docnumber}).subscribe(value => {
                resolve([true, value]);
            }, error => {
                resolve([false, error]);
            })
        });
    }

    public async ClearUserData(){
        localStorage.removeItem("RouterHome");
        localStorage.removeItem("FullUser");
        localStorage.removeItem("LastCheckClosestProv");
        localStorage.removeItem("TiendaProv");
        localStorage.removeItem("WelcomeMSG");
        return await new Promise<[boolean,any]>(resolve => {
            this.http.post(Urlbase.auth+"/logout",{}).subscribe(value => {
                resolve([true, value]);
            }, error => {
                resolve([false, error]);
            })
        });
    }
}
