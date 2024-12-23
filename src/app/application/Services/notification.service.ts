import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  savenotification,
  getnotification,
  updatenotification,
  getnotificationshow,
  downLoadnotificatonDoc,
  getHospitalListClaimsNotVerified, getPendingHospitalClaims,
  downLoadnotificatonDocforfireandclicnical
} from 'src/app/services/api-config';
import { Observable } from "rxjs";
import { EncryptionService } from 'src/app/services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private encryptionService: EncryptionService) { }

  save(object: any, file: any) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
    }
    const formData: FormData = new FormData();
    formData.append('file2', file);
    formData.append('tdate', object.tdate)
    formData.append('sgroup', object.sgroup)
    formData.append('fdate', object.fdate)
    formData.append('noticeContent', object.noticeContent)
    formData.append('screate', object.screate)
    formData.append('popupFlag', object.popupFlag)
    let fullUrl = savenotification;
    return this.http.post(fullUrl, formData, options)
  }

  getalldata() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,

    }
    let fullUrl = getnotification;
    return this.http.get(fullUrl, options)
  }

  Update(object: any, file: any) {
    let headers = new HttpHeaders({

      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,

    }
    const formData: FormData = new FormData();
    formData.append('file2', file);
    formData.append('tdate', object.tdate)
    formData.append('sgroup', object.sgroup)
    formData.append('fdate', object.fdate)
    formData.append('noticeContent', object.noticeContent)
    formData.append('screate', object.screate)
    formData.append('notificationId', object.notificationId)
    formData.append('statusFlag', object.statusFlag)
    formData.append('popupFlag', object.popupFlag)
    let fullUrl = updatenotification;
    return this.http.post(fullUrl, formData, options)
  }

  getnotification(groupid: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let options = {
      headers: headers
    }
    let data = {
      groupid: groupid
    }
    let fullUrl = getnotificationshow;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options)
  }
  
  downloadFile(fileName) {
    console.log("hi");

    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadnotificatonDoc + '?' + 'data=' + queryParam;
    return url;
  }

  downloadFileSeedownloadfiletreatFireDistinguisher(fileName,flag,subFolder) {
    console.log("hi");

    let jsonObj = {
      fi: fileName,
      sf: subFolder,
      fl: flag,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadnotificatonDocforfireandclicnical + '?' + 'data=' + queryParam;
    return url;
  }

  getHospitalListClaimsNotVerified(userId: any, actionCode: any, days: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "userId": userId,
        "actionCode": actionCode,
        "days": days
      }
    }
    return this.http.get(getHospitalListClaimsNotVerified, options)
  }

  getPendingHospitalClaims(hospitalCode: any, userId: any, actionCode: any, days: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
      params: {
        "userId": userId,
        "hospitalCode": hospitalCode,
        "actionCode": actionCode,
        "days": days
      }
    }
    return this.http.get(getPendingHospitalClaims, options)
  }
}
