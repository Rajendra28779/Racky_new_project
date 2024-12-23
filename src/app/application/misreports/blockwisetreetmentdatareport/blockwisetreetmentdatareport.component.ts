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
  selector: 'app-blockwisetreetmentdatareport',
  templateUrl: './blockwisetreetmentdatareport.component.html',
  styleUrls: ['./blockwisetreetmentdatareport.component.scss']
})
export class BlockwisetreetmentdatareportComponent implements OnInit {
  txtsearchDate:any;
  getblockdata:any=[];
  // distrcitid: any;
  record: any;
  sum: any;
  sum1: any;
  currentPage: any;
  pageElement: any;
  sum2: any;
  showPegi:boolean;
  districtId: any;
  districtName: any;
  age:any;
  agecondition:any;
  sum3:any;
  sum4:number;
  sum5: any;
  sum6: any;
  sum7: any;
  sum8: any;
  sum9: any;
  sum10: any;
  sum11: number;
  sum12: number;
  sum13: number;
  benificiary: any;
  treatedMale: any;
  treatedMaleAmt: any;
  treatedFeMale: any;
  treatedFemaleAmt: any;
  treatedOther: any;
  treatedOtherAmt: any;
  disCode: any;
  disName: any;
  blockName: any;
  constructor(public headerService:HeaderService, private sessionService: SessionStorageService,
    private beneficiarydistrictwiseserv:BenificiarydistrictwisedataService, private route: Router) { }

  ngOnInit(): void {
    let state = JSON.parse(localStorage.getItem("districtwisetreat"));
    this.districtId=state.districtId;
    this.districtName=state.districtName;
    this.age=state.age
    this.agecondition=state.agecondition
    this.blockwisedata();
  }

  blockwisedata(){
    let userid=this.sessionService.decryptSessionData("user").userId;
    this.beneficiarydistrictwiseserv.getbenificiaryblockwisetreatmentdata(this.age,this.agecondition,this.districtId,userid).subscribe(
      (result:any) =>{
        console.log(result);
        if(result.status==200){
        this.getblockdata = [];
        this.getblockdata=result.data;
        this.record = this.getblockdata.length;
        if (this.record > 0) {
          let sum=0;
          let sum1=0;
          let sum2=0;
          let sum3=0;
          let sum4=0;
          let sum5=0;
          let sum6=0;
          let sum7 = 0;
          let sum8 = 0;
          let sum9 = 0;
          let sum10 = 0;
          let sum11 = 0;
          let sum12 = 0;
          
          for(let i = 0; i < this.getblockdata.length; i++){
            sum+=parseInt(this.getblockdata[i].benificiary);
            sum1 += parseInt(this.getblockdata[i].male);
            sum2 += parseInt(this.getblockdata[i].female);
            sum3 += parseInt(this.getblockdata[i].other);
            // sum4 += parseInt(this.getblockdata[i].totalFamilyMember);
            sum4 += parseInt(this.getblockdata[i].totalClaimTreatedcase);
            sum5 += parseInt(this.getblockdata[i].uniqueBenefCasetreded);
            sum6 += parseInt(this.getblockdata[i].totalTreatedAmount);
            sum7 += parseInt(this.getblockdata[i].treatedMale);
            sum8 += parseInt(this.getblockdata[i].treatedFeMale);
            sum9 += parseInt(this.getblockdata[i].treatedOther);
            sum10 += parseInt(this.getblockdata[i].treatedMaleAmt);
            sum11 += parseInt(this.getblockdata[i].treatedFemaleAmt);
            sum12 += parseInt(this.getblockdata[i].treatedOtherAmt);
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
    blockName: "",
    benificiary: "",
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

  heading = [['Sl No.', 'Block Name','No. Of Beneficiary Issued', 'Issued Male','Issued Female','Issued Other', 'Total Claim Treated Cases', 'Unique Beneficiary Treated', 'Total Claim Treated Amount',
  'Treated Male', 'Treated Female', 'Treated Others', 'Treated Male amount', 'Treated Female Amount', 'Treated Others Amount']];
  downloadReport(type) {
    if (this.getblockdata == null || this.getblockdata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.getblockdata.length; i++) {
      item = this.getblockdata[i];
      this.genderWiseGenderList = [];
      this.genderWiseGenderList.slNo = i + 1;
      this.genderWiseGenderList.blockName = item.blockName;
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
    this.genderWiseGenderList.blockName = "Total";
    this.genderWiseGenderList.benificiary = this.sum;
    this.genderWiseGenderList.male = this.sum1;
    this.genderWiseGenderList.female = this.sum2;
    this.genderWiseGenderList.other = this.sum3;
    // this.genderWiseGenderList.totalFamilyMember =this.sum4;
      this.genderWiseGenderList.totalClaimTreatedcase = this.sum4;
      this.genderWiseGenderList.uniqueBenefCasetreded = this.sum5;
      this.genderWiseGenderList.totalTreatedAmount = this.convertCurrency(this.sum6);
      this.genderWiseGenderList.treatedMale = this.sum7;
      this.genderWiseGenderList.treatedFeMale = this.sum8;
      this.genderWiseGenderList.treatedOther = this.sum9;
      this.genderWiseGenderList.treatedMaleAmt =this.convertCurrency(this.sum10);
      this.genderWiseGenderList.treatedFemaleAmt = this.convertCurrency(this.sum10);
      this.genderWiseGenderList.treatedOtherAmt = this.convertCurrency(this.sum12);
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      filter.push([['District :-', this.districtName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Beneficiary Block Wise Treatment Report", this.heading, filter);
    } 
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }

  view(districtId: any,blockId:any,districtName:any,blockName:any) {
    let v="";
    let state = {
      districtId:districtId,
      blockId:blockId,
      districtName:districtName,
      blockName:blockName,
      age: this.age,
      agecondition:this.agecondition,
      aadharstaus:v
    }
    localStorage.setItem("blockwisetreat", JSON.stringify(state));
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/gpwisetreatmentdata');
    });
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  viewdata(item:any){
    this.benificiary = item.benificiary;
    this.disCode = item.districtId;
    this.disName = item.districtName;
    this.blockName=item.blockName;
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

