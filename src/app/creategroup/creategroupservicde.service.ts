import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
export class dataList{
  id : any;
  name : any;
}

@Injectable({
  providedIn: 'root'
})

export class CreategroupservicdeService {
  http:any;
  private Dataurl = 'http://192.168.10.76/bsky_portal/api';
  dataList1 : dataList[] = [];

  // baseUrl: string;
  // private baseUrl = environment.saveGroup + "/";


  constructor(private httpclient: HttpClient) { }



  // Save(object:any){
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*'
  //   });

  //   let url = "http://192.168.10.76/bsky_portal/api/saveGroup";
  //   let httpOptions = { headers: headers };



  //   return this.http.post(url, object, httpOptions);

  // }
  // getsaveForGroup(groupName:any ,isSubgrouped:any,parentGroupId:any) {
  //   alert(parentGroupId)

  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Access-Control-Allow-Origin': '*',
  //   });
  //   let options = {
  //     headers: headers,
  //     params: {
  //       'groupName': groupName,
  //       'isSubgrouped': isSubgrouped,
  //       'parentGroupId': parentGroupId,
  //     }
  //   };
  //   // let url = environment.saveGroup;
  //   // return this.http.post(url, options);

  //   let url = "api/saveGroup";
  //   let fullUrl = this.baseUrl + url;

  //   return this.httpclient.post(fullUrl,options);


  // }




  getsaveForGroup(groupName:any,isSubgrouped:any,parentGroupId:any):Observable<any>{

   
    return this.httpclient.post<any>(`${this.Dataurl+"/saveGroup?groupName="+groupName+"&isSubgrouped="+isSubgrouped+"&parentGroupId="+parentGroupId}`,groupName);

  }
  getgroupdata():Observable<Object>{
    return this.httpclient.get<Object>(`${this.Dataurl+"/getGroupDetails"}`);
  }
  groupupdate(items:any)
  {
    return this.httpclient.post<any>(`${this.Dataurl+"/UpdateGroup"}`,items);
  }
  groupdelete(items:any){
    return this.httpclient.post<any>(`${this.Dataurl+"/DeleteGroup"}`,items);
  }


}
