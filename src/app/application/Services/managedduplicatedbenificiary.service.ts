import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { beneficiarylist, inactivebeneficiary, manageduplicatebeneficiarylist, ongoingtreatmentlist,manageduplicatebeneficiaryviewlist } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class ManagedduplicatedbenificiaryService {


  constructor(private http: HttpClient,private jwtService: JwtService) { }

  manageduplicatebeneficiarylist( search: any,searchvalue: any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {

        searchtype:search,
        searchvalue: searchvalue,
      },
    };
    var fullUrl = beneficiarylist;
    return this.http.get(fullUrl, options);
  }


//FAMILY-DEATILS
  beneficiaryfamilylist(action,  urn){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {

        searchtype:action,
        searchvalue: urn,
      },
    };
    var fullUrl = manageduplicatebeneficiarylist;
    return this.http.get(fullUrl, options);
  }

  ongoingtreatmentlist(action,  uid){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {

        searchtype:action,
        searchvalue: uid,
      },
    };
    var fullUrl = ongoingtreatmentlist;
    return this.http.get(fullUrl, options);

  }
  inactivebeneficiary(object: any){
    let headers = new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    let fullUrl = inactivebeneficiary;
    return this.http.post(fullUrl,object,options)
  }

  manageduplicatebeneficiaryviewlist(search: any, searchvalue: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.jwtService.getJwtToken(),
    });
    let options = {
      headers: headers,
      params: {

        searchtype:search,
        searchvalue: searchvalue,
      },
    };
    var fullUrl = manageduplicatebeneficiaryviewlist;
    return this.http.get(fullUrl, options);
  }
}
