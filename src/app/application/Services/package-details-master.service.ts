import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  deletepackagedetails,
  getSchemeDetails,
  getbypackagedetailsid,
  gethospitalcategory,
  getpackagedetails,
  getpackagedetailsdata,
  getpackageheader,
  getpackageheaderforspeciality,
  getpackagesubcategory,
  getpackagesubcategoryforspeciality,
  getprocedurecodeforspeciality,
  getviewspeciality,
  savepackagedetails,
  savespecilaity,
  updatepackagedetails,
} from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class PackageDetailsMasterService {
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  getAllHospitalCategory() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = gethospitalcategory;
    return this.http.get(fullUrl, options);
  }

  getAllHeader() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getpackageheader;
    return this.http.get(fullUrl, options);
  }

  getAllSubcategory(headerCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        packageheadercode: headerCode,
      },
    };
    var fullUrl = getpackagesubcategory;
    return this.http.get(fullUrl, options);
  }

  savePackageDetails(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = savepackagedetails;
    return this.http.post(fullUrl, data, options);
  }

  getPackageDetails(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getpackagedetails;
    return this.http.post(fullUrl,data, options);
  }

  getByPackageDetailsId(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getbypackagedetailsid + `/${id}`;
    return this.http.get(fullUrl, options);
  }

  deletePackageDetails(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = deletepackagedetails + `/${id}`;
    return this.http.delete(fullUrl, options);
  }

  updatePackageDetails(data: any, id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = updatepackagedetails + `/${id}`;
    return this.http.put(fullUrl, data, options);
  }
  getpackgaeheadercode() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getpackageheaderforspeciality;
    return this.http.get(fullUrl, options);
  }
  getpackgaesubcategorycode(packageheadercode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        packageheadercode: packageheadercode,
      },
    };
    var fullUrl = getpackagesubcategoryforspeciality;
    return this.http.get(fullUrl, options);
  }
  getprocedurecode(packagesubcode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        packagesubcode: packagesubcode,
      },
    };
    var fullUrl = getprocedurecodeforspeciality;
    return this.http.get(fullUrl, options);
  }
  getviewlist(
    packageheadercodeval: any,
    packagesubcode: any,
    procedurecode: any,
    searchtype: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let params = {
      packageheadercode: packageheadercodeval,
      packagesubcode: packagesubcode,
      procedurecode: procedurecode,
      searchtype: searchtype,
    };
    let options = {
      headers: headers,
      params: params,
    };
    var fullUrl = getviewspeciality;
    return this.http.get(fullUrl, options);
  }
  savespeciality(data: any) {
    console.log(data);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = savespecilaity;
    return this.http.post(fullUrl, data, options);
  }
  getAlldetails(procedurecode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let params = {
      procedurecode: procedurecode,
    };
    let options = {
      headers: headers,
      params: params,
    };
    var fullUrl = getpackagedetailsdata;
    return this.http.get(fullUrl, options);
  }

  getSchemeDetails(data: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
    };
    var fullUrl = getSchemeDetails;
    return this.http.post(fullUrl, data, options);
  }
}
