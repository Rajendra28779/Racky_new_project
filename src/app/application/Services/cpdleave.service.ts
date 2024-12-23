import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { approvedetails, getallcpdleavefilterrequest, getallcpdfilteractiondetails, cpdmappingdetails, getcpdleavehistory, cpdtoleavedetails, getallcpdactiondetails, getallcpdleaverequest, saveleave, getcpdleavestatus, deleteLeaveData, getFilterData, savesnaleaveApply, getsnappliedleavelist, cancelsnaleaveApply } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CpdleaveService {


  constructor(private httpclient: HttpClient, private jwtService: JwtService) { }

  getallcpdleaverequest(userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getallcpdleaverequest + "?userId=" + userId;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getallcpdleavefilterrequest(userId: any, fromdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'userId': userId,
        'formDate': fromdate,
        'Todate': todate
      }
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getallcpdleavefilterrequest;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getallcpdfilteractiondetails(userId: any, fromdate: any, todate: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'userId': userId,
        'formDate': fromdate,
        'Todate': todate
      }
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getallcpdfilteractiondetails;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getcpddetails(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = cpdtoleavedetails + "?userId=" + userId;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  saveLeaveData(object: { formdate: any; todate: any; remarks: any; createdby: any; }) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveleave;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.post(fullUrl, object, options)
  }

  Approvedetails(userID: any, user: any, item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = approvedetails + "?leaveId=" + user + "&approve=" + item + "&createby=" + userID;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getcpdmappingdetails(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = cpdmappingdetails + "?user=" + user;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getcpdleavehistory(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getcpdleavehistory + "?user=" + user;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getallcpdactiondetails(userId: any) {
    console.log("User id in ts====" + userId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = getallcpdactiondetails + "?userId=" + userId;
    //console.log(this.httpclient.get(fullUrl,options));
    return this.httpclient.get(fullUrl, options)
  }
  getAllcpdhistory(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }

    let token = this.jwtService.getJwtToken();
    var fullUrl = getcpdleavestatus + "?userId=" + userId;
    return this.httpclient.get(fullUrl, options)


  }

  deleteLeave(leaveId: any): Observable<any> {
    console.log("in service leaveid" + leaveId);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = deleteLeaveData + "?leaveId=" + leaveId;
    return this.httpclient.get(fullUrl, options)

  }
  // getAllFilterData(fromdate: any, todate: any) {
  //   console.log(fromdate+ "--"+todate);
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': this.jwtService.getJwtToken()
  //   })
  //   let queryparams = new HttpParams()
  //     .append('fromdate', fromdate)
  //     .append('todate', todate);
  //   let options = {
  //     headers: headers,
  //     params: queryparams
  //   }
  //   let fullUrl = getFilterData;
  //   return this.httpclient.get(fullUrl, options)
  // }

  getAllFilterData(userId: any, fromdate: any, todate: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('userId', userId)
      .append('fromdate', fromdate)
      .append('todate', todate);

    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getFilterData;
    return this.httpclient.get(fullUrl, options)
  }

  savesnaleaveApply(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    var fullUrl = savesnaleaveApply ;
    return this.httpclient.post(fullUrl,object, options)
  }

  getsnappliedleavelist(fromdate: any,todate:any, sna: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        fromdate:fromdate,
        todate:todate,
        sna:sna,
        userId:userId
      }
    }
    var fullUrl = getsnappliedleavelist ;
    return this.httpclient.get(fullUrl, options);
  }

  cancelsnaleaveApply(leaveId: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params:{
        leaveId:leaveId,
        userId:userId
      }
    }
    var fullUrl = cancelsnaleaveApply ;
    return this.httpclient.get(fullUrl, options);
  }

}
