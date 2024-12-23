import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../header.service';
import { HospitalspecialityreportserviceService } from '../../Services/hospitalspecialityreportservice.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mdrproceduremapping',
  templateUrl: './mdrproceduremapping.component.html',
  styleUrls: ['./mdrproceduremapping.component.scss']
})
export class MdrproceduremappingComponent implements OnInit {

  @ViewChild('packageModalId') packageModalId: ElementRef;

  txtsearchDate: any;
  txtsearchPkgData: any;
  user: any;
  procedureList: any = [];
  pageElement1: any;
  currentPage1: any;
  showPegi1: any;
  record1: any;
  headerCode:any="";
  doclist:any;
  headerCodeList:any;
  keyword="headerName";
  tagginglog:any=[];


  constructor(
    public headerService: HeaderService,
    public hospitalspecialityreportservice: HospitalspecialityreportserviceService,
    public qcadminserv: QcadminServicesService,
    public router: Router,
    private modalService: NgbModal,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit() {
    this.headerService.setTitle('MDR Document Mapping');
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeaderCodeList();
    this.getprocedurelist();
  }

  getprocedurelist(){
    this.hospitalspecialityreportservice
    .getProcedurethroughpackagecode(this.headerCode)
    .subscribe((data: any) => {
      this.procedureList = data.data;
      this.pageElement1 = 50;
      this.currentPage1 = 1;
      this.showPegi1=true;
    });
  }


  getPackageHeaderCodeList() {
    this.hospitalspecialityreportservice
      .getPackageHeaderCodeList()
      .subscribe((data: any) => {
        this.headerCodeList = data;
      });
  }

  selectEvent(item:any){
    this.headerCode=item.headerCode;
    this.getprocedurelist();
  }

  clearEvent(){
    this.headerCode="";
    this.getprocedurelist();
  }

  taggeddetails(data:any){
    this.procedureCode=data.procedureCode;
    this.headerCode=data.packageHeaderCode;
    this.hospitalspecialityreportservice.getproceduretagggeddoclist(data.procedureCode).subscribe((data: any) => {
      if(data.status==200){
        this.tagginglog=data.data;
      }else{
        this.swal('Error','Something Went Wrong','error');
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  procedureDescription: any;
  procedureCode: any;
  taggedlist:any=[];
  getPackage(data:any) {
    this.showselectitemlist=[];
    this.taggedlist=[];
    this.procedureCode=data.procedureCode
    this.headerCode=data.packageHeaderCode
    this.hospitalspecialityreportservice
    .getproceduretagdocument(data.procedureCode)
    .subscribe((data: any) => {
    if(data.status==200){
      this.doclist=data.data;
      for(const element of this.doclist){
        if(element.status==0 ){
          let selected={
            docid:element.docid,
            docname:element.docname,
            preauth:element.prestatus,
            claim:element.claimstatus,
            status:element.tagstatus,
            stat:''
          }
          this.taggedlist.push(selected);
          this.showselectitemlist.push(selected);
        }
      }
      this.selectitemlist=[];
      this.openModal();
    }else{
      this.swal('Error','Something Went Wrong','error');
    }
    });
  }

  selectitemlist:any=[];
  showselectitemlist:any=[];
  selectitem(data, isChecked) {
    for(let element of this.doclist){
      if(element.docid==data.docid){
        element.tagstatus=data.tagstatus==0?1:0;
      }
    }
    let selected={
      docid:data.docid,
      docname:data.docname,
      preauth:data.prestatus,
      claim:data.claimstatus,
      status:data.tagstatus,
      stat:1
    }
    let stat = false;
    for (const i of this.selectitemlist) {
      if (i.docid == data.docid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectitemlist.push(selected);
    }else{
      for(const element of this.selectitemlist) {
        if(data.docid==element.docid) {
          let index = this.selectitemlist.indexOf(element);
          if (index !== -1) {
            this.selectitemlist.splice(index, 1);
          }
        }
      }
    }

    this.showlist();
  }

  showlist(){
    this.showselectitemlist=[];
    for(const element of this.taggedlist){
      this.showselectitemlist.push(element);
    }
    for(const element of this.selectitemlist){
      if(element.status==0 ){
        let stat =false;
        for(const element1 of this.showselectitemlist){
          if(element1.docid==element.docid){
            stat=true;
          }
        }
        if(stat==false){
          this.showselectitemlist.push(element);
        }
      }else{
        for(const element1 of this.showselectitemlist){
          if(element1.docid==element.docid){
            let index = this.showselectitemlist.indexOf(element1);
            if (index !== -1) {
              this.showselectitemlist.splice(index, 1);
            }
          }
        }
      }
    }
  }

  changestatus(data:any,ststus:any){
    let stat=true;
    for(let element of this.selectitemlist){
      if(element.docid==data.docid){
        stat=false;
        if(ststus==1){
          element.preauth=element.preauth==0?1:0
        }
        if(ststus==2){
          element.claim=element.claim==0?1:0
        }
      }
    }
    if(stat){
      if(data.tagstatus==0){
        let selected={
          docid:data.docid,
          docname:data.docname,
          preauth:data.prestatus,
          claim:data.claimstatus,
          status:data.tagstatus,
          stat:2
        }
        if(ststus==1){
          selected.preauth=selected.preauth==0?1:0
        }
        if(ststus==2){
          selected.claim=selected.claim==0?1:0
        }
        this.selectitemlist.push(selected);
      }else{
        this.swal("Error","Plesae select Documnet first","error");
      }
    }

    this.showlist();
  }

  submit() {
    for(let element of this.selectitemlist){
      if(element.status==0 && element.stat==1){
        if(element.preauth==1 && element.claim==1){
          this.swal("Warning","Plesae Select Document Applicable For '"+element.docname+"'","warning");
          return;
        }
      }
    }
    if(this.selectitemlist.length==0){
      this.swal("Warning","Plesae Select Atleast One Documnet","warning");
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Save this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          "procedureCode":this.procedureCode,
          "headerCode":this.headerCode,
          "selectitemlist":this.selectitemlist,
          "createdby":this.user.userId
        }
        this.hospitalspecialityreportservice.savedocproceduremapping(object).subscribe(
          (response:any) => {
            if(response.status==200){
              this.swal('Success', response.message,'success');
              this.selectitemlist=[];
              this.closeModal();
            }else{
              this.swal('Error', response.message, 'error');
            }
          });
      }
    });
  }

  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }
  onPageBoundsCorrection(number: number) {
    this.currentPage1 = number;
  }

  openModal() {
    this.modalService.open(this.packageModalId, { size: 'lg', backdrop: 'static', keyboard: false, ariaLabelledBy: 'modal-basic-title' }).result.then((result: any) => {
    }, (reason: any) => { });
  }

  closeModal() {
    this.procedureCode = "";
    this.procedureDescription = "";
    this.doclist=[];
    this.selectitemlist=[];
    this.modalService.dismissAll();
  }

  titeltext:any="";
  onMouseOver(i: any){
    this.titeltext="";
    if(i.preauth==0){
      this.titeltext+="Preauth,"
    }
    if(i.claim==0){
      this.titeltext+="Claim";
    }
  }
}
