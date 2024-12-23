import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  checkcardbalance,
  checkbeneficry,
  getaccessuserlist,
  generateotpchkbalance,
  validateotpchkbalance,
  beneficiarysearchbyname,
  getDistrictListofnfsa,
  getlistthroughurn,
  getcarddetailsthroughurn,
  checkcardbalancelog,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class HealthDeptDtlAdauthServiceService {
  constructor(private http: HttpClient, private jwtService: JwtService) {}

  getaccessuserlist() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getaccessuserlist;
    return this.http.get(fullUrl, options);
  }

  generateotp(id: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        accessid: id,
      },
    };
    var fullUrl = generateotpchkbalance;
    return this.http.get(fullUrl, options);
  }

  validateotp(otp: any, userid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        otp: otp,
        accessid: userid,
      },
    };
    var fullUrl = validateotpchkbalance;
    return this.http.get(fullUrl, options);
  }

  checkcardbalance(
    urn: any,
    search: any,
    schemeId: any,
    schemeCategoryId: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urn: urn,
        search: search,
        schemeId: schemeId,
        schemeCategoryId: schemeCategoryId,
      },
    };
    var fullUrl = checkcardbalance;
    return this.http.get(fullUrl, options);
  }
  checkbeneficry(
    urn: any,
    search: any,
    id: any,
    schemeId: any,
    schemeCategoryId: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urn: urn,
        search: search,
        accessid: id,
        schemeId: schemeId,
        schemeCategoryId: schemeCategoryId,
      },
    };
    var fullUrl = checkbeneficry;
    return this.http.get(fullUrl, options);
  }
  searchbyname(
    distid: any,
    searchtype: any,
    textvalue: any,
    schemeId: any,
    schemeCategoryId: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        distid: distid,
        searchtype: searchtype,
        textvalue: textvalue,
        schemeId: schemeId,
        schemeCategoryId: schemeCategoryId,
      },
    };
    var fullUrl = beneficiarysearchbyname;
    return this.http.get(fullUrl, options);
  }

  getDistrictListofnfsa() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getDistrictListofnfsa;
    return this.http.get(fullUrl, options);
  }
  getlistthroughurn(
    urno: any,
    token: any,
    schemeId: any,
    schememCategoryId: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urnno: urno,
        schemeId: schemeId,
        schememCategoryId: schememCategoryId,
      },
    };
    let fullUrl = getlistthroughurn;
    return this.http.get(fullUrl, options);
  }

  getcarddetailsthroughurn(
    urn: any,
    type: any,
    schemeidvalue: any,
    schemeCategoryIdValue: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        urn: urn,
        search: type,
        schemeidvalue: schemeidvalue,
        schemeCategoryIdValue: schemeCategoryIdValue,
      },
    };
    let fullUrl = getcarddetailsthroughurn;
    return this.http.get(fullUrl, options);
  }
  checkCardBalanceLog(fromdate:any,todate:any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params:{
        fromdate:fromdate,
        todate:todate,
        userid:userid
      }
    };
    var fullUrl = checkcardbalancelog;
    return this.http.get(fullUrl, options);
  }
}
