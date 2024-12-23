import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import{ updateHospitaloperatorData,saveHospitaloperatorData,gethospitaloperatorDetails, getappliedhospitaloperatorlist, getoperatorbyid, takeactiononhospitaloperatorlist, gethospwiseoperatorcount, getoperatoridthroughuserid, gethospwiseoperatorlistreport, actionhospitaloperatoruser} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class HospitaloperatorService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  updateUser(formData:any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateHospitaloperatorData;
    return this.http.post(fullUrl,formData,options);
  }

  saveData(formData:any) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = saveHospitaloperatorData;
    return this.http.post(fullUrl,formData,options);

  }

  getUserDetails(hospitalcode:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'hospitalcode': hospitalcode,

      }
    }
    let fullUrl = gethospitaloperatorDetails;
    return this.http.get(fullUrl, options)
  }

  getappliedhospitaloperatorlist(groupId: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'groupId': groupId,
        'userid': userid,
      }
    }
    let fullUrl = getappliedhospitaloperatorlist;
    return this.http.get(fullUrl, options)
  }
  getoperatorbyid(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'operatorid': item,
      }
    }
    let fullUrl = getoperatorbyid;
    return this.http.get(fullUrl, options)
  }

  takeactiononhospitaloperatorlist(action: any, operatorid: any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'action': action,
        'operatorid':operatorid,
        'createby':userid,
      }
    }
    let fullUrl = takeactiononhospitaloperatorlist;
    return this.http.get(fullUrl, options)
  }

  gethospwiseoperatorcount(state:any,dist:any,hospital:any,userid:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'statecode': state,
        'distcode':dist,
        'hospital':hospital,
        'userid':userid,
      }
    }
    let fullUrl = gethospwiseoperatorcount;
    return this.http.get(fullUrl, options)
  }

  getoperatoridthroughuserid(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'userId': userId
      }
    }
    let fullUrl = getoperatoridthroughuserid;
    return this.http.get(fullUrl, options)
  }

  gethospwiseoperatorlistreport(state: any, dist: any, hospitalcode: any, userid: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        'statecode': state,
        'distcode':dist,
        'hospital':hospitalcode,
        'userid':userid,
      }
    }
    let fullUrl = gethospwiseoperatorlistreport;
    return this.http.get(fullUrl, options)
  }
  actionOperatorUser(formData:any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = actionhospitaloperatoruser;
    return this.http.post(fullUrl,formData,options);
  }
}
