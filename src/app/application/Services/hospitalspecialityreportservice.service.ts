import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPackageHeaderCode, getSpecialityPackages, gethospitallist, getproceduretagdocument,
   gettaggedpackagedetails, submitTaggedProcedure, taggedprocedurelist,getProcedurethroughpackagecode, savedocproceduremapping, getdocproctaggedlist, getproceduretagggeddoclist, getdocproctaggedlistforexcel } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root',
})
export class HospitalspecialityreportserviceService {


  constructor(private http: HttpClient, private jwtService: JwtService) {}

  public editViewFlag: string;
  public editViewData: any;

  public setEditViewFlag(editViewFlag: string){
    this.editViewFlag = editViewFlag;
  }
  public getEditViewFlag(){
    return this.editViewFlag;
  }
  public setEditViewData(editViewData: any){
    this.editViewData = editViewData;
  }
  public getEditViewData(){
    return this.editViewData;
  }

  getlist(
    userId: any,
    hsptltype: any,
    state: any,
    dist: any,
    hospitalcode: any
  ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    // console.log(requestData);

    let options = {
      headers: headers,
      params: {
        actioncode: hsptltype,
        state: state,
        dist: dist,
        hospital: hospitalcode,
        userid: userId,
      },
    };
    let fullUrl = gethospitallist;
    return this.http.get(fullUrl, options);
  }

  getPackages(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        packageCode: data.packagecode,
        hospitalCode: data.hospitalcode,
      },
    };
    let fullUrl = getSpecialityPackages;
    return this.http.get(fullUrl, options);
  }

  submitTaggedProcedureDetails( procedurePackageBean ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl = submitTaggedProcedure;
    return this.http.post(fullUrl, procedurePackageBean, options);
  }

  getPackageHeaderCodeList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl = getPackageHeaderCode;
    return this.http.get(fullUrl, options);
  }

  getProcedurePackageInfo( procedurePackageBean ) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl = taggedprocedurelist;
    return this.http.post(fullUrl, procedurePackageBean, options);
  }

  getTaggedPackegeDetails(stateId, districtId, hospitalId, taggedType) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        stateId: stateId,
        districtId: districtId,
        hospitalId: hospitalId,
        taggedType: taggedType
      },
    };
    let fullUrl = gettaggedpackagedetails;
    return this.http.get(fullUrl, options);
  }

  getproceduretagdocument(procedureCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        procedureCode: procedureCode
      },
    };
    let fullUrl = getproceduretagdocument;
    return this.http.get(fullUrl, options);
  }

  getProcedurethroughpackagecode(headerCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        "headerCode": headerCode
      },
    };
    let fullUrl = getProcedurethroughpackagecode;
    return this.http.get(fullUrl, options);
  }

  savedocproceduremapping(object:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers
    };
    let fullUrl = savedocproceduremapping;
    return this.http.post(fullUrl,object, options);
  }

  getdocproctaggedlist(headerCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        "headerCode": headerCode
      },
    };
    let fullUrl = getdocproctaggedlist;
    return this.http.get(fullUrl, options);
  }

  getproceduretagggeddoclist(procedureCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        "procedureCode": procedureCode
      },
    };
    let fullUrl = getproceduretagggeddoclist;
    return this.http.get(fullUrl, options);
  }

  getdocproctaggedlistforexcel(headerCode: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {
        "headerCode": headerCode
      },
    };
    let fullUrl = getdocproctaggedlistforexcel;
    return this.http.get(fullUrl, options);
  }

}
