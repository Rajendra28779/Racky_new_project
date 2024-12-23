import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { BenificiarydistrictwisedataService } from '../../Services/benificiarydistrictwisedata.service';
import { YearwiseGenderserviceService } from '../../Services/yearwise-genderservice.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-gpwisetreetmentdatareport',
  templateUrl: './gpwisetreetmentdatareport.component.html',
  styleUrls: ['./gpwisetreetmentdatareport.component.scss']
})
export class GpwisetreetmentdatareportComponent implements OnInit {
  showPegi: boolean;
  txtsearchDate: any;
  listData: any = [];
  pageElement: any;
  currentPage: any;
  user: any;
  gramwisedata: any=[];
  record: any;
  sum: number;
  sum1: number;
  sum2: number;
  blockId: any;
  districtId: any;
  districtName: any;
  blockName: any;
  age:any;
  agecondition:any;
  sum3:any;
  sum4: number;
  sum5: number;
  sum6: number;
  sum7: number;
  sum8: number;
  sum9: number;
  sum10: number;
  sum11: number;
  sum12: number;
  sum13: number;
  benificiary: any;
  disCode: any;
  treatedMale: any;
  disName: any;
  treatedMaleAmt: any;
  treatedFeMale: any;
  treatedFemaleAmt: any;
  treatedOtherAmt: any;
  treatedOther: any;
  gramName: any;
  constructor(public headerService: HeaderService, private sessionService: SessionStorageService,
    private beneficiarydistrictwiseserv:BenificiarydistrictwisedataService, private route: Router) { }

  ngOnInit(): void {
    let state = JSON.parse(localStorage.getItem("blockwisetreat"));
    this.districtId=state.districtId;
    this.districtName=state.districtName;
    this.blockId=state.blockId;
    this.blockName=state.blockName;
    this.age=state.age
    this.agecondition=state.agecondition
    this.gramwisedetails();
  }

