import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtService } from 'src/app/services/jwt.service';
import { checkDuplicateUser, getuserbyid, createuser, getAllUserDetails, DetailsFilteredByGroup,
  updateuser, getStateMasterDetails, getDistrictDetailsByStateId, getuserbyuserid, getAllGroups,
  saveProfilelog, updateUserLoginOtp, userLoginOtpLog,
  swasthyamitrageotagupdate,
  getuserlistformobilenoupdate,
  updatemobilenoofuser,
  getmobilenoupdateloglist,
  getekycotp,
  verifyekyc,
  finalverifyekyc,
  genrateotpprofileupdate,
  genrateotphospitalopt} from 'src/app/services/api-config';
import { EncryptionService } from 'src/app/services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class UsercreateService {


  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private encryptionService: EncryptionService) { }

  checkDuplicateUser(userName: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    };
    let fullUrl = checkDuplicateUser + "?userName=" + userName;
    return this.http.get(fullUrl, options);
  }

  getbyid(items:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getuserbyid+"?bskyUserId="+items;
    return this.http.get(fullUrl,options)
  }

  getbyuserid(userId:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = { headers:headers };
    let data = { userId: userId };
    return this.http.post(getuserbyuserid, this.encryptionService.encryptRequest(data), options);
  }

  saveData(formData:any) {
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = createuser;
    return this.http.post(fullUrl,formData,options);

  }

  updateUser(formData:any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateuser;
    return this.http.post(fullUrl,formData,options);
  }

  getGroupList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "master/getStateMasterDetails";
    let fullUrl = getAllGroups;
    return this.http.get(fullUrl, options);
  }

  getUserDetailsData(groupId: any, stateId: any, districtId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
      .append('groupId', groupId)
      .append('stateId', stateId)
      .append('districtId', districtId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getAllUserDetails;
    return this.http.get(fullUrl, options)
  }

  getUsersFilteredByGroup(groupId) {
    // return this.http.get<any>(`${this.baseUrl+"api/getDistrictMappingDetailsFilteredByDepartment"}/${stateId}`);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('groupId', groupId);
    let options = {
      headers: headers,
      params: queryparams
    }

    //var url = "cpdConfiguration/Delete";
    let fullUrl = DetailsFilteredByGroup;
    return this.http.get(fullUrl, options);
  }

  getStateList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getStateMasterDetails;
    return this.http.get(fullUrl, options);
  }

  getDistrictListByStateId(stateCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });

    let queryparams = new HttpParams().append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    };
    let fullUrl = getDistrictDetailsByStateId;
    return this.http.get(fullUrl, options);
  }

  saveProfilelog(userId:any, createdBy:any): Observable<any>{
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let data = {
      userId: userId,
      createdBy: createdBy
    }
    var fullUrl = saveProfilelog;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options);
  }
  updateUserOtp(formData:any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = updateUserLoginOtp;
    return this.http.post(fullUrl,formData,options);
  }
  viewhistory(formData){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = userLoginOtpLog;
    return this.http.post(fullUrl,formData,options);
  }
  updateGeoTagging(formData:any): Observable<any>{
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = swasthyamitrageotagupdate;
    return this.http.post(fullUrl,formData,options);
  }

  getuserlistformobilenoupdate(grp: any, userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        grp:grp,
        userId:userId
      }
    }
    var fullUrl = getuserlistformobilenoupdate;
    return this.http.get(fullUrl,options);
  }

  updatemobileno(userid: any, mobile: any, email: any, rqst: any, description: any,createby:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userid:userid,
        mobile:mobile,
        email:email,
        rqst:rqst,
        description:description,
        createby:createby,
      }
    }
    var fullUrl = updatemobilenoofuser;
    return this.http.get(fullUrl,options);
  }

  getmobilenoupdateloglist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params:{
        userId:userId
      }
    }
    var fullUrl = getmobilenoupdateloglist;
    return this.http.get(fullUrl,options);
  }
  getEkycOtp(reqData:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = { headers:headers };
    return this.http.post(getekycotp,reqData, options);
  }
  verifyekyc(reqData:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = { headers:headers };
    return this.http.post(verifyekyc,reqData, options);
  }
  finalVerifyEkyc(ekycdata){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    return this.http.post(finalverifyekyc, ekycdata, options);
  }
  generateOtpUpdate(mobile:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'mobileNo':mobile
      }
    }
    let fullUrl = genrateotpprofileupdate;
    return this.http.get(fullUrl, options);
  }
  generateOtpHospital(mobile:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'mobileNo':mobile
      }
    }
    let fullUrl = genrateotphospitalopt;
    return this.http.get(fullUrl, options);
  }
}
