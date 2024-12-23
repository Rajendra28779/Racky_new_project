import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Delete, getExpertisetypeData, getMedicalexpname, getbyexpertiseid, getmedicalexpertiseData, getmedicalexpertiseDataById, saveTypeofExpertise, savemedicalexpertisedata, updateMedicalexpertiseData, updateexpertisetype } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class EmpanelmentmasterserviceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  savemedexp(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savemedicalexpertisedata;
    return this.http.post(fullUrl,data,options);

  }
  getlist(){

    let headers = new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': this.jwtService.getJwtToken()
       })
       let options = {
         headers: headers
       }
       let token = this.jwtService.getJwtToken();
       let fullUrl =getmedicalexpertiseData;
       return this.http.get(fullUrl, options);

     }
     getbyid(user: any) {
      console.log("Id comes in service"+user);

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers,
        params: {
          'userid': user,

        }
      }
      let token = this.jwtService.getJwtToken();
      let fullUrl = getmedicalexpertiseDataById;
      return this.http.get(fullUrl, options);

    }
    updatemedexp(data: any){
      console.log(data);

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers
      }
      var fullUrl = updateMedicalexpertiseData;
      return this.http.post(fullUrl,data,options);

    }

    getMedexpname(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl =getMedicalexpname;
    return this.http.get(fullUrl,options)
  }
  getbyID(typeofexpertiseid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =getbyexpertiseid+'?typeofexpertiseid='+typeofexpertiseid;
    return this.http.get(fullUrl,options)
  }
  saveexpertisetype(expertisetype:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =saveTypeofExpertise+'?medicalexpid='+expertisetype.medicalexpid+'&typeofexpertise='+expertisetype.typeofexpertise+'&createdby='+expertisetype.createdby
   return this.http.get(fullUrl,options)
  }
  getallexpertisetypelist(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getExpertisetypeData;
    return this.http.get(fullUrl,options)
  }
  delete(typeofexpertiseid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =Delete+'?typeofexpertiseid='+typeofexpertiseid;
   return this.http.get(fullUrl,options)
  }
  updatetypeofexp(items: any, medicalexpid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
     let fullUrl =updateexpertisetype+'?medicalexpid='+medicalexpid+'&typeofexpertise='+items.typeofexpertise+'&updateby='+items.updateby+"&typeofexpertiseid="+items.typeofexpertiseid+"&status="+items.status;
    return this.http.get(fullUrl,options);
  }
}
