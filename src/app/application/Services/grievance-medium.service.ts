import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllListgrievancemedium, getGrievanceMediumId, savegrievancemedium, updateGrievancemediumdata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class GrievanceMediumService {

  constructor  (private http: HttpClient, private jwtService: JwtService) { }

  savegrievancemedium(data:any){

    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savegrievancemedium;
    return this.http.post(fullUrl,data,options);

  }


  updateGrievancemediumdata(data: any){
    console.log(data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateGrievancemediumdata;
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
       let fullUrl =getAllListgrievancemedium;
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
      let fullUrl = getGrievanceMediumId;
      return this.http.get(fullUrl, options);

    }



}
