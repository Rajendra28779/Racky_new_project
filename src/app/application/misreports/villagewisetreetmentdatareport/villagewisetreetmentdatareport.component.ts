import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { BenificiarydistrictwisedataService } from '../../Services/benificiarydistrictwisedata.service';
import { YearwiseGenderserviceService } from '../../Services/yearwise-genderservice.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-villagewisetreetmentdatareport',
  templateUrl: './villagewisetreetmentdatareport.component.html',
  styleUrls: ['./villagewisetreetmentdatareport.component.scss']
})
export class VillagewisetreetmentdatareportComponent implements OnInit {
  txtsearchDate: any;
  getvillagedata: any = [];
  // distrcitid: any;
  record: any;
  sum: any;
  sum1: any;
  currentPage: any;
  pageElement: any;
  sum2: any;
  sum3: any;
  sum4: any;
  sum5: any;
  sum6: any;
  sum7: any;
  sum8: any;
  showPegi: boolean;
  districtId: any;
  blockId: any;
  gramId: any;
  districtName: any;
  blockName: any;
  gramname: any;
  age: any;
  agecondition: any;
  constructor(public headerService: HeaderService, private sessionService: SessionStorageService,
    private beneficiarydistrictwiseserv:BenificiarydistrictwisedataService, private route: Router) { }

  ngOnInit(): void {
    let state = JSON.parse(localStorage.getItem("villagewisetreat"));
    this.districtId=state.districtId;
    this.districtName=state.districtName;
    this.blockId=state.blockId;
    this.blockName=state.blockName;
    this.age=state.age
    this.agecondition=state.agecondition
    this.gramId = state.gramId;
    this.gramname = state.gramName;
    this.gramwisedetails();
  }

  gramwisedetails() {
    let userid=this.sessionService.decryptSessionData("user").userId;
    this.beneficiarydistrictwiseserv.getbenificiaryvillagewisetreatmentdata(this.age,this.agecondition,this.districtId, this.blockId, this.gramId,userid).subscribe(
      (result:any) => {
        console.log(result);
        if(result.status==200){
        this.getvillagedata = [];
        this.getvillagedata = result.data;
        this.record = this.getvillagedata.length;
        if (this.record > 0) {
          let sum=0;
          let sum1=0;
          let sum2=0;
          let sum3=0;
          let sum4=0;
          let sum5=0;
          let sum6=0;
          let sum7=0;
          let sum8 = 0;
          for (let i = 0; i < this.getvillagedata.length; i++) {
            sum += parseInt(this.getvillagedata[i].male);
            sum1 += parseInt(this.getvillagedata[i].female);
            sum2+= parseInt(this.getvillagedata[i].other);
            sum3+= parseInt(this.getvillagedata[i].treatedMale);
            sum4+= parseInt(this.getvillagedata[i].treatedFeMale);
            sum5+= parseInt(this.getvillagedata[i].treatedOther);
            sum6+= parseInt(this.getvillagedata[i].treatedMaleAmount);
            sum7+= parseInt(this.getvillagedata[i].treatedFeMaleAmount);
            sum8+= parseInt(this.getvillagedata[i].treatedOtherAmount);
          }
          this.sum = sum;
          this.sum1 = sum1;
          this.sum2 = sum2;
          this.sum3 = sum3;
          this.sum4 = sum4;
          this.sum5 = sum5;
          this.sum6= sum6;
          this.sum7 = sum7;
          this.sum8 = sum8;
          this.currentPage = 1;
          this.pageElement = 100;
          this.showPegi = true;
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
    villageName: "",
    male: "",
    female: "",
    other: "",
    trtmale: "",
    trtfemale: "",
    trtother: "",
    trtmaleamount: "",
    trtfemaleamount: "",
    trtotheramount: ""
  };

  heading = [['Sl No.', 'Village Name', 'Issued Male', 'Issued Female', 'Issued Other','Treated Male','Treated Female','Treated Others','Treated Male Amount','Treated Female Amount','Treated Others Amount',]];
  downloadReport(type) {
    if (this.getvillagedata == null || this.getvillagedata.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    this.report = [];
    let item: any;
    for (var i = 0; i < this.getvillagedata.length; i++) {
      item = this.getvillagedata[i];
      this.genderWiseGenderList = [];
      this.genderWiseGenderList.slNo = i + 1;
      this.genderWiseGenderList.villageName = item.villageName;
      this.genderWiseGenderList.male = item.male;
      this.genderWiseGenderList.female = item.female;
      this.genderWiseGenderList.other = item.other;
      this.genderWiseGenderList.trtmale = item.treatedMale;
      this.genderWiseGenderList.trtfemale = item.treatedFeMale;
      this.genderWiseGenderList.trtother = item.treatedOther;
      this.genderWiseGenderList.trtmaleamount = item.treatedMaleAmount;
      this.genderWiseGenderList.trtfemaleamount = item.treatedFeMaleAmount;
      this.genderWiseGenderList.trtotheramount = item.treatedOtherAmount;
      this.report.push(this.genderWiseGenderList);
      console.log(this.report);
    }
    this.genderWiseGenderList = [];
    this.genderWiseGenderList.villageName = "Total";
    this.genderWiseGenderList.male = this.sum;
    this.genderWiseGenderList.female = this.sum1;
    this.genderWiseGenderList.other = this.sum2;
    this.genderWiseGenderList.trtmale = this.sum3;
    this.genderWiseGenderList.trtfemale = this.sum4;
    this.genderWiseGenderList.trtother = this.sum5;
    this.genderWiseGenderList.trtmaleamount = this.sum6;
    this.genderWiseGenderList.trtfemaleamount = this.sum7;
    this.genderWiseGenderList.trtotheramount = this.sum8;
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      filter.push([['District :-', this.districtName]]);
      filter.push([['Block :-', this.blockName]]);
      filter.push([['Gram Panchayat :-', this.gramname]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Beneficiary Village Wise Treatment Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [300, 240]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("Beneficiary Village Wise Treatment Report", 80, 10);
      doc.setFontSize(12);
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 20);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 145, 20);
      doc.text("District :-" + this.districtName, 15, 30);
      doc.text("Block :-" + this.blockName, 85, 30);
      doc.text("Gram Panchayat :-" + this.gramname, 155, 30);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.villageName;
        pdf[2] = clm.male;
        pdf[3] = clm.female;
        pdf[4] = clm.other;
        pdf[5] = clm.trtmale;
        pdf[6] = clm.trtfemale;
        pdf[7] = clm.trtother;
        pdf[8] = clm.trtmaleamount;
        pdf[9] = clm.trtfemaleamount;
        pdf[10] = clm.trtotheramount;
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 35,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 55 }

        }
      });
      doc.save('Bsky_Beneficiary Village Wise Treatment Report.pdf');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }
  view(districtId: any, blockId: any, gramId: any, villageId: any, districtName: any, blockName: any, gramName: any, villageName: any) {
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
      villageId:villageId,
      villageName:villageName,
      aadharstaus:v
    }
    localStorage.setItem("villagetreatmentdata", JSON.stringify(state));
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/benificarydetails');
    });
  }

}

