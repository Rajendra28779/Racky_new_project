import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { MisreportService } from '../Services/misreport.service';
import { TableUtil } from '../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospitalwiseongoingtreatmentdetails',
  templateUrl: './hospitalwiseongoingtreatmentdetails.component.html',
  styleUrls: ['./hospitalwiseongoingtreatmentdetails.component.scss']
})
export class HospitalwiseongoingtreatmentdetailsComponent implements OnInit {
  flag: string;
  hospitalcode: string;
  fromdate: string;
  todate: string;
  user: any;
  value:any;
  result:any;
  list:any=[];
  showPegi: boolean;
currentPage: any;
pageElement: any;
totalcount:any=0;
txtsearchDate:any;

  constructor(private misservice:MisreportService,public headerService:HeaderService,public route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.flag=localStorage.getItem("flag");
    this.hospitalcode=localStorage.getItem("hospcode");
    this.fromdate=localStorage.getItem("fromdate");
    this.todate=localStorage.getItem("todate");

    this.misservice.gethospongingtreatmentdtls(this.flag,this.hospitalcode,this.fromdate,this.todate,this.user.userId).subscribe((data:any)=>{
      console.log(data);
      this.value=data;
      if(this.value.status==200){
        this.result=this.value.hospital;
        this.list=this.value.list;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          this.showPegi=true
          this.currentPage=1
          this.pageElement=100
        }else{
          this.showPegi=false
        }
      }else{
        this.swal("Error", "Something Went Wrong", "error");
      }

    },
    (error) => console.log(error)
    );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sno: any = {
    Slno: "",
    urn:"",
    pname: "",
    age: "",
    gender: "",
    uid: "",
    mobile: "",
    adoa: "",
    doa: "",
    procname: "",
    phgname: "",
    authenticatemode: "",
    wordname: "",
    amountblocked: "",
    preauthstatus: "",
    preauthrqstdate: "",
    implant: "",
    hed: "",

  };
  heading = [['Sl#', 'URN','Patient Name', 'Age' , 'Gender','UID','patient Mobile No','Actual Date of Admission','Date of Admission','Procedure Name','Package Name','Authentication Mode','Word Name','Amount Blocked','PreAuth Status','PreAuth Request Date','Implant Avail','High End Drug Avail']];


  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.urn=sna.urn
      this.sno.pname=sna.patient
      this.sno.age=sna.age
      this.sno.gender=sna.gender
      this.sno.uid=sna.uid
      this.sno.mobile=sna.pphoneno
      this.sno.adoa=sna.actualdateofadmission
      this.sno.doa=sna.dateofadmission
      this.sno.procname=sna.procedurename
      this.sno.phgname=sna.packagename
      this.sno.authenticatemode=sna.authenticatemode
      this.sno.wordname=sna.wardname
      this.sno.amountblocked=sna.amountblock
      this.sno.preauthstatus=sna.preauthstatus
      this.sno.preauthrqstdate=sna.preauthrqstdate
      this.sno.implant=sna.implantavail
      this.sno.hed=sna.highenddrug
      this.report.push(this.sno);
    }
    if(no==1){
      let filter =[];
      filter.push([['Actual Date Of Admission From', this.fromdate]]);
      filter.push([['Actual Date Of Admission To', this.todate]]);
      filter.push([['Hospital Name', this.result.hospitalName]]);
      filter.push([['Hospital Code', this.result.hospitalCode]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'HospitalWise Ongoing Treatment Report Details',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,400 ]);
    doc.setFontSize(22);
    // doc.text(" ", 5, 5);
    doc.text("HospitalWise Ongoing Treatment Report Details", 100, 15);
    doc.setFontSize(15);
    doc.text('Actual Date Of Admission From :- '+ this.fromdate+' To :- '+this.todate,8,24);
    doc.text('Hospital Name :- '+this.result.hospitalName+' ('+this.result.hospitalCode+')',8,32);
    doc.text('GeneratedOn :- '+generatedOn,260,40);
    doc.text('GeneratedBy :- '+generatedBy,8,40);

    var rows = [];
    for(var i=0;i<this.report.length;i++) {
      var clm = this.report[i];
      var pdf = [];
      pdf[0] = clm.Slno;
      pdf[1] = clm.urn;
      pdf[2] = clm.pname;
      pdf[3] = clm.age;
      pdf[4] = clm.gender;
      pdf[5] = clm.uid;
      pdf[6] = clm.mobile;
      pdf[7] = clm.adoa;
      pdf[8] = clm.doa;
      pdf[9] = clm.procname;
      pdf[10] = clm.phgname;
      pdf[11] = clm.authenticatemode;
      pdf[12] = clm.wordname;
      pdf[13] = clm.amountblocked;
      pdf[14] = clm.preauthstatus;
      pdf[15] = clm.preauthrqstdate;
      pdf[16] = clm.implant;
      pdf[17] = clm.hed;
      rows.push(pdf);
    }
    autoTable(doc, {
      head: this.heading,
      body: rows,
      theme: 'grid',
      startY: 45,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: {cellWidth: 10},
      }
    });
    doc.save('Bsky_HospitalWise Ongoing Treatment Report Details.pdf');
    }
  }

}
