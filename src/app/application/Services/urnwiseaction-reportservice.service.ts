import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { getDishounrDetails, getHighEndDrugDetails, getImplantDetails, getUrnWiseActionDetails, geturnWiseWardDetail } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class UrnwiseactionReportserviceService {

  constructor(private jwtService: JwtService, private http: HttpClient) { }

  getDetailsUrn(urnNo: any,transId) {
    // alert(urnNo+"--"+transId+"--");
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('transId',transId)
    .append('urnNo',urnNo);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getUrnWiseActionDetails;
    return this.http.get(fullUrl, options);
    
  }

  getDishonrData(urnNo: any, clmId: any) {
    console.log(urnNo+"---"+clmId);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('clmId',clmId)
    .append('urnNo',urnNo);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getDishounrDetails;
    return this.http.get(fullUrl, options);
   
  }

  getWardDetail(urnNo: any, transId: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('transId',transId)
    .append('urnNo',urnNo);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = geturnWiseWardDetail;
    return this.http.get(fullUrl, options);
  }

  getHighEndDrug(urnNo: any, transId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('transId',transId)
    .append('urnNo',urnNo);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getHighEndDrugDetails;
    return this.http.get(fullUrl, options);
  }

  getImplantData(urnNo: any, transId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('transId',transId)
    .append('urnNo',urnNo);
    
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getImplantDetails;
    return this.http.get(fullUrl, options);
  }

 
}
