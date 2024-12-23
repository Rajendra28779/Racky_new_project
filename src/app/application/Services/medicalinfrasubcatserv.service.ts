import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { deleteGroupType, getGroupTypeList, saveGroupTypeData, getGroupTypeListbyid, grouptypeupdate, checkgrpTypeData, savemedicalinfracat, medicalinfracatlist, medicalinfracatdatabyid, updatemedicalinfracat, getCategorylist, savesubcategory, medicalinfrasubcatlist, medicalinfrasubcatdatabyid, updatesubcategory } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class MedicalinfrasubcatservService {

  constructor(private http: HttpClient, private jwtService: JwtService) { }


  getCategoryList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = getCategorylist;
    return this.http.get(fullUrl, options);
  }

  savesubcategory(subcategory:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =savesubcategory+'?medInfracatId='+subcategory.medInfracatId+'&medInfraSubCatName='+subcategory.medInfraSubCatName+'&createdBy='+subcategory.createdBy
   return this.http.get(fullUrl,options)
  }

  

  
  getMedicalSubCategoryList() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers: headers
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = medicalinfrasubcatlist
    return this.http.get(fullUrl, options);

  }


  getbyid(user: any) {
    console.log("Id comes in service"+user);
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params: {
        'medInfraSubCatId': user,

      }
    }
    let token = this.jwtService.getJwtToken();
    let fullUrl = medicalinfrasubcatdatabyid;
    return this.http.get(fullUrl, options);

  }


  updateMedicalInfraSubCategory(subcategory:any,medInfracatId:any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl =updatesubcategory+'?medInfracatId='+medInfracatId+'&medInfraSubCatName='+subcategory.medInfraSubCatName+'&updatedBy='+subcategory.updatedBy+'&statusFlag='+subcategory.statusFlag+'&medInfraSubCatId='+subcategory.medInfraSubCatId
   return this.http.get(fullUrl,options)
  }



}
