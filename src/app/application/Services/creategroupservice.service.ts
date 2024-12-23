import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export class dataList{
  id : any;
  name : any;
}

@Injectable({
  providedIn: 'root'
})
export class CreategroupserviceService {
  http:any;
  private Dataurl = 'http://192.168.10.76/bsky_portal/api';
  dataList1 : dataList[] = [];


  constructor(private httpclient: HttpClient) { }

  // getsaveForGroup(groupName:any,isSubgrouped:any,parentGroupId:any):Observable<any>{
  //   return this.httpclient.post<any>(`${this.Dataurl+"/saveGroup?groupName="+groupName+"&isSubgrouped="+isSubgrouped+"&parentGroupId="+parentGroupId}`,groupName);

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

    // console.log("aasuchi service ku login pain");
    return this.httpclient.post<any>(`${this.Dataurl+"/saveGroup?groupName="+groupName+"&isSubgrouped="+isSubgrouped+"&parentGroupId="+parentGroupId}`,groupName);

  }
  getgroupdata():Observable<Object>{
    return this.httpclient.get<Object>(`${this.Dataurl+"/getGroupDetails"}`);
  }
  groupupdate(items:any)
  {
    // console.log("aasuchi service ku login pain");
    // console.log(items);
    return this.httpclient.post<any>(`${this.Dataurl+"/UpdateGroup"}`,items);
  }
  groupdelete(items:any){
    return this.httpclient.post<any>(`${this.Dataurl+"/DeleteGroup"}`,items);
  }
  // getsaveForGroup(item:any){
  //   alert(JSON.stringify(item));
  //   return this.httpclient.post<any>(`${this.Dataurl+"/saveGroup"}`,item);

  // }

}
