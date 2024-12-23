import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';
import { getQueryList, getQueryTypeListById, saveQueryTypeData, updateQueryById } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class QueryTypeServiceService {
  

  constructor(private http: HttpClient,private jwtService: JwtService) { }


  saveQueryType(data: any){
    console.log(data);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = saveQueryTypeData;
    return this.http.post(fullUrl,data,options);

  }
  updateQuery(data:any){
    console.log(data);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =updateQueryById;
    return this.http.post(fullUrl,data,options);
  
  }

  getbyid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getQueryTypeListById + "?typeId=" + user;
    return this.http.get(fullUrl, options);

  }
  getQueryTypeList(){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getQueryList
    return this.http.get(fullUrl, options);
  }
}
