import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getallFacilityDetail, getFacilityDetailsById, saveFacilityDetails, updateFacilitatyDetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class FacilityDetailServiceService {
 

  constructor(private http: HttpClient, private jwtService: JwtService) { }

  saveFacilityData(object: { facilityName: any; createdBy: any; }) {
    // alert("Data in service========"+ JSON.stringify(object));
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    console.log("facilityName : " + object.facilityName)
    let options = {
      headers:headers
    }
    let token = this.jwtService.getJwtToken();
    var fullUrl = saveFacilityDetails;
    return this.http.post(fullUrl,object,options);
  }

  getallFacilityData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl =getallFacilityDetail;
    return this.http.get(fullUrl,options)
  }

  getbyId(facilityDetailId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getFacilityDetailsById + "?facilityDetailId=" + facilityDetailId;
    return this.http.get(fullUrl, options);
  }

  updateFacilityDetial(updateFacilitate: any) {
    console.log("upfate data comes in service"+updateFacilitate);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers
      }
      var fullUrl =updateFacilitatyDetails;
      return this.http.post(fullUrl,updateFacilitate,options);
  }
}
