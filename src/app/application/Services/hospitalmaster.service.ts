import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { checkAuthAssignedToHosp, getAuthById, getDistrictList, getHospitalAuthDetails, getHospitalAuthorityList, getHospitalMaster, getHospitalUserDetails, saveHospitalConfiguration, updateHospitalConfiguration } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalmasterService {


  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private jwtService: JwtService) { }
  getDistrictListByStateCode(stateCode) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams().append('stateCode', stateCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getDistrictList;
    return this.http.get(fullUrl, options)

  }
  getHospitalList(stateCode,distCode){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken(),
    })
    let queryparams = new HttpParams()
    .append('stateCode', stateCode)
    .append('distCode', distCode);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getHospitalMaster;
    return this.http.get(fullUrl, options)
  }
  getHospitalAuthList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    let fullUrl = getHospitalAuthDetails;
    return this.http.get(fullUrl, options);
  }
  getHospitalUserList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };

    let fullUrl = getHospitalUserDetails;
    return this.http.get(fullUrl, options);
  }
  saveHospitalConfiguration(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    // alert(object)
    let fullUrl = saveHospitalConfiguration;
    return this.http.post(fullUrl, object, options);
  }
  updateHospitalConfiguration(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    // alert(object)
    let fullUrl = updateHospitalConfiguration;
    return this.http.post(fullUrl, object, options);
  }
  checkDuplicateAssignToHosp(object) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers
    };
    //var url = "snoConfiguration/saveSNOConfiguration";
    let fullUrl = checkAuthAssignedToHosp;
    return this.http.post(fullUrl, object, options);

  }
  getAuthConfigurationList(userId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let queryparams = new HttpParams()
    .append('userId', userId);
    let options = {
      headers: headers,
      params: queryparams
    }
    // var url = "cpdConfiguration/getCpdConfigurationDetails";
    let fullUrl = getHospitalAuthorityList;
    return this.http.get(fullUrl, options);
  }
  getbyid(UserId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams().append('UserId', UserId);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getAuthById;
    return this.http.get(fullUrl, options);
  }
}
