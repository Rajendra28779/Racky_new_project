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
  selector: 'app-manageduplicatebenificaryview',
  templateUrl: './manageduplicatebenificaryview.component.html',
  styleUrls: ['./manageduplicatebenificaryview.component.scss']
})
export class ManageduplicatebenificaryviewComponent implements OnInit {
  user:any;
  search:any;
  searchvalue:any;
  list:any=[];
  count:any=0;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  txtsearchDate:any;


  constructor(private route: Router,
    public headerService: HeaderService,
    private sessionService: SessionStorageService,
    private managedduplicateservice: ManagedduplicatedbenificiaryService,) { }

  ngOnInit(): void {
    this.headerService.setTitle('Managed Duplicate Beneficiary');
    this.user = this.sessionService.decryptSessionData('user');
    this.Search();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  Search(){
  this.search = $('#search').val();
    this.searchvalue = $('#urn').val();
    this.managedduplicateservice.manageduplicatebeneficiaryviewlist( this.search,this.searchvalue).subscribe(
      (data: any) => {
      if(data.status==200){
        this.list=data.data;
        this.count=this.list.length;
        if(this.count>0){
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=100;
        }else{
          this.showPegi=false;
        }
      }else{
        this.swal('Error', 'Something Went Wrong', 'error');
      }
    });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  Reset(){
    window.location.reload();
  }

  report:any=[];
  sno:any=[];
  heading=[['Sl#', 'URN', 'Member Name', 'UID', 'Age', 'Gender', 'DOB', 'In-Active By', 'In-Active On','Remark']];
  downloadReport(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.urn);
      this.sno.push(sna.membername);
      this.sno.push(sna.aadharno);
      this.sno.push(sna.age);
      this.sno.push(sna.gender);
      this.sno.push(sna.dob);
      this.sno.push(sna.updateon);
      this.sno.push(sna.updateby);
      this.sno.push(sna.remark);
      this.report.push(this.sno);
    }
    if (no == 1) {
      let filter = [];
      filter.push([['Search Type', this.search==1?'URN':'UID']]);
      filter.push([['Search Value', this.searchvalue]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'In-Active Beneficiary List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("In-Active Beneficiary List", 60, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 32);
      doc.text('Search Type  :- ' + (this.search==1?'URN':'UID'), 15, 39);
      doc.text('Search Value :- ' + this.searchvalue, 15, 46);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('In-Active Beneficiary List.pdf');
  }
}

}
