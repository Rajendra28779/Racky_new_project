import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  encryptSessionData(key: string, value: any){
    sessionStorage.setItem(key, this.encryptTheData(JSON.stringify(value)));
  }

  decryptSessionData(key: string){
    let data = sessionStorage.getItem(key);
    data = this.decrypTheData(data);
    return JSON.parse(data);
  }

  encryptTheData(data) {
    if (data){
      return this.generateRandomAlfaNumerics() + btoa(data) + this.generateRandomAlfaNumerics();
    } else{
       return data;
    }
  }

  decrypTheData(data) {
    if (data) {
      data = data.substring(5, data.length - 5);
      return atob(data);
    } else {
      return data;
    }
  }

  generateRandomAlfaNumerics() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
}
