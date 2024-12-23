import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionPassService {

  constructor() { }

  OnEncryptPwd(normalPass) {
    if(normalPass){
      return this.makeid() + btoa(normalPass) + this.makeid();
    }
    else{
      return normalPass
    }
  }


  OnDecryptPwd(normalPass) {
    if(normalPass){
      normalPass = normalPass.substring(5, normalPass.length - 5);
      return atob(normalPass);
    }
    else{
      return normalPass;
    }
  }

  makeid() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}
