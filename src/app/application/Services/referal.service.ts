import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { savereferal, getPatientData, getPatientDataByID, getNameByCardNo, getAgeByName, updatePatientDetails, savereferaldoc, downloadFileForReferral, getHospitallistdropdown, getSchemeCategoryListById, getSchemeList } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReferalService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveReferal(data: any){
    console.log(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = savereferal;
    return this.http.post(fullUrl,data,options);

  }

  saveReferalDoc(formData): Observable<any> {
    let headers = new HttpHeaders({
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = savereferaldoc;
    return this.http.post(fullUrl, formData, options);
  }

  getReferralPatientDetails(userId:any,fromDate:any, toDate:any,hospitacode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('userId',userId)
    .append('fromDate',fromDate)
    .append('toDate', toDate)
    .append('hospitacode', hospitacode);;
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getPatientData;
    return this.http.get(fullUrl, options)
  }

  getPatientDataByID(id:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        id: id,
      },
    };
    let fullUrl = getPatientDataByID;
    return this.http.get(fullUrl, options);
  }

  getNameByCardNo(schemeCategoryId:any,urn:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "urn": urn,
        "schemeCategoryId": schemeCategoryId,
      },
    };
    let fullUrl = getNameByCardNo;
    return this.http.get(fullUrl, options);
  }

  getAgeAndGenderByName(name:string){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "name": name,
      },
    };
    let fullUrl = getAgeByName;
    return this.http.get(fullUrl, options);
  }

  updatePatientDetails(object): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = updatePatientDetails;
    return this.http.post(fullUrl, object, options);
  }

  downloadFileForReferral(pdfName:any,hCode:any,dateOfAdm:any){
    let jsonObj = {
      f: pdfName,
      h: hCode,
      d: dateOfAdm,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downloadFileForReferral + '?' + 'data=' + queryParam;
    return url;
  }
  gethospitallist(userid:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
      params: {
        "userid": userid,
      },
    };
    let fullUrl = getHospitallistdropdown;
    return this.http.get(fullUrl, options);

  }
  getSchemeCategoryById(schemeId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('schemeId',schemeId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl =getSchemeCategoryListById;
    return this.http.get(fullUrl, options)
  }
  getSchemeList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers,
    }
    let fullUrl =getSchemeList;
    return this.http.get(fullUrl, options)
  }
}
