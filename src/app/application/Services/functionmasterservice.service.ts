import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { savefunctionmaster,getfunctionmaster,deletefunctionmaster,getfloatedetails,getbyfunctionmaster,updatefunctionmaster, getMISReportLinkList, saveunlinkedfunctionmaster, getunlinkedfunctionmaster, removeunlinkedfunctionmaster, getUserDetailsList, getunlinkedfunctionbyid, updateunlinkedfunctionmaster } from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class FunctionmasterserviceService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  save(items:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savefunctionmaster;
    return this.http.post(fullUrl,items,options)
  }

  saveUnlinkedFunctionMaster(items:any)
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = saveunlinkedfunctionmaster;
    return this.http.post(fullUrl,items,options)
  }

  update(update: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updatefunctionmaster;
    return this.http.post(fullUrl,update,options)
  }

  updateUnlinkedFunctionMaster(update: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateunlinkedfunctionmaster;
    return this.http.post(fullUrl,update,options)
  }

  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getfunctionmaster;
    return this.http.get(fullUrl,options)
  }

  getUnlinkedFunctionMasterList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getunlinkedfunctionmaster;
    return this.http.get(fullUrl,options)
  }

  delete(userid:any,item:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId': userid,
        'fnid': item
      }
    }
    var fullUrl = deletefunctionmaster;
    return this.http.get(fullUrl,options)
  }

  removeUnlinkedFunctionMaster(userid:any,item:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId': userid,
        'fnid': item
      }
    }
    var fullUrl = removeunlinkedfunctionmaster;
    return this.http.get(fullUrl,options)
  }

  getbyid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'fnid': user
      }
    }
    var fullUrl = getbyfunctionmaster;
    return this.http.get(fullUrl,options)
  }

  getUnlinkedFunctionById(functionId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'functionId': functionId
      }
    }
    var fullUrl = getunlinkedfunctionbyid;
    return this.http.get(fullUrl,options)
  }



  getfloatedetailsbyid(user: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'floateno':user
      }
    }
    var fullUrl = getfloatedetails;
    return this.http.get(fullUrl,options)
  }

  getallReportMasterdata(userId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'userId':userId
      }
    }
    var fullUrl = getMISReportLinkList;
    return this.http.get(fullUrl,options)
  }

  getAllUserDetails() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getUserDetailsList;
    return this.http.get(fullUrl, options);
  }
}
