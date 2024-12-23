import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { empanelmentupdationlist, getApplicantProfileDuplicate, sendOtpForEmpanel, updateEmpanelDetails, verifyOtpForEmpanel } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class EmpanelmentdtlupdationservService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getListHospfordetailUpdation(hospitalCode) {
    console.log('hospital code')
    console.log(hospitalCode);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    // let queryparams = new HttpParams()
    // .append('hospitalCode',hospitalCode);
    
    let options = {
      headers: headers,
      params: {
        'hospitalCode':hospitalCode
      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl =empanelmentupdationlist;
    return this.http.get(fullUrl, options);
    
  }
  UpdateDetails(formData) {
    //alert(claimAmount)
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    let fullUrl = updateEmpanelDetails;
    console.log(formData);
    return this.http.post(fullUrl, formData, options);
  }
  checkMobileNumberDuplicate(mobile,profileId) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    
    let options = {
      headers: headers,
      params: {
        'mobile':mobile,
        'profileId':profileId
      }
    }
    let fullUrl =getApplicantProfileDuplicate;
    return this.http.get(fullUrl, options);
    
  }
  OtpForEmpanelLogin(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let fullUrl = sendOtpForEmpanel;
    return this.http.post(fullUrl, data, options);
  }
  ValidateOtpEmp(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
    };
    let fullUrl = verifyOtpForEmpanel;
    return this.http.post(fullUrl, data, options);
  }
}
