import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getpackagebenificiarydetails, getpackageDetails, getpackageWiseDischarge } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PackagewisedischargeclaimService {

 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  packagedetails(userId: any, fromdate: any, todate: any, stateId: any, districtId: any, hospitalCode: any) {
    console.log(userId+"--"+fromdate+"--"+todate+"--"+stateId+"--"+districtId+"--"+hospitalCode);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate)
      .append('stateId1', stateId)
      .append('districtId1', districtId)
      .append('hospitalCode1', hospitalCode);
    
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getpackageWiseDischarge;
    return this.http.get(fullUrl, options)
  }
  getData(userId:any,state:any,dist:any,hosp:any,packageHeader:any,fromDate:any,toDate:any) {
    console.log(packageHeader+"--"+state); 
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('state',state)
    .append('dist',dist)
    .append('hosp',hosp)
    .append('packageHeader',packageHeader)
    .append('fromDate',fromDate)
    .append('toDate',toDate);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getpackageDetails;
    return this.http.get(fullUrl, options);
  }

  getBenificiarydata(userId: any, state: any, district: any, hospital: any,fromDate: any, toDate: any, packageCode: any ) {
    console.log(packageCode+"--"+state+"--"+district+"--"+hospital+"--"+fromDate+"--"+toDate+"--"+packageCode); 
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('state',state)
    .append('district',district)
    .append('hospital',hospital)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('packageCode',packageCode);
   
    
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getpackagebenificiarydetails;
    return this.http.get(fullUrl, options);
  }

}
