import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtService } from 'src/app/services/jwt.service';
import { saveintcomm,getintcommuserlist,getintcommlist,getintcommtasklist,downLoadintcommnDoc,updateintcomm} from 'src/app/services/api-config';

@Injectable({
  providedIn: 'root'
})
export class InternalcommServiceService {


  constructor(private http: HttpClient, private jwtService: JwtService) { }

  getintcommuserlist()
  {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers
    }
    var fullUrl = getintcommuserlist;
    return this.http.get(fullUrl,options)
  }
  getintcommlist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params : {
        "userid":userId
      }
    }
    var fullUrl = getintcommlist;
    return this.http.get(fullUrl,options)
  }
  getintcommtasklist(userId: any) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
      headers:headers,
      params : {
        "userid":userId
      }
    }
    var fullUrl = getintcommtasklist;
    return this.http.get(fullUrl,options)
  }

  saveintcomm(whom: any, requestfor: any, requiredby: any, userId: any, priority: any, fileToUpload2: any,editorvalue : any) {
    let headers = new HttpHeaders({
          // 'Content-Type': 'application/json',
          'Authorization': this.jwtService.getJwtToken()
        })
        let options = {
              headers:headers
            }

    const formData: FormData = new FormData();
    if(fileToUpload2!=undefined){
      formData.append('file', fileToUpload2);
    }
    formData.append('towhom', whom)
    formData.append('reqfor', requestfor)
    formData.append('date', requiredby)
    formData.append('userid', userId)
    formData.append('priority', priority)
    formData.append('description', editorvalue)
    let fullUrl = saveintcomm;
    return this.http.post(fullUrl,formData,options)
  }

  resolveincommunication(requestfor: any, fileToUpload: any, userid: any, intcommid: any) {
    let headers = new HttpHeaders({
      // 'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    })
    let options = {
          headers:headers
        }

const formData: FormData = new FormData();
formData.append('file', fileToUpload);
    formData.append('remarks', requestfor)
    formData.append('userid', userid)
    formData.append('intcommid', intcommid)
    let fullUrl = updateintcomm;
    return this.http.post(fullUrl,formData,options)
  }

  downloadFile(fileName) {
    console.log("hi");

    let jsonObj = {
      f: fileName,
    };
    let jsonString = JSON.stringify(jsonObj);
    let queryParam = btoa(jsonString);
    let url = downLoadintcommnDoc + '?' + 'data=' + queryParam;
    return url;
  }
  //
}
