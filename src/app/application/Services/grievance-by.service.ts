import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { savegrievanceby,getAllList, updateGrievancedata, getUpdateGrievanceById } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class GrievanceByService {

  constructor  (private http: HttpClient, private jwtService: JwtService) { }

  savegrievanceby(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savegrievanceby;
    return this.http.post(fullUrl,data,options);

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
    let fullUrl = getUpdateGrievanceById;
    return this.http.get(fullUrl, options);

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
    let fullUrl =getAllList;
    return this.http.get(fullUrl, options);

  }
  updateGrievanceMasterData(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateGrievancedata;
    return this.http.post(fullUrl,data,options);

  }
}
