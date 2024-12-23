import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { checkDuplicateUser, getdoctortaglist, getreferaldoctor, saverefdocConfiguration, savereferaldoctor,
savereferralreson, updatereferaldoctor,getallreferralreson,updatereferralreson, savereferalhospital,
getreferalhospitallist, getreferralhospitaltype, getreferralhospitalbyid, updatereferalhospital, getrefHospitalbyDistrictId, getdoctortaglistbydoctorid, getrefHospitalbyDistrictIdblockid, updatereferraldocConfiguration, getallhosptype, saverefhospitaltype, updaterefhospitaltype, getrefHospitalbyDistrictIdhospitaltype } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  checkDuplicateUser(userName: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let fullUrl = checkDuplicateUser + "?userName=" + userName;
    return this.http.get(fullUrl, options);
  }
  savereferaldoctor(object: { fullname: string; username: string; mobileno: string; emailid: string; licenseno: string; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savereferaldoctor;
    return this.http.post(fullUrl,object,options);
  }
  getreferaldoctorlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getreferaldoctor;
    return this.http.get(fullUrl, options);
  }
  updatereferaldoctor(object: { fullname: string; mobileno: string; emailid: string; licenseno: string; updateby: any; status: any; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatereferaldoctor;
    return this.http.post(fullUrl,object,options);
  }
  saverefdocConfiguration(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = saverefdocConfiguration;
    return this.http.post(fullUrl,object,options);
  }
  updatereferraldocConfiguration(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatereferraldocConfiguration;
    return this.http.post(fullUrl,object,options);
  }
  getdoctortaglist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getdoctortaglist;
    return this.http.get(fullUrl, options);
  }

  savereferralreson(group: FormGroup) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savereferralreson;
    return this.http.post(fullUrl,group,options);
  }
  getallreferralreson(value: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getallreferralreson;
    return this.http.get(fullUrl, options);
  }
  getallhosptype() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getallhosptype;
    return this.http.get(fullUrl, options);
  }
  updatereferralreson(value: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatereferralreson;
    return this.http.post(fullUrl,value,options);
  }

  savereferalhospital(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = savereferalhospital;
    return this.http.post(fullUrl,object,options);
  }

  updatereferalhospital(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatereferalhospital;
    return this.http.post(fullUrl,object,options);
  }

  getreferalhospitallist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getreferalhospitallist;
    return this.http.get(fullUrl, options);
  }
  getreferralhospitaltype() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getreferralhospitaltype;
    return this.http.get(fullUrl, options);
  }

  gethospitalbyid(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        hospid:id
      }
    };
    let fullUrl = getreferralhospitalbyid;
    return this.http.get(fullUrl, options);
  }

  getrefHospitalbyDistrictId(id: any, stateCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        dist:id,
      }
    };
    let fullUrl = getrefHospitalbyDistrictId;
    return this.http.get(fullUrl, options);
  }

  getdoctortaglistbydoctorid(Userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        Userid:Userid,
      }
    };
    let fullUrl = getdoctortaglistbydoctorid;
    return this.http.get(fullUrl, options);
  }
  getrefHospitalbyDistrictIdblockid(id: any, sdistrictcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        block:id,
        dist:sdistrictcode
      }
    };
    let fullUrl = getrefHospitalbyDistrictIdblockid;
    return this.http.get(fullUrl, options);
  }

  getrefHospitalbyDistrictIdhospitaltype(id: any, sdistrictcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params:{
        hospid:id,
        dist:sdistrictcode
      }
    };
    let fullUrl = getrefHospitalbyDistrictIdhospitaltype;
    return this.http.get(fullUrl, options);
  }

  saverefhospitaltype(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = saverefhospitaltype;
    return this.http.post(fullUrl,object,options);
  }
  updaterefhospitaltype(object: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updaterefhospitaltype;
    return this.http.post(fullUrl,object,options);
  }



}
