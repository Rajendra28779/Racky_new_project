import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getclaimdetailsbyclaimid,getdchospitallist,getpreauthdetails, getclaimTracking,gethospitalclaimTracking, getadminclaimTracking, getvitalparameterdetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class TrackingTransistServiceService {


  constructor(private http: HttpClient,private jwtService: JwtService) { }

  gethospitalTrackingReports(fromDate: any, toDate: any, urn: any,hospitalcode :any, searchby: any, userId: any ,pageIn:any,pageEnd:any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
     .append('userid',userId)
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('urn', urn)
    .append('hospitalcode', hospitalcode)
    .append('searchby', searchby)
    .append('pageIn', pageIn)
    .append('pageEnd', pageEnd);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =gethospitalclaimTracking;
    return this.http.get(fullUrl, options)
  }
  getdchospital(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
     .append('userid',userId)
    ;
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getdchospitallist;
    return this.http.get(fullUrl, options)
  }

  getTrackingReports(fromDate,toDate,urn,claimno,hospitalcode,searchby,pageIn:any,pageEnd:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('fromDate', fromDate)
    .append('toDate', toDate)
    .append('urn', urn)
    .append('claimno', claimno)
    .append('hospitalcode', hospitalcode)
    .append('searchby', searchby)
    .append('pageIn', pageIn)
    .append('pageEnd', pageEnd);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getclaimTracking;
    return this.http.get(fullUrl, options)
  }
  getpreauthdetails(urn: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    // .append('userid',userid)
    .append('urn', urn)   ;
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getpreauthdetails;
    return this.http.get(fullUrl, options)
  }
  gettrackingdetails(claimid: any) {
    // alert("hii")
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    // .append('userid',userid)
    .append('claimid', claimid)   ;
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getclaimdetailsbyclaimid;
    return this.http.get(fullUrl, options)
  }
  getAdminTrackingReports(fromDate:any, toDate:any,urn:any, bskyUserId:any,hospitalCode:any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('bskyUserId',bskyUserId)
    .append('fromDate',fromDate)
    .append('toDate', toDate)
    .append('urn', urn)
    .append('hospitalCode',hospitalCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getadminclaimTracking;
    return this.http.get(fullUrl, options)
  }

  getvitaldetails(urn:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('urn',urn)
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getvitalparameterdetails;
    return this.http.get(fullUrl, options)
  }
}
