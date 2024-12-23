import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getHospitalForAdmin, gethospitalwiseclaimreportdata,getAllDischargeCountAndAllsubmittedDetails, getClaimList, executeProcess, getSnaWisePaymentStatus } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalWiseClaimReportServiceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  getHospitalForAdminList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl =getHospitalForAdmin;
    return this.http.get(fullUrl, options);
    
  }



  searchhospitalwiseclaimreportdata(userId: any,fromdate: any,todate: any,hospitalId: any) {
   
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('fromDate',fromdate)
    .append('toDate',todate)
    .append('hospitalId',hospitalId);
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = gethospitalwiseclaimreportdata;
    return this.http.get(fullUrl, options);
  }



  searchhospitalwiseclaimreportdetails(userId: any,fromDate: any,toDate: any,hospitalId: any,eventName:any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('fromDate',fromDate)
    .append('toDate',toDate)
    .append('hospitalId',hospitalId)
    .append('serchby',eventName)
    ;
    let options = {
      headers: headers,
      params: queryparams
    };
    //var url = "master/getDistrictDetailsByStateId/" + stateCode;
    let fullUrl = getAllDischargeCountAndAllsubmittedDetails;
    return this.http.get(fullUrl, options);
  }
  
  getClaimList(requestData) {
    console.log(requestData)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    }
    let fullUrl = getClaimList;
    return this.http.post(fullUrl,requestData,options)
  }

  executeProcess(urn:any, processId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('urn',urn)
      .append('processId',processId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = executeProcess;
    return this.http.get(fullUrl, options);
  }
  getSNAWiseStatusReport(requestData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl = getSnaWisePaymentStatus;
    return this.http.post(fullUrl, requestData, options)
  }





}
