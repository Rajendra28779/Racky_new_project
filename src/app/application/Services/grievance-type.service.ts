import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllListgrievance, getGrievanceTypeId, savegrievancetype, updateGrievancetypedata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class GrievanceTypeService {

  constructor  (private http: HttpClient, private jwtService: JwtService) { }
  savegrievancetype(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savegrievancetype;
    return this.http.post(fullUrl,data,options);

  }
  updateGrievancetypedata(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateGrievancetypedata;
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
       let fullUrl =getAllListgrievance;
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
      let fullUrl = getGrievanceTypeId;
      return this.http.get(fullUrl, options);

    }



}
