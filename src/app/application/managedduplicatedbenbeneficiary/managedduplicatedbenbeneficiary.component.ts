import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { ManagedduplicatedbenificiaryService } from '../Services/managedduplicatedbenificiary.service';
import { formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managedduplicatedbenbeneficiary',
  templateUrl: './managedduplicatedbenbeneficiary.component.html',
  styleUrls: ['./managedduplicatedbenbeneficiary.component.scss']
})
export class ManagedduplicatedbenbeneficiaryComponent implements OnInit {
  user: any;
  txtsearchDate: any;
  searchvalue: any;
  beneficiarylist:any= [];
  currentPage: any;
  pageElement: any;
  response: any;
  totalApproveCount1: any;
  totalApproveCount2: any;
  maxChars:any=500;
  managedbeneficiarylist:any= [];
  ongoingtreatmentlist:any= [];

  dataa:any;
startdate:any;
enddate:any;
  constructor(
    private route: Router,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private managedduplicateservice: ManagedduplicatedbenificiaryService,
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Managed Duplicate Beneficiary');
    this.user = this.sessionService.decryptSessionData('user');
    let monthss:any=new Date().getMonth();
    let yearss:any=new Date().getFullYear();
    if(monthss>=8){
       this.startdate='01-September-'+yearss;
       this.enddate='31-August-'+(yearss+1);
    }else{
       this.startdate='31-August-'+(yearss-1);
       this.enddate='01-September-'+yearss;
    }

  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  search: any;
  Search(){
    this.search = $('#search').val();
    if (this.search == '' || this.search == null || this.search == undefined) {
      this.swal('', 'Please Fill Search Type', 'error');
      return;
    }
    this.searchvalue = $('#urn').val();
    if (this.searchvalue == '' || this.searchvalue == null || this.searchvalue == undefined) {
      if (this.search == '1') {
        this.swal('', 'Please Fill URN No. !', 'error');
      } else if (this.search == '2') {
        this.swal('', 'Please Fill UID  No.', 'error');
      } else {
        this.swal('', 'Please Fill Search Type !', 'error');
      }
      return;
    }
    this.managedduplicateservice.manageduplicatebeneficiarylist( this.search,this.searchvalue).subscribe(
      (data: any) => {
        this.response = data;
        this.beneficiarylist = this.response;
        let sum1 = 0;
        let sum2 = 0;
        for (let i = 0; i < this.beneficiarylist.length; i += 1) {
          sum1 += parseFloat(this.beneficiarylist[i].amountblocked);
          sum2 += parseFloat(this.beneficiarylist[i].claimamount);
        }
        this.totalApproveCount1 = sum1;
        this.totalApproveCount2 = sum2;

      }
    );


  }
  Reset()
  {
    window.location.reload();

}

//FAMILY-DEATILS
  rowDetails(urnno:any,item:any){
    for(let elsement of this.beneficiarylist){
      if(elsement.urn==urnno){
        elsement.status=elsement.status==0?1:0;
      }else{
        elsement.status=0;
      }
    }
    let urn = urnno
    this.managedduplicateservice.beneficiaryfamilylist('3',  urn).subscribe((data: any) => {
      this.response = data;
      this.managedbeneficiarylist = this.response;

    });
  }

  item:any;
  action(item:any){
    this.ongoingtreatmentlist=[];
    this.item=item;
    $('#log').show();
    this.managedduplicateservice.ongoingtreatmentlist('5',  this.item.uid).subscribe((dataa: any) => {
      this.response = dataa;
      this.ongoingtreatmentlist = this.response;
    });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  allow:boolean = false;
  submit(status:any){
    let reamrk= $('#remark').val();
    if(reamrk==null || reamrk==''|| reamrk==undefined){
      this.swal("Info", "Please Enter The Remark", 'info');
      return;
    }
    let activeurn:any='',amount:any=0;
    if(status==1){
    }else if(status==3){
      this.allow=true;
      return;
    }else  if(status==2){
      activeurn= $('#activeurn').val();
      if(activeurn==null || activeurn==''|| activeurn==undefined){
        this.swal("Info", "Please Active Urn", 'info');
        $('#activeurn').focus();
        return;
      }
      amount= $('#amount').val();
      if(amount==null || amount==''|| amount==undefined){
        this.swal("Info", "Please Enter Amount", 'info');
        $('#amount').focus();
        return;
      }
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Inactive!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          urn:this.item.urn,
          memberslno:this.item.memberslno,
          remark:reamrk,
          userid:this.user.userId,
          activeurn:activeurn,
          amount:amount,
          status:status,
        }
        console.log(object);
        this.Inactive(object);
      }
    });
}
  Inactive(object:any){
    this.managedduplicateservice.inactivebeneficiary(object).subscribe(
      (response:any) => {
        this.dataa=response;
        if(this.dataa.status == 200) {
          this.swal("Successful", this.dataa.message, 'success');
          this.Search();
          $('#log').hide();
          $('#remark').val('');
          $('#amount').val('');
          $('#activeurn').val('')
          this.allow=false;
      }else {
        this.swal("Error",this.dataa.message, 'error');
      }
    });
  }

  closemodal(){
    $('#log').hide();
    this.allow=false;
    $('#remark').val('');
    $('#amount').val('');
    $('#activeurn').val('')
  }
  report: any = [];
  sno: any = [];
  heading = [['Sl#',
  'State Name',
  'District Name',
  'Ward/Panchayat Name',
  'Village Name',
   'URN',
   'Scheme Name',
  //  'Export To GJAY',
   'Ongoing Blocked Amount For Family',
   'Claim/Discharge Amount For Family',
   'Availaible Family Fund',
   'Availaible Female Fund',

   ]];
  downloadReport(no: any) {
    if ( this.beneficiarylist.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.beneficiarylist.length; i++) {
      sna = this.beneficiarylist[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.state);
      this.sno.push(sna.dist);
      this.sno.push(sna.ward);
      this.sno.push(sna.village);
      this.sno.push(sna.urn);
      this.sno.push(sna.schemename);
      // this.sno.push(sna.exporttobskydate);
      this.sno.push(sna.amountblocked);
      this.sno.push(sna.claimamount);
      this.sno.push(sna.availablebalanceforfamily);
      this.sno.push(sna.femalefund);

      this.report.push(this.sno);
    }
      this.sno = [];
      this.sno.push("TOTAL");
      this.sno.push("");
      this.sno.push("");
      this.sno.push("");
      this.sno.push("");
      this.sno.push("");
      this.sno.push("");
      // this.sno.push("");
      this.sno.push(this.totalApproveCount1);
      this.sno.push(this.totalApproveCount2);
      this.sno.push("");
      this.sno.push("");
    this.report.push(this.sno);
    if (no == 1) {
      let filter = [];
      filter.push([['Search Type', this.search==1?'URN':'UID']]);
      filter.push([['Search Value', this.searchvalue]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Managed Duplicate Beneficiary',
        this.heading, filter
      );
    } else {

      var doc = new jsPDF('p', 'mm', [400, 320]);
      doc.setFontSize(20);
      doc.text("Managed Duplicate Beneficiary", 120, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 35);
      doc.text('Search Type  :- ' + (this.search==1?'URN':'UID'), 15, 45);
      doc.text('Search Value :- ' + this.searchvalue, 15, 55);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 80,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 25 },
          9: { cellWidth: 25 },
          10: { cellWidth: 25 },
          11: { cellWidth: 25 },
        }
      });
      doc.save('Managed Duplicate Beneficiary.pdf');
    }

  }
}
