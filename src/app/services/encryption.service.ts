import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  OnEncrypt(normalPass) {
    if(normalPass)
      return this.makeRandom() + btoa(normalPass) + this.makeRandom();
    else
      return normalPass
  }


  OnDecrypt(normalPass) {
    if(normalPass){
      normalPass = normalPass.substring(5, normalPass.length - 5);
      return atob(normalPass);
    }
    else
      return normalPass;
  }

  makeRandom() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  getEncryptedData(data: any | FormData) {
    return {
      encData: this.OnEncrypt(JSON.stringify(data))
    };
  }

  getDecryptedData(data: any) {
    return JSON.parse(this.OnDecrypt(data.encData));
  }

  encryptRequest(data: any) {
    let requestedData = {
      "request": this.OnEncrypt(JSON.stringify(data))
    }
    return requestedData;
  }
}
