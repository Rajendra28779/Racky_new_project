import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { docdetailsbyserviceid, downlordmosarkargrivancedoc, generateOtpForGrievance, getGrivancemediumList, getactivegrivancetype, mskrecordview, savemskgriv, validateotpgrievance } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class MskgrivanceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getactivegrivancetype() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl =getactivegrivancetype;
    return this.http.get(fullUrl, options)
  }

  savemskgriv(formData: FormData) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl =savemskgriv;
    console.log(formData);

    return this.http.post(fullUrl,formData,options)
  }

  mskrecordview(statecode: number, distcode: any, hospcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params:{
        "statecode":statecode,
        "distcode":distcode,
        "hospcode":hospcode
      }
    }
    let fullUrl =mskrecordview;
    return this.http.get(fullUrl,options)
  }
  docdetailsbyserviceid(serviceid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params:{
        "serviceid":serviceid
      }
    }
    let fullUrl =docdetailsbyserviceid;
    return this.http.get(fullUrl,options)
  }
  downlorddoc(fileName: any) {
    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downlordmosarkargrivancedoc + '?' + 'data=' + queryParam;
    return url;
  }
  generateotpforgrievance(mobile: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        'mobile': mobile
      }
    }
    let fullUrl =generateOtpForGrievance;
    return this.http.get(fullUrl,options)
  }
  validateOtpForGrv(otp: any, mobileNo: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        'otp': otp,
        'mobileNo': mobileNo
      }
    }
    let fullUrl = validateotpgrievance;
    return this.http.get(fullUrl, options)
  }
  getGrievanceMediumData(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl =getGrivancemediumList;
    return this.http.get(fullUrl, options)
  }
}
