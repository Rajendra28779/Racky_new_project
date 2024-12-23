import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { getProfilePhoto, saveProfilePhoto } from '../services/api-config';
import { JwtService } from '../services/jwt.service';
import { EncryptionService } from '../services/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  globalLink: string;

  public title = new BehaviorSubject('');

  public indicateIcon = new BehaviorSubject(true);
  public printIcon = new BehaviorSubject(true);
  public deleteIcon = new BehaviorSubject(true);
  public downloadIcon = new BehaviorSubject(true);
  public backIcon = new BehaviorSubject(true);

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private encryptionService: EncryptionService) { }
// page title
  setTitle(pagetitle: any) {
    this.globalLink = sessionStorage.getItem('globalLink');
    if (this.globalLink) {
      this.title.next(this.globalLink + ' / ' + pagetitle);
    } else {
      this.title.next(pagetitle);
    }
  }

  setGlobalLink(title : any) {
    sessionStorage.setItem('globalLink', sessionStorage.getItem('globalLink') + ' / ' + title);
  }

  setTitleNew(pagetitle: any) {
    this.globalLink = pagetitle;
  }

  // utility
  isIndicate(isIndicate: boolean) {
    this.indicateIcon.next(isIndicate);
  }
  isPrint(isPrint: boolean) {
    this.printIcon.next(isPrint);
  }
  isDelete(isDelete: boolean) {
    this.deleteIcon.next(isDelete);
  }
  isDownload(isDownload: boolean) {
    this.downloadIcon.next(isDownload);
  }
  isBack(isBack: boolean) {
    this.backIcon.next(isBack);
  }

  getProfilePhoto(userId: any): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.jwtService.getJwtToken()
    });
    // let queryparams = new HttpParams().append('userId', userId);
    let options = {
      headers: headers,
      // params: queryparams,
      responseType: 'blob' as 'blob'
    };
    let data = {
      userId: userId
    }
    let fullUrl = getProfilePhoto;
    return this.http.post(fullUrl, this.encryptionService.encryptRequest(data), options);
  }

  saveProfileDetails(imageToShow: any, userId: any) {
    console.log(imageToShow+""+userId);

    let headers= new HttpHeaders({
      'Authorization': this.jwtService.getJwtToken(),
    })

    let options = {
      headers: headers,
    }
    const formData: FormData= new FormData();
    formData.append('profilePhoto1', imageToShow);
    formData.append('userId', userId);
    // const formData: FormData = new FormData();
    // formData.append('profilePhoto1', profilephoto);
    // formData.append('userId',userId);

    let fullUrl = saveProfilePhoto;
    return this.http.post(fullUrl,formData,options)
  }

}
