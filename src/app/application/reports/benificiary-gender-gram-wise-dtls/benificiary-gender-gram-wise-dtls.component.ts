import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { YearwiseGenderserviceService } from '../../Services/yearwise-genderservice.service';
import { TableUtil } from '../../util/TableUtil';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-benificiary-gender-gram-wise-dtls',
  templateUrl: './benificiary-gender-gram-wise-dtls.component.html',
  styleUrls: ['./benificiary-gender-gram-wise-dtls.component.scss']
})
export class BenificiaryGenderGramWiseDtlsComponent implements OnInit {
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
  rationcardno:any;
  sum3:any;
  constructor(public headerService: HeaderService,private sessionService: SessionStorageService,
    private yearwiseGenderserviceService: YearwiseGenderserviceService, private route: Router) { }

  ngOnInit(): void {
    this.districtId=localStorage.getItem('districtId');
    this.blockId=localStorage.getItem('blockId');
    this.districtName=localStorage.getItem('districtName');
    this.blockName=localStorage.getItem('blockName');
    this.rationcardno=localStorage.getItem('rationcardno');
    this.gramwisedetails();
  }

  gramwisedetails(){
    // let userId = this.user.userId;
    this.yearwiseGenderserviceService.benificaryGendergram(this.districtId,this.blockId).subscribe(
      (result) =>{
        console.log(result);
      this.gramwisedata = [];
      this.gramwisedata=result;
        this.record = this.gramwisedata.length;
        if (this.record > 0) {
          let sum=0;
          let sum1=0;
          let sum2=0;
          let sum3=0;
          for(let i = 0; i < this.gramwisedata.length; i++){
            sum+=parseInt(this.gramwisedata[i].benificiary);
            sum1+=parseInt(this.gramwisedata[i].male);
            sum1+=parseInt(this.gramwisedata[i].female);  
            sum3+=parseInt(this.gramwisedata[i].other); 
          }
        this.sum=sum;
        this.sum1=sum1;
        this.sum2=sum2;
        this.sum3=sum3;
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi=true;
        } else {
          this.showPegi = false;
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
    other: ""
  };

  heading = [['Sl No.', 'Gram Panchayat Name','	No. Of RationCard Issued', 'Male', 'Female', 'Other']];
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
      this.report.push(this.genderWiseGenderList);
      console.log(this.report);
    }
    this.genderWiseGenderList = [];
    this.genderWiseGenderList.gramName = "Total";
    this.genderWiseGenderList.benificiary = this.sum;
    this.genderWiseGenderList.male = this.sum1;
    this.genderWiseGenderList.female = this.sum2;
    this.genderWiseGenderList.other = this.sum3;
    this.report.push(this.genderWiseGenderList);
    if (type == 1) {
      let filter = [];
      filter.push([['District :-', this.districtName]]);
      filter.push([['Block :-', this.blockName]]);
      TableUtil.exportListToExcelWithFilter(this.report, "Beneficiary Gender Wise Report", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [300, 240]);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text("Beneficiary Gender Wise Report", 80, 10);
      doc.setFontSize(12);
     
      doc.text("Generated On: " + this.convertDate(new Date()), 15, 20);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 145, 20);
       doc.text("District :-"+ this.districtName, 15, 30);
        doc.text("Block:-"+ this.blockName, 135, 30);
      // doc.text("No. Of RationCard Issued :-"+ this.rationcardno,15,40);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.gramName;
        pdf[2] = clm.benificiary;
        pdf[3] = clm.male;
        pdf[4] = clm.female;
        pdf[5] = clm.other;
       
        rows.push(pdf);
      }
      console.log(rows);
      autoTable(doc, {
        
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY:45,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 55 },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
          
        }
      });
      doc.save('Bsky_Beneficiary Gender Wise Report.pdf');
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
    localStorage.setItem("districtId", districtId)
    localStorage.setItem("blockId", blockId)
    localStorage.setItem("gramId", gramId)
    localStorage.setItem("districtName", districtName)
    localStorage.setItem("blockName", blockName)
    localStorage.setItem("gramName", gramName)
    localStorage.setItem('rationcardno',this.rationcardno);
    this.route.navigate([]).then(result => {
      window.open(environment.routingUrl + '/villagewisegenderdetails');
    });
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a', 'en-US');
    return date;
  }


}