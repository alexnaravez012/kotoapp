import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../../Services/AccountService';
import {LoginPage} from '../login.page';
import {AlertController, IonInput, LoadingController} from '@ionic/angular';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../utils/urls';
import {ToastrService} from 'ngx-toastr';
import {CommonOperations} from '../../Services/CommonOperations';

@Component({
  selector: 'app-login_login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @Input()
  loginMainClass_input:LoginPage;
  loginMainClass:LoginPage;

  @ViewChild('password', {static: false}) private password: IonInput;

  MostrarPass = false;

  ChangePassMode(){this.MostrarPass = !this.MostrarPass;}

  public loginForm: FormGroup;
  constructor(
      public formBuilder: FormBuilder,
      private accountService:AccountService,
      public toastr: ToastrService,
      public loadingController: LoadingController,
      public alertController: AlertController,
      private router:Router,
      private httpclient:HttpClient,
      private commonOperations:CommonOperations
  ) {
    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loginMainClass = this.loginMainClass_input;
  }

  FocusInputs(){
    // this.commonOperations.KeyboardH = window.innerHeight/2;

  }

  focuspass(){
    setTimeout(() => {
      this.password.setFocus()
    },100);
  }

  async Login(){
    const loading = await this.loadingController.create({
      message: 'Un momento...',
    });
    localStorage.setItem("SesionExpirada","false");
    await loading.present();
    //Iniciamos sesión para ir al home
    let LoginDesdeRegistro = await this.accountService.loginUser(this.loginForm.controls.username.value,this.loginForm.controls.password.value);
    console.log("Resultado del login: ",LoginDesdeRegistro);
    await loading.dismiss();
    if(LoginDesdeRegistro[0]){

      this.toastr.success("Bienvenido, "+this.accountService.GetNormalName());
      this.router.navigateByUrl("/home");
      localStorage.setItem("RouterHome","true");
    }else{
      console.log(LoginDesdeRegistro[1])
      this.toastr.error("Credenciales inválidas");
    }
  }

  async ClickRecoverPassword(){
    const alert = await this.alertController.create({
      header: 'Recuperar contraseña',
      inputs: [
        {
          name: 'note',
          type: 'text',
          placeholder: 'Ingresa tu correo',
          value:this.loginForm.controls.username.value || "",
          min: 5
        },
      ],
      buttons: [
        {
          text: 'Volver',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (data) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Recuperar',
          handler: async (data) => {
            console.log('Confirm Ok');
            console.log(data);
            if(data.note.length > 5 && data.note.includes("@") && data.note.includes(".")){
              try {
                let resultado = await new Promise((resolve, reject) => {
                  this.httpclient.post(Urlbase.auth + "/passrecovery", {mail:data.note}).subscribe(value => {
                    resolve(value);
                  }, error => {
                    reject(error);
                  })
                });
                this.toastr.info("Se ha enviado un correo de recuperación");
              }catch (e) {
                this.toastr.info("No se pudo enviar la solicitud, intente de nuevo");
              }
            }else{
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'Debes ingresar un correo valido.',
                buttons: ['OK']
              });
              await alert.present()
            }
          }
        }
      ]
    });

    await alert.present();
  }

  LoginGoogle(){
    this.loginMainClass.LoginGoogle();
  }

  LoginFace(){
    this.loginMainClass.LoginFace();
  }

  LoginPhone(){
    this.loginMainClass.LoginPhone();
  }

  LoginMail(){
    this.loginMainClass.LoginMail();
  }

}
