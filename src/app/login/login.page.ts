import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AccountService} from '../Services/AccountService';
import {IonSlides, LoadingController} from '@ionic/angular';
import {SigninComponent} from './signin/signin.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {

  mostrandoSplash = true;
  moviendoSlider = false;
  animacionSplash = 0;
  @ViewChild('slider', {static: true}) public slider: IonSlides;

  slideLogin = 0;
  slideSignin = 1;

  SignInC:SigninComponent;

  slideOpts = {
    initialSlide: this.slideLogin,
    speed: 400,
    pagination: false,
    allowTouchMove: false
  };

  constructor(
      private accountService: AccountService,
      public loadingController: LoadingController
  ) {
    if(localStorage.getItem("IntroReady") == "true"){
      this.slideOpts = {
        initialSlide: this.slideLogin,
        speed: 400,
        pagination: false,
        allowTouchMove: false
      };
    }
    this.DelayedConstructor();
  }

  async DelayedConstructor(){
    //Verificamos el estado de la cuenta, si está logueado
    this.mostrandoSplash = true;
    let CheckLogin = await this.accountService.IsLogued();
    if(CheckLogin){//Sesión valida
      //Redireccionar al home
    }else{
      console.log("No session");
      this.mostrandoSplash = false;
    }
  }

  ngOnInit() {
  }

  async MoverSiguienteSlide(){
    if(this.moviendoSlider){return;}
    let currentIndex = await this.slider.getActiveIndex();
    if(currentIndex == 0 || currentIndex == 1){
      this.moviendoSlider = true;
      await this.slider.slideNext();
      this.moviendoSlider = false;
      if(currentIndex == 1){localStorage.setItem("IntroReady","true");}
    }
  }

  //TODOS LOS METODOS DEL REGISTRO
  async BackFromSignin(){
    if(this.moviendoSlider){return;}
    this.moviendoSlider = true;
    await this.slider.slideTo(this.slideLogin);
    this.moviendoSlider = false;
  }

  //TODOS LOS METODOS DE LOGIN CON OTRAS FORMAS
  LoginGoogle(){

  }

  LoginFace(){

  }

  LoginPhone(){

  }

  async LoginMail(){
    if(this.moviendoSlider){return;}
    const loading = await this.loadingController.create({
      message: 'Verificando permisos de ubicación...',
      duration: 2000
    });
    await loading.present();
    // let ResultadoGPS = await this.SignInC.VerificarUbicacion();
    // if(ResultadoGPS){
    //   this.moviendoSlider = true;
    //   await this.slider.slideTo(this.slideSignin);
    //   this.moviendoSlider = false;
    // }
    this.moviendoSlider = true;
    await this.slider.slideTo(this.slideSignin);
    this.moviendoSlider = false;
    this.SignInC.focusMail();
    await loading.dismiss();
  }

}
