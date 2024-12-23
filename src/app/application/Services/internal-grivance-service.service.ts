import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtService } from 'src/app/services/jwt.service';
import { ActivatedRoute } from '@angular/router';
import { getGrievanceListData, saveGrievanceInternalAll,downLoadintgrvDoc, getInternalGrievanceById, updateGrievanceDetails, getGrievanceDetails, getAllFilterDataGrievnce } from 'src/app/services/api-config';
import { param } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class InternalGrivanceServiceService {

  email: any;


  constructor(private jwtService: JwtService, private http: HttpClient, private activatedRoute: ActivatedRoute) { }

  saveGrievanceInternal(object: { groupId: any; grivance: any; email: any; categoryType: any; priority: any; description: any ,
    phoneno:any,fullname:any, grievanceSource:any, moduleName:any, createdBy:any,expectedDate:any}, fileName: any) {

    console.log(fileName);
    console.log(this.email);
    console.log(object.expectedDate+"comes");


    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
    }
    const formData: FormData = new FormData();
    formData.append('documentName1', fileName);
    formData.append('sgroup', object.groupId);
    // formData.append('groupId', object.groupId);
    formData.append('mobileNo', object.grivance);
    formData.append('fullname', object.fullname);
    formData.append('phoneno', object.phoneno);
    formData.append('email', object.email);
    formData.append('grievanceSource', object.grievanceSource);
    formData.append('moduleName', object.moduleName);
    formData.append('categoryType', object.categoryType);
    formData.append('priority', object.priority);
    formData.append('description', object.description);
    formData.append('createdBy', object.createdBy);
    formData.append('expectedDate', object.expectedDate);
    let fullUrl = saveGrievanceInternalAll;
    return this.http.post(fullUrl,formData,options)
  }

  getAllGrievanceData() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getGrievanceListData;
    return this.http.get(fullUrl, options);
  }
  getGrievanceByDetails(name: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    let options = {
      headers: headers,
      params: {
        "typeId": name
      }
    };
    let fullUrl = getGrievanceDetails;
    return this.http.get(fullUrl, options);
  }

  downloadFile(fileName) {
    console.log("hi");

    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadintgrvDoc + '?' + 'data=' + queryParam;
    return url;
  }
  getbyid(item: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers,
      params: {
        'grievanceId': item,

      }
    }
    // let token = this.jwtService.getJwtToken();
    let fullUrl = getInternalGrievanceById;
    return this.http.get(fullUrl, options);
  }
  Update(object: {grievanceId:any, groupId: any; grivance: any; email: any; categoryType: any; priority: any; description: any ,
    phoneno:any,fullname:any, grievanceSource:any, moduleName:any, updatedBy:any,statusFlag:any, closingDate:any,assignedName:any}, fileName: any){
      // console.log(fileName);
      // console.log(grivance);
      let headers = new HttpHeaders({
        'Authorization': this.jwtService.getJwtToken(),
      })

      let options = {
        headers: headers,
      }
      const formData: FormData = new FormData();
      formData.append('documentName1', fileName);
      formData.append('sgroup',object.groupId);
      formData.append('grievanceId', object.grievanceId);
      formData.append('phoneno', object.phoneno);
      formData.append('email', object.email);
      formData.append('categoryType', object.categoryType);
      formData.append('priority', object.priority);
      formData.append('description', object.description);
      formData.append('grievanceSource',object.grievanceSource);
      formData.append('moduleName',object.moduleName);
      formData.append('fullname', object.fullname);
      formData.append('statusFlag', object.statusFlag);
      formData.append('updatedBy', object.updatedBy);
      formData.append('assignedName', object.assignedName);
      formData.append('closeDate', object.closingDate);
      // formData.append('actualDate', object.actualDate);
      let fullUrl = updateGrievanceDetails;
      return this.http.post(fullUrl,formData,options)
  }

  getAllFilterData(categoryType:any, priority: any,fromDate:any,toDate:any,statusFlag:any) {
    console.log(categoryType+"--"+priority+"--"+status+"--"+fromDate+"--"+toDate+"--"+statusFlag);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let queryparams = new HttpParams()
      .append('categoryType', categoryType)
      .append('priority', priority)
      .append('fromDate',fromDate)
      .append('toDate',toDate)
      .append('statusFlag', statusFlag);
    let options = {
      headers: headers,
      params: queryparams
    }
    let fullUrl = getAllFilterDataGrievnce;
    return this.http.get(fullUrl, options)
  }

  update(assinedTo: any, statusFlag: any, closingDate: any, id: any,userid:any, closingDescription) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'assinedTo': assinedTo,
        'statusFlag': statusFlag,
        'closingDate': closingDate,
        'id': id,
        'updatedBy':userid,
        'closingDescription':closingDescription
      }
    }
    var fullUrl =updateGrievanceDetails;
    return this.http.get(fullUrl,options)
  }
}
