import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { RationCardSchedularReportService } from '../Services/ration-card-schedular-report.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-ration-card-schedular-details-report',
  templateUrl: './ration-card-schedular-details-report.component.html',
  styleUrls: ['./ration-card-schedular-details-report.component.scss']
})
export class RationCardSchedularDetailsReportComponent implements OnInit {
  txtsearchDate: any;
  claimlist:any;
  showPegi:boolean;
  show:any=true;
  pageElement:any;
  currentPage:any;
  user3:any;
  user: any;
  date:any
  type:any
  countclaimlist:any
  status:any
  details:any;

  constructor(
    public headerService:HeaderService,
    private rationcardservice: RationCardSchedularReportService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    // this.user3 = JSON.parse(sessionStorage.getItem("user"));
    this.user3 = this.sessionService.decryptSessionData("user");
    this.user=this.user3.userId
    this.date=localStorage.getItem('Actiondate');
    this.type=localStorage.getItem('Actiontype');
    this.status=localStorage.getItem('type');
    console.log(this.date);
    console.log(this.user);
    console.log(this.type);
    console.log(this.status);
    this.rationcardservice.getrationcardreportDetails(this.user,this.date,this.type,this.status).subscribe((data:any)=>{
      this.details=data;
      this.claimlist=this.details.data
      console.log(data);
      console.log(this.claimlist);
      this.countclaimlist=this.claimlist.length
if(this.details.status==201){
    this.show=false
}else{
  this.show=true
}
  });

}
report: any = [];
  sno: any = {
    Slno: '',
    IDENTITY: '',

    ID: '',
    HEALTHSLNO: '',
    HEALTHMEMBERSLNO:'',
    RATIONCARDNUMBER: '',
    MEMBERID:'',
    RATIONCARDTYPE:'',
    FULLNAMEINENGLISH:'',
    FULLNAMEINODIYA:'',
    AADHAARNUMBER:'',
    GENDER:'',
    DATEOFBIRTH:'',
    AGE:'',
    SPOUSEFULLNAME:'',
    RELATIONWITHFAMILYHEAD:'',
    FATHERFULLNAME:''   ,
    MOBILENUMBER:'',
    DISTRICT:'',
    DISTRICTID:'',
    BLOCKULB:'',
    BLOCKIDULBID:'',
    GPWARD:'',
    GPIDWARDID:'',
    LOCALITYVILLAGE:'',
    LOCALITYVILLAGEID:'',
    FPSNAME:'',
    SCHEMETYPE:'',
    STATUS:'',
    ADDITIONDELETIONSTATUS:'',
    DATASTATUS:'',
    EXPORTDATE:'',
    UPDATEDATE:'',
    CREATEDON:'',
    CREATEDBY:''


  };
  heading = [
    [
      'Sl#',
      'ID',
      'HEALTH SLNO',

      'RATION CARD NUMBER',
      'RATION CARD TYPE',
      'FULL NAME IN ENGLISH',
      'FULL NAME IN ODIYA',
      'AADHAAR NUMBER',
      '  GENDER',
      ' SPOUSE FULL NAME',
       'FATHER FULL NAME',
'MOBILE NUMBER',
'DISTRICT',
'DISTRICT ID',
'BLOCK ULB',
'BLOCKID_ULBID',
'GP WARD',
'GPID WARDID',
'LOCALITY VILLAGE',
'LOCALITY VILLAGE ID',
'FPSNAME',
'SCHEMETYPE',
'STATUS',
'ADDITION DELETION STATUS',
'DATA STATUS',
'EXPORT DATE',
'UPDATE DATE',
'CREATED ON',
'CREATED BY',
// 'UPDATED ON',

// 'UPDATED BY'


    ],
  ];
  heading1 = [
    [
      'Sl#',
      'ID',
      'HEALTH MEMBER SLNO',
      'RATION CARD NUMBER',
      'MEMBER ID',
      'FULL NAME IN ENGLISH',
      'FULL NAME IN ODIYA',
      'AADHAAR NUMBER',
      'GENDER',
      'DATE OF BIRTH',

      'AGE',
      'RELATION WITH FAMILY HEAD',
'SCHEME TYPE',
'MOBILE NUMBER',
'STATUS',

      'ADDITION DELETION STATUS',
      ' DATA STATUS',

       ' EXPORT DATE',
      'UPDATE DATE',
      'CREATED ON',
      'CREATED BY',
      // 'UPDATED ON'



    ],
  ];
  downloadReport(type){
    this.report = [];
  let claim: any;


  for (var i = 0; i < this.claimlist.length; i++) {
    claim = this.claimlist[i];
    console.log(claim);
        this.sno = [];
        this.sno.Slno = i + 1;
        if(this.show){

          this.sno.ID =claim.id;
          this.sno.HEALTHSLNO = claim.healthslno;
          this.sno.RATIONCARDNUMBER =claim.rationcardnumber;
          this.sno.RATIONCARDTYPE = claim.rationcardtype;
          this.sno.FULLNAMEINENGLISH = claim.fullnameenglish;
          this.sno.FULLNAMEINODIYA = claim.fullnameodiya;
          this.sno.AADHAARNUMBER = claim.aadhaarnumber;
          this.sno.GENDER = claim.gender;
          this.sno.SPOUSEFULLNAME = claim.spousefullname;
          this.sno.FATHERFULLNAME=claim.fatherfullname;
          this.sno.MOBILENUMBER=claim.mobilenumber;

          this.sno.DISTRICT=claim.district;
          this.sno.DISTRICTID=claim.districtid;
          this.sno.BLOCKULB=claim.block_ulb;
          this.sno.BLOCKIDULBID=claim.blockid_ulbid;
          this.sno.GPWARD=claim.gp_ward;
          this.sno.GPIDWARDID=claim.gpid_wardid;
          this.sno.LOCALITYVILLAGE=claim.locality_village;
          this.sno.LOCALITYVILLAGEID=claim.localityid_villageid;
          this.sno.FPSNAME=claim.fpsname;
          this.sno.SCHEMETYPE=claim.schemetype;
          this.sno.STATUS=claim.status;
          this.sno.ADDITIONDELETIONSTATUS=claim.additiondeletionstatus;
          this.sno.DATASTATUS=claim.data_status;
          this.sno.EXPORTDATE=this.convertStringToDate1(claim.exportdate);
          this.sno.UPDATEDATE=this.convertStringToDate1(claim.updatedate);
          this.sno.CREATEDON=this.convertStringToDate1(claim.created_ON);
          this.sno.CREATEDBY=claim.created_BY;
}else{

          this.sno.IDENTITY=claim.identity;
          this.sno.HEALTHMEMBERSLNO=claim.healthslcardno;
          this.sno.RATIONCARDNUMBER =claim.rationcardnumber;
          this.sno.MEMBERID=claim.memberid;
          this.sno.FULLNAMEINENGLISH = claim.fullnameenglish;
          this.sno.FULLNAMEINODIYA = claim.fullnameodiya;
          this.sno.AADHAARNUMBER = claim.aadhaarnumber;
          this.sno.GENDER = claim.gender;
          this.sno.DATEOFBIRTH=claim.dateofbirth;
         this.sno.AGE=claim.age;
         this.sno.RELATIONWITHFAMILYHEAD = claim.relationshipwithfam;
         this.sno.SCHEMETYPE=claim.schemetype;

         this.sno.MOBILENUMBER=claim.mobilenumber;
       this.sno.STATUS=claim.status;
       this.sno.ADDITIONDELETIONSTATUS=claim.additiondeletionstatus;
       this.sno.DATASTATUS=claim.data_status;
       this.sno.EXPORTDATE=this.convertStringToDate1(claim.exportdate);
       this.sno.UPDATEDATE=this.convertStringToDate1(claim.updatedate);
       this.sno.CREATEDON=this.convertStringToDate1(claim.created_ON);
     this.sno.CREATEDBY=claim.created_BY;
 }

this.report.push(this.sno);
    console.log(this.report);
    console.log(this.sno);

  }

  if(type=='xcl') {
    let filter =[];

    if(this.show){
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Ration Card Schedular Report',
        this.heading,filter
      );
    }else{
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Ration Card Schedular Report',
        this.heading1,filter
      );
    }
  }

