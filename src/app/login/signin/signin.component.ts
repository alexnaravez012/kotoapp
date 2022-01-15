import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {LoginPage} from '../login.page';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, IonInput, IonSelect, LoadingController, Platform} from '@ionic/angular';
import {HereMapComponent} from '../../common/here-map/here-map.component';
import {AccountService} from '../../Services/AccountService';
import {Router} from '@angular/router';
import {LocationService} from '../../Services/LocationService';
import {Urlbase} from '../../utils/urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import { IonicSelectableComponent } from 'ionic-selectable';
import { Subscription } from 'rxjs';
import { City } from './types/city';
import { CityService } from './signinService/city.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {

  PasoActual = 0;
  MapaCargadoPrev = false;


// geo

lat: any = 0; //latitude
lng: any = 0; //longitude


  @ViewChild("ElScroll") Scroll:ElementRef;
  ClickNext(){
    this.PasoActual++;
    if(this.PasoActual == 4){
      if(!this.MapaCargadoPrev){
        for(let n = 1;n<=5;n++){
          setTimeout(function(MainClass:SigninComponent) {MainClass.ElMap.Resize()},200*n,this);
        }
        this.MapaCargadoPrev = true;
      }
    }
    for(let n = 1;n<=20;n++){
      setTimeout(function(MainClass:SigninComponent) {MainClass.Scroll.nativeElement.scrollTop = MainClass.Scroll.nativeElement.scrollHeight;},50*n,this);
    }
  }

  GetClass(index){
    if(index < this.PasoActual){
      return "Normal"
    }else if(index == this.PasoActual){
      return "Seleccionado"
    }else{
      if(index == 4){
        return "Oculto"
      }else{
        return "Oculto"
      }
    }
  }

  AltoPixelesOriginal = 0;

  GetHeight(index){
    if(index == 0){
      return index == this.PasoActual ?(this.AltoPixelesOriginal*0.4+"px"):(this.AltoPixelesOriginal*0.22+"px");
    }else if(index == 2){
      return index == this.PasoActual ?(this.AltoPixelesOriginal*0.5+"px"):(this.AltoPixelesOriginal*0.3+"px");
    }else if(index == 4){
      return index == this.PasoActual ?(this.AltoPixelesOriginal*0.9+"px"):(this.AltoPixelesOriginal*0.7+"px");
    }else if(index == 5){
      return index == this.PasoActual ?(this.AltoPixelesOriginal*0.8+"px"):(this.AltoPixelesOriginal*0.7+"px");
    }else{
      return index == this.PasoActual ?(this.AltoPixelesOriginal*0.4+"px"):(this.AltoPixelesOriginal*0.1+"px")
    }
  }

  GetPadding(index){
    if(index == 4){
      return "0 30px";
    }else{
      return "0 30px";
    }
  }

  @Input()
  loginMainClass_input:LoginPage;
  loginMainClass:LoginPage;

  password_type: string = 'password';

  @ViewChild('ElMap', {static: true}) private ElMap: HereMapComponent;
  @ViewChild('DocumentInput', {static: false}) private DocumentInput: IonInput;
  @ViewChild('PasswordInput', {static: false}) private PasswordInput: IonInput;
  @ViewChild('NamesInput', {static: false}) private NamesInput: IonInput;
  @ViewChild('ApellidosInput', {static: false}) private ApellidosInput: IonInput;
  @ViewChild('Phone', {static: false}) private Phone: IonInput;
  @ViewChild('mailInput', {static: false}) private mailInput: IonInput;
  @ViewChild('SelectCity', {static: false}) private SelectCity: IonSelect;
  @ViewChild('streetNumber1', {static: false}) private Address: IonInput;
  @ViewChild('streetNumber2', {static: false}) private streetNumber2: IonInput;
  @ViewChild('streetNumber3', {static: false}) private streetNumber3: IonInput;
  @ViewChild('streetOptinalInfo', {static: false}) private streetOptinalInfo: IonInput;
  @ViewChild('streetType', {static: false}) private streetType: IonSelect;

  UsuarioEnUso:any = -2;
  OperacionVerificarDocumentoRealizada:any = false;
  BusquedaAddress = false;

  //CurrentCity:"";

  focusMail(){
    this.AltoPixelesOriginal = this.platform.height();
    setTimeout(()=>{
      this.mailInput.setFocus();
    },200);
  }

  public signinForm: FormGroup;
  cityList:Array<{city_NAME:string,id_CITY:string}> = [];
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
      public formBuilder: FormBuilder,
      public loadingController: LoadingController,
      public toastr: ToastrService,
      private accountService: AccountService,
      private router: Router,
      public alertController: AlertController,
      private locationService:LocationService,
      private platform:Platform,
      private geolocation: Geolocation,
      private http:HttpClient
  ) {
    this.signinForm = formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required],
      doctype: ['', Validators.required],
      doc: ['', Validators.required],
      firstName: ['', Validators.required],
      firstLastName: [''],
      phone: ['', Validators.required],
      birthDate: [''],
      gender: [''],
      city: ['', Validators.required],
      street: ['', Validators.required],
      streetNumber1: ['', Validators.required],
      streetNumber2: ['', Validators.required],
      streetNumber3: ['', Validators.required],
      streetOptinalInfo: ['']
    });
    //
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  '3020D4:0DD-2F413E82B-A1EF04559-78CA',
    });
    this.resetForm(0);
  }

  Resetting = false;

  options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };

  // use geolocation to get user's device coordinates
  getCurrentCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
     }).catch((error) => {
       console.log('Error getting location', error);
     });

  }
  
  async showConfirmReset(){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar',
      message: '¿Reiniciar el registro?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si, reiniciar',
          handler: () => {
            this.resetForm(0);
            console.log('Confirm Okay');
            setTimeout(() => {
              this.mailInput.setFocus();
            },1000);
          }
        }
      ]
    });

    await alert.present();
  }

  ResetAll(step){
    this.signinForm.reset();
    this.UsuarioEnUso = -2;
    this.OperacionVerificarDocumentoRealizada = false;
    this.BusquedaAddress = false;
    this.PasoActual = step;
    this.MapaCargadoPrev = false;
  }

  resetForm(step){
    this.Resetting = true;
    this.ResetAll(step);
    this.signinForm.controls.doctype.disable();
    this.signinForm.controls.doc.disable();
    this.signinForm.controls.password.disable();
    this.signinForm.controls.firstName.disable();
    this.signinForm.controls.firstLastName.disable();
    this.signinForm.controls.birthDate.disable();
    this.signinForm.controls.gender.disable();
    this.signinForm.controls.phone.disable();
    this.signinForm.controls.email.enable();
    this.signinForm.controls.street.disable();
    this.signinForm.controls.city.disable();
    this.signinForm.controls.streetNumber1.disable();
    this.signinForm.controls.streetNumber2.disable();
    this.signinForm.controls.streetNumber3.disable();
    this.signinForm.controls.streetOptinalInfo.disable();
    this.signinForm.controls.doctype.setValue("3");
    this.signinForm.controls.streetNumber1.setValue("");
    this.signinForm.controls.streetNumber2.setValue("");
    this.signinForm.controls.streetNumber3.setValue("");
    this.signinForm.controls.streetOptinalInfo.setValue("");
    setTimeout(()=>{
      this.Resetting = false;
    },1000);
  }

  togglePasswordMode() {
    this.password_type = this.password_type === 'text' ? 'password' : 'text';
  }

  async ngOnInit() {
    this.loginMainClass = this.loginMainClass_input;
    this.loginMainClass.SignInC = this;
    this.signinForm.controls.doctype.setValue("3");
    this.AltoPixelesOriginal = this.platform.height();
    //obtener ciudad
    this.getCitylist();
  }
  defaultCityCode;
  getCitylist(){
    this.http.get<any[]>(Urlbase.tercero+"/thirds/cities",{ headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': '3020D4:0DD-2F413E82B-A1EF04559-78CA',
        'Key_Server': 'FE651467B48D552C2EFBC8B13EBA9',
      }) }).subscribe(response => {
      this.cityList = response;
      this.portService.setCities(response);
      this.defaultCityCode = this.portService.getPorts().find(element => element.id_CITY == 11001)
    });
  }

  // async VerificarUbicacion(){
  //   let ok = false;
  //   try {
  //     await this.platform.ready();
  //     console.log(this.platform)
  //     console.log(this.platform.platforms())
  //     if(!this.platform.is('cordova')){
  //       //ESTO SOLO VA A PASAR EN EL PC
  //       let resultado = await new Promise((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(async (position) => {
  //           try {
  //             let resultado:any = await this.ElMap.reverseGeocode(position);
  //             console.log(resultado);
  //             console.log("The nearest address to your location is:\n" + resultado.Response.View[0].Result[0].Location.Address.Label);
  //             this.CurrentCity = resultado.Response.View[0].Result[0].Location.Address.City;
  //             resolve("Ok");
  //           }catch (e) {
  //             console.log("Error: "+e.toString());
  //             reject(e.toString());
  //           }
  //         });
  //       })
  //       ok = true;
  //     }else{
  //       let resultado:any = await this.locationService.checkGPSPermission();
  //       console.log(resultado);
  //       let resultado2:any = await this.ElMap.reverseGeocode({
  //         coords:{
  //           latitude:resultado.latitude,
  //           longitude:resultado.longitude
  //         }
  //       });
  //       console.log(resultado2);
  //       console.log("The nearest address to your location is:\n" + resultado2.Response.View[0].Result[0].Location.Address.Label);
  //       this.CurrentCity = resultado2.Response.View[0].Result[0].Location.Address.City;
  //       ok = true;
  //     }
  //   }catch (e) {
  //     console.log(e);
  //     console.log(e.toString());
  //     const alert = await this.alertController.create({
  //       header: 'Error',
  //       message: 'Necesitamos que habilites la ubicación para continuar',
  //       buttons: ['OK']
  //     });
  //     await alert.present();
  //     ok = false;
  //   }
  //   return ok;
  // }

  BackMainLogin(){
    this.loginMainClass.BackFromSignin();
  }

  NextFromName(evento?){
    console.log("evento ",evento);
    console.log("this.PasoActual ",this.PasoActual);
    if(this.PasoActual == 2) {
      this.ClickNext();
    }
    setTimeout(()=>{
      this.Phone.setFocus();
    },100);
  }

  UnFocusApellidos(){
    this.ApellidosInput.getInputElement().then(value => {
      value.blur();
    })
  }

  UnFocusTelefono(){
    this.Phone.getInputElement().then(value => {
      value.blur();
    })
    this.signinForm.controls.city.setValue(this.defaultCityCode.id_CITY);
    this.signinForm.controls.street.enable();
    this.signinForm.controls.streetNumber1.enable();
    this.signinForm.controls.streetNumber2.enable();
    this.signinForm.controls.streetNumber3.enable();
    this.signinForm.controls.streetOptinalInfo.enable();
  }

  NextFromPhone(evento){
    if(evento.target.value == null || evento.target.value == ""){
      return;
    }
    if(this.PasoActual == 3) {
      this.ClickNext();
    }
    setTimeout(() => {
      this.signinForm.controls.city.enable();
      setTimeout(() => {
        let customEvent = new UIEvent("UIEvent", {
          detail: 2
          
        });
        this.signinForm.controls.city.setValue(this.defaultCityCode.id_CITY)
        this.signinForm.controls.street.enable();
        this.signinForm.controls.streetNumber1.enable();
        this.signinForm.controls.streetNumber2.enable();
        this.signinForm.controls.streetNumber3.enable();
        this.signinForm.controls.streetOptinalInfo.enable();
      },150);
      this.signinForm.controls.city.setValue(this.defaultCityCode.id_CITY)
      this.signinForm.controls.street.enable();
      this.signinForm.controls.streetNumber1.enable();
      this.signinForm.controls.streetNumber2.enable();
      this.signinForm.controls.streetNumber3.enable();
      this.signinForm.controls.streetOptinalInfo.enable();
    },900);
  }

  hideMap=true;

  NextFromAddress(){
    if(this.PasoActual == 4) {
      this.ClickNext();
    }
    this.PasswordInput.setFocus();
  }

  async VerificarInputDocumento(){
    let docType = this.signinForm.controls.doctype.value;
    let docValue = this.signinForm.controls.doc.value;
    if(!this.signinForm.controls.doc.valid){
      return;
    }
    console.log("se ejecuta VerificarInputDocumento con "+docType+"-"+docValue)
    const loading = await this.loadingController.create({
      message: 'Verificando documento, un momento...',
    });
    await loading.present();
    //
    this.OperacionVerificarDocumentoRealizada = -1;
    let person = await this.accountService.checkPerson(docValue);
    await loading.dismiss();
    if(person[0]){
      if(this.PasoActual == 1){this.ClickNext();}
      console.log("person es ");
      console.log(person[1]);
      this.signinForm.controls.password.enable();
      if(person[1].id_PERSON  != null){//encontró algo
        const alert = await this.alertController.create({
          header: 'Encontrado',
          message: 'Se encontró registro previo, puedes actualizar tu dirección y número',
          buttons: ['Entiendo']
        });
        await alert.present();
        //Ajustamos los datos
        let NombreDividido = person[1].fullname.split(' ');
        let Nombres = NombreDividido[0] || ""; Nombres += ( NombreDividido[1] != null ? " "+NombreDividido[1]:"" )
        let Apellidos = NombreDividido[2] || ""; Apellidos += ( NombreDividido[3] != null ? " "+NombreDividido[3]:"" )
        this.signinForm.controls.firstName.setValue(Nombres);
        this.signinForm.controls.firstLastName.setValue(Apellidos);
        //this.signinForm.controls.address.setValue(person[1].address || "");
        this.signinForm.controls.phone.setValue(person[1].phone || "");
        this.signinForm.controls.birthDate.setValue(person[1].birthday || "");
        let genero = person[1].genero || "";
        if(genero == "Masculino"){
          this.signinForm.controls.gender.setValue("1");
        }else if(genero == "Femenino"){
          this.signinForm.controls.gender.setValue("2");
        }else if(genero == "Otro"){
          this.signinForm.controls.gender.setValue("3");
        }else{
          this.signinForm.controls.gender.setValue("");
        }
        //
        this.signinForm.controls.firstName.disable();
        this.signinForm.controls.firstLastName.disable();
        this.signinForm.controls.phone.enable();
        this.signinForm.controls.birthDate.enable();
        this.signinForm.controls.gender.enable();
        //
        this.OperacionVerificarDocumentoRealizada = 2;
        //
        this.NamesInput.setFocus();
        //
        this.ElMap.SetCenter(
    {
            lat:parseFloat(person[1].latitud),
            lng:parseFloat(person[1].longitud)
          }
        );
      }else{//no existe
        // const toast = await this.toastController.create({
        //   message: 'No existe registro del documento, ingresa tus datos',
        //   duration: 1500
        // });
        // toast.present();
        this.signinForm.controls.firstName.setValue( "");
        this.signinForm.controls.firstLastName.setValue("");
        //this.signinForm.controls.address.setValue("");
        this.signinForm.controls.phone.setValue("");
        //
        this.signinForm.controls.firstName.enable();
        this.signinForm.controls.firstLastName.enable();
        this.signinForm.controls.phone.enable();
        this.signinForm.controls.birthDate.enable();
        this.signinForm.controls.gender.enable();
        //
        this.OperacionVerificarDocumentoRealizada = true;
        //
        this.NamesInput.setFocus();
      }
      this.signinForm.controls.email.disable();
      this.signinForm.controls.doctype.disable();
      this.signinForm.controls.doc.disable();
    }else{
      console.log("person[1] es ");
      console.log(person[1]);
      if(person[1].error == "Used"){
        const alert = await this.alertController.create({
          header: 'Documento Usado',
          message: 'El documento \''+this.signinForm.controls.doc.value+'\' ya se encuentra en uso, verifica si está bien ingresado o si tienes cuenta',
          buttons: [
              {
                text: 'Entiendo',
                role: 'Entiendo',
                handler: () => {
                  this.signinForm.controls.doc.reset();
                  setTimeout(function(Main:SigninComponent) {
                    Main.DocumentInput.setFocus();
                  },500,this);
                }
              }
            ]
        });
        await alert.present();
      }else{
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Revisa tu conexión',
          buttons: ['Entiendo']
        });

        await alert.present();
      }
    }
    //
    await loading.dismiss();
  }

  focusStreet1(){
    if(this.Resetting){return;}
    console.log("focusStreet1")
    setTimeout(() => {
      this.Address.setFocus()
    },800);
  }

  FocusApellidos(){
    setTimeout(() => {
      this.ApellidosInput.setFocus()
    },100);
  }

  focusStreet2(){
    setTimeout(() => {
      this.streetNumber2.setFocus()
    },100);
  }

  focusStreet3(){
    setTimeout(() => {
      this.streetNumber3.setFocus()
    },100);
  }

  focusstreetOptinalInfo(){
    setTimeout(() => {
      this.streetOptinalInfo.setFocus()
    },100);
  }

  async VerificarUsuario(){
    if(!this.signinForm.controls.email.valid || this.UsuarioEnUso == -1 || this.signinForm.controls.email.value == ""){return;}
    this.UsuarioEnUso = -1;
    console.log("se ejecuta VerificarUsuario con "+this.signinForm.controls.email.value)
    let usuarioExiste = await this.accountService.checkUser(this.signinForm.controls.email.value);
    if(usuarioExiste[0]){
      if(usuarioExiste[1].result){//significa que ya está en uso
        this.UsuarioEnUso = true;
        this.signinForm.controls.doctype.disable();
        this.signinForm.controls.doc.disable();
        this.signinForm.controls.password.disable();
      }else{
        if(this.PasoActual == 0){this.ClickNext();}
        this.UsuarioEnUso = false;
        this.signinForm.controls.doctype.enable();
        this.signinForm.controls.email.disable();
        this.signinForm.controls.doc.enable();
        this.DocumentInput.setFocus();
      }
    }else{
      this.UsuarioEnUso = -2;
      this.toastr.error("Revisa tu conexión");
    }
  }

  async CrearCuenta(){
    const loading = await this.loadingController.create({
      message: 'Creando cuenta, un momento...',
    });
    await loading.present();
    let centro:{lat:number,lng:number} = this.ElMap.GetCenter();
    let Nombres = this.signinForm.controls.firstName.value.split(" ");
    Nombres[0] = this.titleCaseWord(Nombres[0]);
    if(Nombres[1] != null){Nombres[1] = this.titleCaseWord(Nombres[1]);}
    let Apellidos = this.signinForm.controls.firstLastName.value.split(" ");
    Apellidos[0] = this.titleCaseWord(Apellidos[0]);
    if(Apellidos[1] != null){Apellidos[1] = this.titleCaseWord(Apellidos[1]);}
    let bodyPosteo = {
      usuario:this.signinForm.controls.email.value,
      clave:this.signinForm.controls.password.value,
      appid:26,
      third:{
        firstname:Nombres[0],
        secondname:Nombres[1] || "",
        firstlastname:Apellidos[0],
        secondlastname:Apellidos[1] || "",
        iddocumenttype:this.signinForm.controls.doctype.value,
        docnumber:this.signinForm.controls.doc.value,
        direccion:this.ReturnFullAddress(false),//le concatenos las coordenadas
        idcity:this.signinForm.controls.city.value,
        telefono:this.signinForm.controls.phone.value,
        email:this.signinForm.controls.email.value,
        // birthDate:this.signinForm.controls.birthDate.value,
        birthDate: new Date(),
        // gender:this.signinForm.controls.gender.value,
        gender:1,
        lat:centro.lat,
        lng:centro.lng
      }
    };
    let resultado:[boolean,any] = await this.accountService.createUser(bodyPosteo);
    console.log("BODY POSTEO: ",bodyPosteo)
    if(resultado[0]){//Creada
      //Iniciamos sesión para ir al home
      let LoginDesdeRegistro = await this.accountService.loginUser(this.signinForm.controls.email.value,this.signinForm.controls.password.value);
      await loading.dismiss();
      if(LoginDesdeRegistro[0]){
        this.router.navigate(['/home']);
        this.loginMainClass.slider.slidePrev();
        this.resetForm(0);
      }else{
        this.toastr.info("Tu cuenta fue creada pero ocurrió un error, intenta iniciar sesión");
      }
    }else{//Error
      await loading.dismiss();
      if(resultado[1].error == "Document Used"){
        this.toastr.error("El documento ya está en uso!");
      }else{
        this.toastr.error("No se pudo crear tu cuenta, revisa tu conexión");
      }
    }
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  ReturnFullAddress(withCity,withComplement = true){
    let city = "";
    if(withCity){
      for(let n = 0;n<this.cityList.length;n++){
        if(this.signinForm.controls.city.value == this.cityList[n].id_CITY){
          city = this.cityList[n].city_NAME;
          break;
        }
      }
    }
    let ajusteOpcional = "";
    if(this.signinForm.controls.streetOptinalInfo.value != "" && withComplement){
      ajusteOpcional = "| "+this.signinForm.controls.streetOptinalInfo.value;
    }
    return (this.signinForm.controls.street.value+" "+
        this.signinForm.controls.streetNumber1.value+" # "+
        this.signinForm.controls.streetNumber2.value+" "+
        this.signinForm.controls.streetNumber3.value +" "
        + city + ajusteOpcional );
  }

  async BuscarAddress(){
    this.hideMap=false;
    setTimeout(function(MainClass:SigninComponent) {MainClass.ElMap.Resize()},200*3,this);
    const loading = await this.loadingController.create({
      message: 'Buscando, un momento...',
    });
    await loading.present();
    console.log(this.ReturnFullAddress(true,false));
    let resultado = await this.ElMap.SearchAddress(this.ReturnFullAddress(true,false));
    await loading.dismiss();
    if(resultado[0]){
      if(resultado[1].length == 0){//No encontró resultados
        this.toastr.error("No se encontraron resultados, intenta especificar mas datos, como la ciudad.");
      }else{//Encontró algo
        this.BusquedaAddress = true;
        this.ElMap.SetCenter(
        {
          lat:resultado[1][0].result[0].location.displayPosition.latitude,
          lng:resultado[1][0].result[0].location.displayPosition.longitude
        });
        setTimeout(async function(MainClass:SigninComponent) {
          const alert = await MainClass.alertController.create({
            header: 'Info',
            message: 'Si no logramos ubicarte bien, por favor, mueve el mapa para que el punto rojo quede donde estas realmente ubicado.',
            buttons: ['OK']
          });

          await alert.present();
        },100,this);
      }
    }else{
      this.toastr.error("No se pudo obtener la ubicación, revisa tu conexión e intenta de nuevo.");
      console.log(resultado[1])
    }
    console.log(this.ElMap.GetCenter())
  }

  portsSubscription: Subscription;

  filterPorts(ports: City[], text: string) {
    return ports.filter(port => {
      return port.city_NAME.toLowerCase().indexOf(text) !== -1 ||
        port.id_CITY.toString().toLowerCase().indexOf(text) !== -1;
    });
  }
  
  
  private portService: CityService = new CityService();

  
  searchCity(event: {
    component: IonicSelectableComponent,
    text: string
  }) {
    let text = event.text.trim().toLowerCase();
    event.component.startSearch();

    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    if (!text) {
      // Close any running subscription.
      if (this.portsSubscription) {
        this.portsSubscription.unsubscribe();
      }

      event.component.items = [];
      event.component.endSearch();
      return;
    }

    this.portsSubscription = this.portService.getCitiesAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(ports, text);
      event.component.endSearch();
    });
  }

  SelectCityInput(evento){
    if(this.Resetting){return;}
    console.log("I WNAT YOU I NEED YOU",this.defaultCityCode.id_CITY)
    this.signinForm.controls.city.enable();
    setTimeout(() => {
      let customEvent = new UIEvent("UIEvent", {
        detail: 2
      });
      this.signinForm.controls.city.setValue(this.defaultCityCode.id_CITY)
    },400);
  }
  

}
