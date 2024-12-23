import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { deleteLeaveDataForAdmin, getAllCpdLeaveData, getCPDFliterDataAdmin, getCpdUserNameForAdmin, saveleaveForAdmin } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdLeaveAdminServiceService {
  
  
  
 
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getCpdNameList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getCpdUserNameForAdmin;
    return this.http.get(fullUrl, options);
    
  }
  getAllFilterData(bskyUserId: any, fromdate: any, todate: any) {
    console.log(bskyUserId+ " --"+fromdate+ "--"+todate);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('bskyUserId', bskyUserId)
      .append('fromdate', fromdate)
      .append('todate', todate);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getCPDFliterDataAdmin;
    return this.http.get(fullUrl, options)
   
  }

  saveLeaveData(object: { bskyUserId: any; formdate: any; todate: any; remarks: any; createdby:any; }) {
    console.log("Data in service========"+object);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveleaveForAdmin;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.post(fullUrl,object,options)
  }
  getAllcpdhistory(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getAllCpdLeaveData+"?userId="+userId;;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.http.get(fullUrl,options)
  }

  deleteLeaveAdmin(leaveId: any): Observable<any>  {
    console.log("in service leaveid"+leaveId);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = deleteLeaveDataForAdmin+ "?leaveId=" + leaveId;
    return this.http.get(fullUrl,options)
    
  }
  


  
}
