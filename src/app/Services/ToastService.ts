import {Injectable} from '@angular/core';
import {LoadingController} from "@ionic/angular";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn:'root'
})

export class ToastService {

  constructor(
      public loadingController: LoadingController,
      private toastr: ToastrService
  ) {
  }

  public async success(message:string){
    this.toastr.success(message);
  }

  public async info(message:string,disabletime?:boolean){
    disabletime = disabletime || false;
    if(disabletime){
      this.toastr.info(message, null,{closeButton:true,timeOut:30000});
    }else{
      this.toastr.info(message, null);
    }
  }

  public async error(message:string,title?:string){
    if(!this.GetIfRelatedSessionerror(message)){
      this.toastr.error(message, null,{closeButton:true,timeOut:20000});
    }
  }

  RefLoading = null;

  public async MostrarLoading(message:string){
    if(this.RefLoading != null){
      this.RefLoading.dismiss();
      this.RefLoading = null;
    }
    this.RefLoading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: message
    });
    await this.RefLoading.present();
  }

  public async QuitarLoading(){
    if(this.RefLoading != null){
      this.RefLoading.dismiss();
      this.RefLoading = null;
    }
  }



  GetIfRelatedSessionerror(message:string){
    let encontrado = false;
    if(message.includes("jwt expired")){ return true; }
    else if(message.includes("Session ended")){ return true; }
    else if(message.includes("401 Unauthorized")){ return true; }
    return encontrado;
  }
}
