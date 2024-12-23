import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAllBankMasterData, getBankDetailsById, saveBankDetails, updateBankMasterDetails } from 'src/app/services/api-config';
import { JwtService } from 'src/app/services/jwt.service';

@Injectable({
  providedIn: 'root'
})
export class BankMasterServiceService {
  
 

  constructor(private jwtService: JwtService, private http: HttpClient) { }

  saveBankMasterDate(object: { bankName: string; }) {
    
   
      console.log("Data in service========"+ JSON.stringify(object));
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      console.log("bankName : " + object.bankName)
      let options = {
        headers:headers
      }
      let token = this.jwtService.getJwtToken();
      var fullUrl = saveBankDetails;
      //console.log(this.httpclient.get(fullUrl,options));
      return this.http.post(fullUrl,object,options);
    }

    getBankMasterDetail() {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers: headers
      }
      let token = this.jwtService.getJwtToken();
      let fullUrl = getAllBankMasterData;
      return this.http.get(fullUrl, options);
    }


    getbyId(user: any) {
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers: headers
      }
      let token = this.jwtService.getJwtToken();
      let fullUrl = getBankDetailsById + "?bankId=" + user;
      return this.http.get(fullUrl, options);
      
    }
    updateBankMasterData(data:any) {

      console.log("upfate data comes in service"+data);
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.jwtService.getJwtToken()
      })
      let options = {
        headers:headers
      }
      var fullUrl =updateBankMasterDetails;
      return this.http.post(fullUrl,data,options);
    }
    
    }
   
    
  