  gramwisedetails(){
    let userid=this.sessionService.decryptSessionData("user").userId;
    this.beneficiarydistrictwiseserv.getbenificiarygpwisetreatmentdata(this.age,this.agecondition,this.districtId,this.blockId,userid).subscribe(
      (result:any) =>{
        console.log(result);
        if(result.status==200){
      this.gramwisedata = [];
      this.gramwisedata=result.data;
        this.record = this.gramwisedata.length;
        if (this.record > 0) {
          let sum = 0;
          let sum1 = 0;
          let sum2 = 0;
          let sum3 = 0;
          let sum4 = 0;
          let sum5 = 0;
          let sum6 = 0;
          let sum7 = 0;
          let sum8 = 0;
          let sum9 = 0;
          let sum10 = 0;
          let sum11 = 0;
          let sum12 = 0;
          
          for(let i = 0; i < this.gramwisedata.length; i++){
            sum += parseInt(this.gramwisedata[i].benificiary);
            sum1 += parseInt(this.gramwisedata[i].male);
            sum2 += parseInt(this.gramwisedata[i].female);
            sum3 += parseInt(this.gramwisedata[i].other);   
            sum4 += parseInt(this.gramwisedata[i].totalClaimTreatedcase);
            sum5 += parseInt(this.gramwisedata[i].uniqueBenefCasetreded);
            sum6 += parseInt(this.gramwisedata[i].totalTreatedAmount);
            sum7 += parseInt(this.gramwisedata[i].treatedMale);
            sum8 += parseInt(this.gramwisedata[i].treatedFeMale);
            sum9 += parseInt(this.gramwisedata[i].treatedOther);
            sum10 += parseInt(this.gramwisedata[i].treatedMaleAmt);
            sum11 += parseInt(this.gramwisedata[i].treatedFemaleAmt);
            sum12 += parseInt(this.gramwisedata[i].treatedOtherAmt);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
          this.sum3 = sum3;
          this.sum4 = sum4;
          this.sum5 = sum5;
          this.sum6 = sum6;
          this.sum7 = sum7;
          this.sum8 = sum8;
          this.sum9 = sum9;
          this.sum10 = sum10;
          this.sum11 = sum11;
          this.sum12 = sum12;
          // this.sum13 = sum13;
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi=true;
        } else {
          this.showPegi = false;
        }
      }else{
        this.swal("error","Some Thing Went Wrong","Error")
      }
      },
      (error) => console.log(error)
    )
  }
  report: any = [];
  genderWiseGenderList: any = {
    slNo: "",
    gramName: "",
    benificiary:"",
    male: "",
    female: "",
    other: "",
    totalFamilyMember: "",
    totalClaimTreatedcase: "",
    uniqueBenefCasetreded: "",
    totalTreatedAmount: "",
    treatedMale:"",
    treatedFeMale:"",
    treatedOther:"",
    treatedMaleAmt:"",
    treatedFemaleAmt:"",
    treatedOtherAmt:""
  };

  heading = [['Sl No.', 'Gram Panchayat Name','No. Of Beneficiary Issued', 'Issued Male','Issued Female','Issued Other', 'Total Claim Treated Cases', 'Unique Beneficiary Treated', 'Total Claim Treated Amount',
  'Treated Male', 'Treated Female', 'Treated Others', 'Treated Male amount', 'Treated Female Amount', 'Treated Others Amount']];
  downloadReport(type) {
    if (this.gramwisedata == null || this.gramwisedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.gramwisedata.length; i++) {
      item = this.gramwisedata[i];
      this.genderWiseGenderList = [];
      this.genderWiseGenderList.slNo = i + 1;
      this.genderWiseGenderList.gramName = item.gramName;
      this.genderWiseGenderList.benificiary = item.benificiary;
      this.genderWiseGenderList.male = item.male;
      this.genderWiseGenderList.female = item.female;
      this.genderWiseGenderList.other = item.other;
      // this.genderWiseGenderList.totalFamilyMember = item.totalFamilyMember;
      this.genderWiseGenderList.totalClaimTreatedcase = item.totalClaimTreatedcase;
      this.genderWiseGenderList.uniqueBenefCasetreded = item.uniqueBenefCasetreded;
      this.genderWiseGenderList.totalTreatedAmount = this.convertCurrency(item.totalTreatedAmount);
      this.genderWiseGenderList.treatedMale = item.treatedMale;
      this.genderWiseGenderList.treatedFeMale = item.treatedFeMale;
      this.genderWiseGenderList.treatedOther = item.treatedOther;
      this.genderWiseGenderList.treatedMaleAmt = this.convertCurrency(item.treatedMaleAmt);
      this.genderWiseGenderList.treatedFemaleAmt = this.convertCurrency(item.treatedFemaleAmt);
      this.genderWiseGenderList.treatedOtherAmt = this.convertCurrency(item.treatedOtherAmt);
      this.report.push(this.genderWiseGenderList);
      console.log(this.report);
    }
    this.genderWiseGenderList = [];
    this.genderWiseGenderList.gramName = "Total";
    this.genderWiseGenderList.benificiary = this.sum;
    this.genderWiseGenderList.male = this.sum1;
    this.genderWiseGenderList.female = this.sum2;
    this.genderWiseGenderList.other = this.sum3;
    // this.genderWiseGenderList.totalFamilyMember = this.sum4;
    this.genderWiseGenderList.totalClaimTreatedcase = this.sum4;
    this.genderWiseGenderList.uniqueBenefCasetreded = this.sum5;
    this.genderWiseGenderList.totalTreatedAmount = this.convertCurrency(this.sum6);
    this.genderWiseGenderList.treatedMale = this.sum7;
    this.genderWiseGenderList.treatedFeMale = this.sum8;
    this.genderWiseGenderList.treatedOther = this.sum9;
    this.genderWiseGenderList.treatedMaleAmt = this.convertCurrency(this.sum10);
    this.genderWiseGenderList.treatedFemaleAmt = this.convertCurrency(this.sum11);
    this.genderWiseGenderList.treatedOtherAmt = this.convertCurrency(this.sum12);
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      filter.push([['District :-', this.districtName]]);
      filter.push([['Block :-', this.blockName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Beneficiary Gp Wise Treatment Report", this.heading, filter);
    } 
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  view(districtId:any,blockId: any,gramId:any,districtName:any,blockName:any,gramName:any) {
    let v="";
    let state = {
      districtId:districtId,
      districtName:districtName,
      age: this.age,
      agecondition:this.agecondition,
      blockId:blockId,
      blockName:blockName,
      gramId:gramId,
      gramName:gramName,
      aadharstaus:v
    }
    localStorage.setItem("villagewisetreat", JSON.stringify(state));
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/villagewisetreatmentdata');
    });
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }
  viewdata(item: any) {
    this.benificiary = item.benificiary;
    this.disCode = item.districtId;
    this.disName = item.districtName;
    this.blockName=item.blockName;
    this.gramName=item.gramName;
    this.treatedMale = item.treatedMale;
    this.treatedMaleAmt = item.treatedMaleAmt;
    this.treatedFeMale = item.treatedFeMale;
    this.treatedFemaleAmt = item.treatedFemaleAmt;
    this.treatedOther = item.treatedOther;
    this.treatedOtherAmt = item.treatedOtherAmt;
  }
  convertCurrency(totalAmtClaimed: any): any {
    var formatter = new CurrencyPipe('en-US');
    totalAmtClaimed = formatter.transform(totalAmtClaimed, '', '');
    return totalAmtClaimed;
  }


}
