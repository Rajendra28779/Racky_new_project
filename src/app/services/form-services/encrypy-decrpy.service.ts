import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment} from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class EncrypyDecrpyService {

  constructor() { }

  encText(plainText:any) {
    let encKey = environment.apiHashingKey;
    let text = plainText;
    let iv = CryptoJS.enc.Hex.parse(environment.encryptIV);
    return btoa(CryptoJS.AES.encrypt(text, encKey, { iv: iv }).toString());
  }

  decText(encryptedText:any) {
    encryptedText = atob(encryptedText);
    let encKey = environment.apiHashingKey;
    let iv = CryptoJS.enc.Hex.parse(environment.encryptIV);
    var decryptText = CryptoJS.AES.decrypt(encryptedText, encKey, { iv: iv });
    return decryptText.toString(CryptoJS.enc.Utf8);
  }

  //  escapeHtml(text:string) {
  //   var map:any = {
  //     '&': '&amp;',
  //     '<': '&lt;',
  //     '>': '&gt;',
  //     '"': '&quot;',
  //     "'": '&#039;'
  //   };
  //   return text.replace(/[&<>"']/g, function(m:string) { return map[m]; });
  // }

   escapeHtml(text:string) {
     if(text!='')
     {
        return text;
     }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
  }

   decodeHtml(str:any)
{
  if(str)
  {
    var map:any =
    {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#039;': "'"
    };
    return str.replace(/&amp;|&lt;|&gt;|&quot;|&#039;/g, function(m:any) {return map[m];});
}
else
{
  return  str;
}
}
}
