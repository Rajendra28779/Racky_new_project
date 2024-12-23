import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllPackageDetails, getUpdatePackageDataById, savePackageMasterdata, updatePackageMasterdata } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PackageMasterserviceService {
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getPackage() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl =getAllPackageDetails;
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
    let fullUrl = getUpdatePackageDataById;
    return this.http.get(fullUrl, options);

  }

  savePackageMasterData(data: any){
    console.log(data);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savePackageMasterdata;
    return this.http.post(fullUrl,data,options);

  }


  updatePackageMasterData(data: any){
    console.log(data);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updatePackageMasterdata;
    return this.http.post(fullUrl,data,options);

  }


}


