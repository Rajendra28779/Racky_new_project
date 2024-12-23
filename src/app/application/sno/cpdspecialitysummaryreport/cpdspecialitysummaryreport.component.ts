import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ConfigurationService } from '../../Services/configuration.service';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-cpdspecialitysummaryreport',
  templateUrl: './cpdspecialitysummaryreport.component.html',
  styleUrls: ['./cpdspecialitysummaryreport.component.scss']
})
export class CpdspecialitysummaryreportComponent implements OnInit {
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  packageHeaderItem: any = [];
  placeHolder = "Select Specialty";
  dropdownSettings: IDropdownSettings = {};
  user:any;
  procedureName: any;
  procedure: any;
  txtsearchDate:any;
  txtsearch:any;
  list:any=[];
  taggedcpdlist:any=[];
  showPegi: boolean=false;
  currentPage: any;
  pageElement: any;
  totalcount:any=0
  sum: any=0;
  sum1: any;


  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService,
    public config:ConfigurationService,
    private sesonservice:SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Specialty Summary Report");
    this.user = this.sesonservice.decryptSessionData("user");
    this.getPackageHeader();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'headerId',
      textField: 'packageheadername',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
    this.search();
  }

  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
    });
  }

  hospList:any=[];
  onItemSelect(item) {
    this.hospList.push(item.headerId);
  }

  onSelectAll(list) {
    this.hospList = [];
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.hospList.push(item.headerId);
    }
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.headerId == this.hospList[i]) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    this.hospList = [];
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  convertarrtostring(hospList:any){
    var str = "";
    for (var i = 0; i < hospList.length; i++) {
      str = str + hospList[i] + ",";
    }
    return str;
  }

  search(){
    let speclty=this.convertarrtostring(this.hospList);
    this.config.getspecilitywisecpdcount(speclty,this.user.userId).subscribe((data:any) => {
      if(data.status==200){
        this.list = data.data;
        this.totalcount=this.list.length;
        if(this.totalcount>0){
          let sum=0;
            for(let i = 0; i < this.list.length; i++){
              sum+=parseInt(this.list[i].count);
            }
          this.sum=sum;
          this.showPegi=true;
          this.currentPage=1;
          this.pageElement=50
        }else{
          this.showPegi=false;
          this.swal('Info',"NO Data Found !!",'info')
        }
      }else{
        this.swal('Error',"Something Went Wrong",'error')
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#','Specialty Code','Specialty Name','No of Doctor']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.packagecode);
      this.sno.push(sna.packagename);
      this.sno.push(sna.count);
      this.report.push(this.sno);
    }
    this.sno=[];
      this.sno.push(i+1);
      this.sno.push("");
      this.sno.push("Total");
      this.sno.push(this.sum);
      this.report.push(this.sno);
    if(no==1){
      let filter =[];
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Speciality Summary Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("CPD Speciality Summary Report", 60, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
        autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 40,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('CPD_Speciality_Summary_Report.pdf');
    }
  }

  selectobj:any;
  details(item:any){
    this.selectobj = item;
    if(this.selectobj.count==0){
      this.swal('Info',"NO Data Found !!",'info')
      return;
    }
    this.config.getspecilitywisecpdlist(this.selectobj.packageid,this.user.userId).subscribe((data:any) => {
      if(data.status==200){
        this.taggedcpdlist = data.data;
        let sum=0;
        for(let i = 0; i < this.taggedcpdlist.length; i++){
          sum+=parseInt(this.taggedcpdlist[i].count);
        }
      this.sum1=sum;
        if (this.taggedcpdlist.length > 5) {
          document.getElementById('treatmentTable1').classList.add('treatment-history-table-class', 'treatment-history-table-head-class');
        }
        $('#cpdmodal').show();
      }else{
        this.swal('Error',"Something Went Wrong",'error')
      }
    });

  }

  closemodal(){
    $('#cpdmodal').hide();
  }

  downloaddocument(fileName:any,userid:any){
    if (fileName != null && fileName != '' && fileName != undefined) {
      let img = this.config.downloadcpdspecdoc(fileName,userid);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }


  heading1 = [['Sl#','CPD Doctor Name','Mobile No','Restricted Hospital']];
  downloadm(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.taggedcpdlist.length; i++) {
      sna=this.taggedcpdlist[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.cpdName);
      this.sno.push(sna.mobileNo);
      this.sno.push(sna.count);
      this.report.push(this.sno);
    }
    this.sno=[];
      this.sno.push(i+1);
      this.sno.push("");
      this.sno.push("Total");
      this.sno.push(this.sum1);
      this.report.push(this.sno);
    if(no==1){
      let filter =[];
      filter.push([['Specialty :- ',this.selectobj.packagename+" ( "+this.selectobj.packagecode+" ) "]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'CPD Speciality Summary Report',
          this.heading1,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("CPD Speciality Summary Report", 60, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- '+generatedOn,15,25);
      doc.text('GeneratedBy :- '+generatedBy,15,33);
      doc.text('Specialty :- '+this.selectobj.packagename+" ( "+this.selectobj.packagecode+" ) ",15,41);
        autoTable(doc, {
          head: this.heading1,
          body: this.report,
          theme: 'grid',
          startY: 47,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('CPD_Speciality_Summary_Report.pdf');
    }
  }

}
