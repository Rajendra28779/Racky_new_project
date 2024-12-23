import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { dcpartialclaimsubmit, getlistofpartialclaim, getlistofpartialclaimquery, getlistofpartialclaimview, getpartialclaimdcnoncomp, getpartialclaimdetailsdc, getpartialclaimdetailsofhosp, getpartialclaimhospnoncomp, getpartialclaimlistdc, getpartialclaimlistdcview, getpartialclaimlistgrv, getpartialclaimlogdetails, partialclaimqueryraise, partialclaimraise } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class PartiallfloatserviceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getpartialclaimlistgrv(formdate: any, todate: any, userId: any,schemeId:any,schemecatogoryId:any,status:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userId:userId,
        schemeId:schemeId,
        schemecatogoryId:schemecatogoryId,
        status:status
      }
    }
    let fullUrl = getpartialclaimlistgrv;
    return this.http.get(fullUrl, options)
  }

  getlistofpartialclaim(formdate: any, todate: any, userName: any,schemeID:any,schemecatogoryId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userName:userName,
        schemeID:schemeID,
        schemecatogoryId:schemecatogoryId
      }
    }
    let fullUrl = getlistofpartialclaim;
    return this.http.get(fullUrl, options);
  }

  getlistofpartialclaimview(formdate: any, todate: any, userName: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userName:userName,
        schemeID:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue
      }
    }
    let fullUrl = getlistofpartialclaimview;
    return this.http.get(fullUrl, options);
  }

  getlistofpartialclaimquery(formdate: any, todate: any, userName: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userName:userName,
        schemeID:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue
      }
    }
    let fullUrl = getlistofpartialclaimquery;
    return this.http.get(fullUrl, options);
  }


  getpartialclaimdetailsofhosp(transactionId: any, claimId: any, urn: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        transactionId:transactionId,
        claimId:claimId,
        urn:urn
      }
    }
    let fullUrl = getpartialclaimdetailsofhosp;
    return this.http.get(fullUrl, options);
  }

  partialclaimraise(formData: any) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = partialclaimraise;
    return this.http.post(fullUrl,formData,options);
  }

  getpartialclaimlistdc(formdate: any, todate: any, userId: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userId:userId,
        schemeId:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue,
      }
    }
    let fullUrl = getpartialclaimlistdc;
    return this.http.get(fullUrl, options)
  }

  getpartialclaimdetailsdc(transactionId: any, claimId: any, urn: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        transactionId:transactionId,
        claimId:claimId,
        urn:urn
      }
    }
    let fullUrl = getpartialclaimdetailsdc;
    return this.http.get(fullUrl, options);
  }

  dcpartialclaimsubmit(formData: FormData) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = dcpartialclaimsubmit;
    return this.http.post(fullUrl,formData,options);
  }

  getpartialclaimlistdcview(formdate: any, todate: any, userId: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userId:userId,
        schemeId:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue,
      }
    }
    let fullUrl = getpartialclaimlistdcview;
    return this.http.get(fullUrl, options)
  }

  getpartialclaimdcnoncomp(formdate: any, todate: any, userId: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userId:userId,
        schemeId:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue,
      }
    }
    let fullUrl = getpartialclaimdcnoncomp;
    return this.http.get(fullUrl, options)
  }
  getpartialclaimhospnoncomp(formdate: any, todate: any, userId: any, schemeidvalue: any, schemecategoryidvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        formdate:formdate,
        todate:todate,
        userId:userId,
        schemeId:schemeidvalue,
        schemecatogoryId:schemecategoryidvalue,
      }
    }
    let fullUrl = getpartialclaimhospnoncomp;
    return this.http.get(fullUrl, options)
  }

  partialclaimqueryraise(formData: FormData) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let fullUrl = partialclaimqueryraise;
    return this.http.post(fullUrl,formData,options);
  }

  getpartialclaimlogdetails(claimId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        claimId:claimId,
      }
    }
    let fullUrl = getpartialclaimlogdetails;
    return this.http.get(fullUrl, options)
  }



}
