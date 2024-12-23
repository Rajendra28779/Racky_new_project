import { Component, OnInit } from '@angular/core';
import {HeaderService} from "../../header.service";
import {SnocreateserviceService} from "../../Services/snocreateservice.service";
import {IDropdownSettings} from "ng-multiselect-dropdown";
import Swal from "sweetalert2";
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-hospital-uid-auth-configuration',
  templateUrl: './hospital-uid-auth-configuration.component.html',
  styleUrls: ['./hospital-uid-auth-configuration.component.scss']
})
export class HospitalUidAuthConfigurationComponent implements OnInit {

  stateCode: any="";
  textSearch: any;
  districtCode: any="";
  hospitalCode: any="";
  stateList: any[] = [];
  districtList: any[] = [];
  hospitalList: any[] = [];
  allRecordsSize: any;
  showPegi: boolean=false;
  pageElement: any= 100;
  currentPage: any = 1;
  configList: any[] = [];
  selectedItems: any[] = [];
  otp:any;
  pos:any;
  iris:any;
  face:any;
  finger:any;
  otpsta:any=1;
  possta:any=1;
  irissta:any=1;
  facesta:any=1;
  fingersta:any=1;
  user:any;

  constructor(
    public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Hospital UID Auth Configuration');
    this.user = this.sessionService.decryptSessionData('user');
    this.getStateList();
    this.fetchDetails();
  }

  getStateList() {
    this.stateList = [];
    this.snoService.getStateList().subscribe(
      (response: any) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  onChangeState(id) {
    this.stateCode = id;
    $("#districtId").val("");
    this.hospitalList = [];
    this.selectedItems = [];
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response: any) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  onChangeDistrict(id) {
    this.districtCode = id;
    this.hospitalList = [];
    this.selectedItems = [];
    this.qcadminServices.gettmasactivehospitallist(this.stateCode,id).subscribe(
      (response: any) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  reset() {
    this.configList = [];
    this.selectedItems = [];
    $('#stateId').val('');
    $('#districtId').val('');
    $('#hosId').val('');
    this.stateCode='';
    this.districtCode='';
    this.hospitalCode='';
    this.showPegi=false;
    this.fetchDetails();
    this.textSearch = '';
  }

  fetchDetails() {
    // if (!this.stateCode) {
    //   Swal.fire({
    //     title: "Information",
    //     text: "Please Select State!",
    //     icon: "info"
    //   });
    //   return;
    // } else {
      this.selectedItems=[];
      this.hospitalCode=$('#hosId').val();
      let data = {
        actionCode: 'A',
        stateCode: this.stateCode ?? '',
        districtCode: this.districtCode ?? '',
        hospitalCode: this.hospitalCode ?? ''
      };
      this.configList = [];
      this.snoService.getMappedAuthDetails(data).subscribe((response: any) => {
        if(response.status==200){
            this.configList = response.data;
            this.otpsta=response.otptatus;
            this.possta=response.postatus;
            this.irissta=response.iristatus;
            this.facesta=response.facetatus;
            this.fingersta=response.fingersta;
            this.allRecordsSize = this.configList.length;
            this.showPegi = this.allRecordsSize > 0;
            if(this.showPegi) {
              let obj=this.configList[0];
              this.otp=obj.otpid;
              this.pos=obj.posid;
              this.iris=obj.irisid;
              this.face=obj.faceid;
              this.finger=obj.fingerId;
            }
          }else{Swal.fire({title: "Error",text: "Something Went Wrong",icon: "error"});}
      });
    // }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  selectallitem(id:any,event:any,no:any){
    let flag;
    if (event.target.checked) {
      flag=0;
    } else {
      flag=1;
    }

    for(let element of this.configList){
      if(no==1){
        element.pos=flag;
      }else if(no==2){
        element.iris=flag;
      } else if(no==3){
        element.face=flag;
      } else if(no==4){
        element.otp=flag;
      }else if(no==5){
        element.finger=flag;
      }

      let obj ={
        hospitalCode:element.hospitalCode,
        hospitalId:element.hospitalid,
        verificationId:id,
        flag:flag,
      }

    for (const i of this.selectedItems) {
      if (i.hospitalCode == element.hospitalCode && i.verificationId == id) {
        let index = this.selectedItems.indexOf(i);
          if (index !== -1) {
            this.selectedItems.splice(index, 1);
          }
      }
    }
    this.selectedItems.push(obj);
    }

  }

  selectitem(id:any,item:any,flag:any,no:any){
    for(let element of this.configList){
      if(element.hospitalCode==item.hospitalCode){
        if(no==1){
          element.pos=flag==0?1:0;
        }else if(no==2){
          element.iris=flag==0?1:0;
        } else if(no==3){
          element.face=flag==0?1:0;
        } else if(no==4){
          element.otp=flag==0?1:0;
        }else if(no==5){
          element.finger=flag==0?1:0;
        }
      }
    }

    let obj ={
      hospitalCode:item.hospitalCode,
      hospitalId:item.hospitalid,
      verificationId:id,
      flag:flag==0?1:0,
    }

    let stat: boolean = false;
    for (const i of this.selectedItems) {
      if (i.hospitalCode == item.hospitalCode && i.verificationId == id) {
        stat = true;
      }
    }

    if (stat == false) {
      this.selectedItems.push(obj);
    }else{
      for (let element of this.selectedItems) {
        if (element.hospitalCode == item.hospitalCode && element.verificationId == id) {
          let index = this.selectedItems.indexOf(element);
          if (index !== -1) {
            this.selectedItems.splice(index, 1);
          }
        }
      }
    }
  }

  submit(){
    console.log(this.selectedItems);
    if(this.selectedItems.length==0){
      Swal.fire({
        title: "Info",
        text: "Please Select One",
        icon: "info"
      });
      return ;
    }

    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!',
    }).then((result) => {
      if (result.isConfirmed) {

          let object={
            actionBy:this.user.userId,
            selectedlist:this.selectedItems
          }

          this.qcadminServices.submituidauthconfig(object).subscribe((response: any) => {
            if(response.status == 200){
              Swal.fire({
                title: "Success",
                text: "Data Submitted Successfully!",
                icon: "success"
              });
              this.reset();
            }else{
              Swal.fire({
                title: "Error",
                text: "Something Went Wrong",
                icon: "error"
              });
            }
          });
      }
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'Hospital Name', 'Hospital Code', 'OTP', 'IRIS', 'POS', 'FACE']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.configList.length; i++) {
      sna = this.configList[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.hospitalCode);
      this.sno.push(sna.otp==0?'YES':'NO');
      this.sno.push(sna.iris==0?'YES':'NO');
      this.sno.push(sna.pos==0?'YES':'NO');
      this.sno.push(sna.face==0?'YES':'NO');
      this.report.push(this.sno);
    }
    let stateName:any='All';
    let distname:any='All';
    let hospitalname:any='All';

    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.stateCode) {
        stateName  = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.districtCode) {
        distname = this.districtList[j].districtname;
      }
    }
    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == this.hospitalCode) {
        hospitalname = this.hospitalList[j].hospName;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospitalname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital Authentication Mapping',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        Swal.fire({title: "Info",text: "No Record Found",icon: "info"});
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital Authentication Mapping", 60, 15);
      doc.setFontSize(13);
      doc.text('State Name :- ' + stateName, 15, 25);
      doc.text('District Name :- ' + distname, 15, 32);
      doc.text('Hospital Name :- ' + hospitalname, 15, 39);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 46);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 53);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 58,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_Authentication_Mapping.pdf');
    }
  }

}
