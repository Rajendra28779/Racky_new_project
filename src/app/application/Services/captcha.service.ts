import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaptchaService {

  constructor() { }

  verifyCaptcha(): boolean {
    return true;
  }

  public getCaptcha() {
    var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
      // 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9');
      var letter= new Array('1', '2', '3', '4', '5', '6', '7', '8', '9');
      var sign=new Array('+','-','*')
      var letter1= new Array('1', '2', '3', '4', '5', '6', '7', '8', '9');
      var i,code='';

            /* for Alphabate Captcha>*/
    // for (i = 0; i < 6; i++) {
    //   var a1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var b1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var c1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var d1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var e1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var f1 = alpha[Math.floor(Math.random() * alpha.length)];
    //   var g1 = alpha[Math.floor(Math.random() * alpha.length)];
    //    code = a1 + ' ' + b1 + ' ' + ' ' + c1 + ' ' + d1 + ' ' + e1 + ' ' + f1 + ' ' + g1 ;
    // }

     /* for Mathematical Captcha>*/
     /*@Created By Rajendra.sahoo*/
    let b=true;
     while(b){
      var l1 = letter[Math.floor(Math.random() * letter.length)];
          var s1 = sign[Math.floor(Math.random() * sign.length)];
          var l2 = letter1[Math.floor(Math.random() * letter1.length)];
            code=l1 +' ' + s1 +' ' + l2
          var ans=this.calculatecaptcha(code);
          if(ans>=0){
            b=false;
          }else{
            b=true;
          }
          // console.log(b);

     }


    return code;

  }

  public validateCaptcha(challange: any, captcha: string): boolean {
    // console.log("validating captcha");
    challange = this.removeSpaces(challange);
    // captcha=this.removeSpaces(captcha);
    let ans = this.calculatecaptcha(captcha);
    if (challange == ans) {
      return true;
    } else {
      return false;
    }
  }
  removeSpaces(string: string) {
    return string.split(' ').join('');
  }

  public calculatecaptcha(string: string){
    let s:any[]=string.split(' ');
    let s1:number=parseInt(s[0]);
    let s2:any=s[1];
    let s3:number=parseInt(s[2]);
    if(s2=='+'){
      return s1+s3;
    }else if(s2=='-'){
      return s1-s3;
    }else if (s2=='*'){
      return s1*s3;
    }else{
      return 0;
    }
  }
}