else if(type=='pdf') {
  if(this.report==null || this.report.length==0) {
    this.swal("Info", "No Record Found", "info");
    return;
  }
  var doc = new jsPDF('l', 'mm',[360, 260]);
  doc.setFontSize(12);
  var rows = [];
  if(this.show){
  for(var i=0;i<this.report.length;i++) {
    var clm = this.report[i];
    var pdf = [];
    pdf[0] = clm.Slno;
    pdf[1] = clm.ID;
    pdf[2] = clm.HEALTHSLNO;
    pdf[3] = clm.RATIONCARDNUMBER;

    pdf[4] = clm.RATIONCARDTYPE;
    pdf[5] = clm.FULLNAMEINENGLISH;
    pdf[6] = clm.FULLNAMEINODIYA;
    pdf[7] = clm.AADHAARNUMBER;
    pdf[8] = clm.GENDER;
    pdf[9] = clm.SPOUSEFULLNAME;
    pdf[10] = clm.FATHERFULLNAME;
    pdf[11] = clm.MOBILENUMBER;
    pdf[12] = clm.DISTRICT;
    pdf[13] = clm.DISTRICTID;
    pdf[14] = clm.BLOCKULB;
    pdf[15] = clm.BLOCKIDULBID;
    pdf[16] = clm.GPWARD;
    pdf[17] = clm.GPIDWARDID;
    pdf[18] = clm.LOCALITYVILLAGE;
    pdf[19] = clm.LOCALITYVILLAGEID;
    pdf[20] = clm.FPSNAME;
    pdf[21] = clm.SCHEMETYPE;
    pdf[22] = clm.STATUS;
    pdf[23] = clm.ADDITIONDELETIONSTATUS;
    pdf[24] = clm.DATASTATUS;
    pdf[25] = clm.EXPORTDATE;
    pdf[26] = clm.UPDATEDATE;
    pdf[27] = clm.CREATEDON;
    pdf[28] = clm.CREATEDBY;

    rows.push(pdf);
  }
  console.log(rows);
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: {cellWidth: 10},
          1: {cellWidth: 20},
          2: {cellWidth: 20},
          3: {cellWidth: 20},
          4: {cellWidth: 20},
          5: {cellWidth: 20},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20},
          9: {cellWidth: 20},
          10: {cellWidth: 20},
          11: {cellWidth: 20},
          12: {cellWidth: 20},
          13: {cellWidth: 20},
          14: {cellWidth: 20},
          15: {cellWidth: 20},
          16: {cellWidth: 20},
          17: {cellWidth: 20},
          18: {cellWidth: 20},
          19: {cellWidth: 20},
          20: {cellWidth: 20},
          21: {cellWidth: 20},
          22: {cellWidth: 20},
          23: {cellWidth: 20},
          24: {cellWidth: 20},
          25: {cellWidth: 20},
          26: {cellWidth: 20},
          27: {cellWidth: 20},
          28: {cellWidth: 20},
          29: {cellWidth: 20},



        }
      });
    }else{
      for(var i=0;i<this.report.length;i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.IDENTITY;
        pdf[2] = clm.HEALTHMEMBERSLNO;
        pdf[3] = clm.RATIONCARDNUMBER;

        pdf[4] = clm.MEMBERID;
        pdf[5] = clm.FULLNAMEINENGLISH;
        pdf[6] = clm.FULLNAMEINODIYA;
        pdf[7] = clm.AADHAARNUMBER;
        pdf[8] = clm.GENDER;
        pdf[9] = clm.DATEOFBIRTH;
        pdf[10] = clm.AGE;
        pdf[11] = clm.RELATIONWITHFAMILYHEAD;
        pdf[12] = clm.SCHEMETYPE;
        pdf[13] = clm.MOBILENUMBER;
        pdf[14] = clm.STATUS;
        pdf[15] = clm.ADDITIONDELETIONSTATUS;
        pdf[16] = clm.DATASTATUS;
        pdf[17] = clm.EXPORTDATE;
        pdf[18] = clm.UPDATEDATE;
        pdf[19] = clm.CREATEDON;
        pdf[20] = clm.CREATEDBY;
        // pdf[21] = clm.UPDATEDON;


        rows.push(pdf);
      }
      console.log(rows);
          autoTable(doc, {
            head: this.heading1,
            body: rows,
            theme: 'grid',
            startY: 40,
            headStyles: {
              fillColor: [26, 99, 54]
            },
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 20},
              2: {cellWidth: 20},
              3: {cellWidth: 20},
              4: {cellWidth: 20},
              5: {cellWidth: 20},
              6: {cellWidth: 20},
              7: {cellWidth: 20},
              8: {cellWidth: 20},
              9: {cellWidth: 20},
              10: {cellWidth: 20},
              11: {cellWidth: 20},
              12: {cellWidth: 20},
              13: {cellWidth: 20},
              14: {cellWidth: 20},
              15: {cellWidth: 20},
              16: {cellWidth: 20},
              17: {cellWidth: 20},
              18: {cellWidth: 20},
              19: {cellWidth: 20},
              20: {cellWidth: 20},
              // 21: {cellWidth: 20},




            }
          });

    }

      doc.save('Bsky_Ration Card Schedular Report.pdf');
    }
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  convertStringToDate1(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy HH:mm:ss');
    return date;
    }
    // onPageBoundsCorrection(number: number) {
    //   this.currentPage = number;
    // }
    }


