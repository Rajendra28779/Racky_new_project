import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {getcpdwiseperformace,
  getcpdwiseperformacedetails, treatmenthistorybyrationcarddetails, gethospongingtreatmentdtls,
  getauthlivestatus, getauthdetails, blockedcaselogdetailsof1, saveicdsearchlog
} from 'src/app/services/api-config';


@Injectable({
  providedIn: 'root'
})
export class MisreportService {


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }



  treatmenthistorydetails(trtmntid: any, actioncode: any, packageid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "treatmentid": trtmntid,
        "action": actioncode,
        "packageid": packageid,
      }
    }
    let fullUrl = treatmenthistorybyrationcarddetails;
    return this.http.get(fullUrl, options)
  }
  getcpdwiseperformace(searchby: any, cpdId: any, fromdate: any, todate: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "cpdid": cpdId,
        "action": searchby,
        "fromdate": fromdate,
        "todate": todate,
        "userid": userid,
      }
    }
    let fullUrl = getcpdwiseperformace;
    return this.http.get(fullUrl, options)
  }

  getcpdwiseperformacedetails(user: any, cpdid: any, fdate: any, tdate: any, serchtype: any, type: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "cpdid": cpdid,
        "action": type,
        "fromdate": fdate,
        "todate": tdate,
        "userid": user,
        "serchtype": serchtype,
      }
    }
    let fullUrl = getcpdwiseperformacedetails;
    return this.http.get(fullUrl, options)
  }



  gethospongingtreatmentdtls(flag: any, hospitalcode: any, fromdate: any, todate: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    // alert(flag+hospitalcode+fromdate+todate+userid)
    let options = {
      headers: headers,
      params: {
        "formdate": fromdate,
        "toDate": todate,
        "hospital": hospitalcode,
        "flag": flag,
        "userId": userid
      }
    }
    let fullUrl = gethospongingtreatmentdtls;
    return this.http.get(fullUrl, options)
  }

  getauthlivestatus(fromDate: any, state: any, dist: any, hospital: any, userid: any) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "formdate": fromDate,
        "state": state,
        "dist": dist,
        "hospital": hospital,
        "userId": userid
      }
    }
    let fullUrl = getauthlivestatus;
    return this.http.get(fullUrl, options)
  }
  getauthdetails(hospitalcode: any, fromdate: any, todate: any, flag: any, type: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "formdate": fromdate,
        "todate": todate,
        "flag": flag,
        "type": type,
        "hospital": hospitalcode,
      }
    }
    let fullUrl = getauthdetails;
    return this.http.get(fullUrl, options)
  }

  blockedcaselogdetailsof1(txnid: any, pkgid: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "txnid": txnid,
        "pkgid": pkgid,
        "userId": userId
      }
    }
    let fullUrl = blockedcaselogdetailsof1;
    return this.http.get(fullUrl, options)
  }

  geticdlog(icdcode: any, icdname: any, icdmode: any, userId: any, searchkey: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let object = {
      "icdCode": icdcode,
      "icdName": icdname,
      "icdMode": icdmode,
      "createdBy": userId,
      "searchkey": searchkey
    }
    let options = {
      headers: headers
    }
    let fullUrl = saveicdsearchlog;
    return this.http.post(fullUrl, object, options)
  }



}
