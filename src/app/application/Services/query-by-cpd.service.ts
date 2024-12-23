import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnyObject } from 'chart.js/types/basic';
import { Observable } from 'rxjs';
import { getActiontakenhistory, getcasewisecpdquerylist, getcasewisesnaquerylist, getclaimDetailsAfterQueryFromCpd, getCPDquerytohospitalDetailsthroughid, getCPDquerytohospitalDocupload, getCPDquerytohospitalsubmit, getQueriedClaimDetailsFromCpd, gettakeActionOnQueryCpd } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class QueryByCpdService {
  constructor(private http: HttpClient,private jwtService: JwtService) { }

    getDetails(claimID: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      });
      let options = {
        headers: headers,
        params: {
          'claimID': claimID
        }
      };
      let fullUrl = getQueriedClaimDetailsFromCpd;
      return this.http.get(fullUrl, options);
    }  
    getClaimList(hospitalCode,fromDate,toDate,Package,packageCodedata:any,URN,schemeid,schemecategoryid) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
      .append('hospitalCode',hospitalCode)
      .append('fromDate',fromDate)
      .append('toDate',toDate)
      .append('Package',Package)
      .append('packageCodedata',packageCodedata)
      .append('URN',URN)
      .append('schemeid',schemeid)
      .append('schemecategoryid',schemecategoryid)
      let options = {
        headers:headers,
        params: queryparams
      };
      let fullUrl = getclaimDetailsAfterQueryFromCpd;
      return this.http.get(fullUrl, options)
    }

    queryclaimRequest(Data:FormData):Observable<any>{
      let headers = new HttpHeaders({
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers
      }
      let fullUrl=gettakeActionOnQueryCpd
      return this.http.post(fullUrl,Data,options);


    }
    // ==================================================new cpd query to hospital service =====================================================
    getcasewiseQuerytohospital(hospitalCode:any,fromDate:any,toDate:any, urn:any,caseno:any, schemeid:any, schemecategoryid:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
        .append('hospitalCode', hospitalCode)
        .append('fromDate', fromDate)
        .append('toDate', toDate)
        .append('urn', urn)
        .append('caseno', caseno)
        .append('schemeid', schemeid)
        .append('schemecategoryid', schemecategoryid)

      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = getcasewisecpdquerylist;
      return this.http.get(fullUrl, options)
    }


    getcpdquerytohospitaldetails(caseid: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.jwtService.getJwtToken(),
      });
      let queryparams = new HttpParams().append('caseid', caseid);
      let options = {
        headers: headers,
        params: queryparams,
      };
      let fullUrl = getCPDquerytohospitalDetailsthroughid;
      return this.http.get(fullUrl, options);
    }

    getselectedcpdtohospitalquerydocumentUpload(data: FormData): Observable<any> {
      let headers = new HttpHeaders({
        'Authorization': this.jwtService.getJwtToken()
      });
      let options = {
        headers: headers
      };
      let fullUrl = getCPDquerytohospitalDocupload;
      return this.http.post(fullUrl, data, options);
  
    }

    getcasewisecpdquerytohospitalsubmit(data: FormData): Observable<any> {
      let headers = new HttpHeaders({
        'Authorization': this.jwtService.getJwtToken()
      });
      let options = {
        headers: headers
      };
      let fullUrl = getCPDquerytohospitalsubmit;
      return this.http.post(fullUrl, data, options);
    }

    getcasewisequeriedsnadtls(hospitalCode:any,fromDate:any,toDate:any, urn:any,caseno:any, schemeid:any, schemecategoryid:any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let queryparams = new HttpParams()
        .append('hospitalCode', hospitalCode)
        .append('fromDate', fromDate)
        .append('toDate', toDate)
        .append('urn', urn)
        .append('caseno', caseno)
        .append('schemeid', schemeid)
        .append('schemecategoryid', schemecategoryid)

      let options = {
        headers: headers,
        params: queryparams
      }
      let fullUrl = getcasewisesnaquerylist;
      return this.http.get(fullUrl, options)
    }

    getgetActiontakenhistory(caseid: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.jwtService.getJwtToken(),
      });
      let queryparams = new HttpParams().append('caseid', caseid);
      let options = {
        headers: headers,
        params: queryparams,
      };
      let fullUrl = getActiontakenhistory;
      return this.http.get(fullUrl, options);
    }

    // ===================================================END===================================================================================


}
