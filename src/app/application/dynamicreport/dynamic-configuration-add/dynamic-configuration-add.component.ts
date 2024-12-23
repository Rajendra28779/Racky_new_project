import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SnoCLaimDetailsService } from '../../Services/sno-claim-details.service';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DynamicreportService } from '../../Services/dynamicreport.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-dynamic-configuration-add',
  templateUrl: './dynamic-configuration-add.component.html',
  styleUrls: ['./dynamic-configuration-add.component.scss']
})
export class DynamicConfigurationAddComponent implements OnInit {
  isUpdateBtnInVisible:any=true;
  keyword: string = 'packageheadername';
  keyword1: string = 'procedureDescription';
  packageHeaderItem: any = [];
  packageResponseData: any;
  packageList: any = [];
  package: any;
  packageName: any;
  procedureName: string;
  procedure: string;
  placeHolder = "Select Package Code";
  dropdownSettings: IDropdownSettings = {};
  Obj:any;
  hospList:any=[];
  user:any;
  maxChars:any=500;
  id:any;
  status: any;
  selectedItems:any=[];

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService, private sessionService: SessionStorageService,
    private service:DynamicreportService) {this.id = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.headerService.setTitle("Dynamic Configuration Report");
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeader();
    this.getnolist();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'procedureCode',
      textField: 'procedureDescription',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };

    if(this.id){
      this.service.getdynamicbyid(this.id.id).subscribe((data: any) => {
        this.getbyid = data;
        this.status=this.getbyid.status;
        if(this.getbyid.agecondition==null){
          this.getbyid.agecondition="";
        }
        this.packagelist(this.getbyid);
        this.isUpdateBtnInVisible=false
      });
    }
  }

  packagelist(item:any){
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
      for(let i=0;i<this.packageHeaderItem.length;i++){
        if(item.specilitycode==this.packageHeaderItem[i].packageheadercode){
          this.procedure = this.packageHeaderItem[i].packageheadercode;
          this.getPackageName(this.procedure);
        }
      }
    });
  }

  packagearray(data:any){
    if(data.packagecode!=null){
      let list=data.packagecode.split(',');
      for (var x = 0; x < list.length; x++) {
        let item = list[x];
        this.Obj = {
          procCode: "",
          procName: ""
        }
        // alert(this.packageList.length)
        this.Obj.procCode = item;
        for (var i = 0; i < this.packageList.length; i++) {
          if (this.Obj.procCode == this.packageList[i].procedureCode) {
            this.Obj.procName = this.packageList[i].procedureDescription;
          }
        }
        var stat: boolean = false;
        for (const i of this.hospList) {
          if (i.procCode == this.Obj.procCode) {
            stat = true;
          }
        }
        if (stat == false) {
          this.hospList.push(this.Obj);
        }
      }
    }
  }

getbyid ={
  slno:"",
  packagename:"",
  packagecode:"",
  occuarance:0,
  age:0,
  agecondition:"",
  reportname:"",
  status:"",
  updatedBy:"",
  specilitycode:""
}

nolist:any=[];
  getnolist(){
    for(let i=0;i<=150;i++){
      this.nolist.push(i);
    }
  }

  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      this.packageHeaderItem = data;
    });
  }


  getPackageName(data) {
    this.package = '';
    let procedureCode = data;
    this.snoService.getPackageName(procedureCode).subscribe(
      (response) => {
        this.packageResponseData = response;
        if (this.packageResponseData.status == 'success') {
          let data = JSON.parse(this.packageResponseData.data);
          this.packageList = data.packageArray;
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
        if(this.id){
        this.packagearray(this.getbyid);
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  selectEvent(item) {
    this.selectedItems=[];
    this.hospList=[];
      this.procedure = item.packageheadercode;
    this.getPackageName(this.procedure);
    this.procedureName = item.headername;
  }

  clearEvent() {
    this.selectedItems=[];
    this.hospList=[];
    this.procedure = '';
    this.procedureName = '';
  }


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  onItemSelect(item) {
    this.Obj = {
      procCode: "",
      procName: ""
    }
    this.Obj.procCode = item.procedureCode;
    for (var i = 0; i < this.packageList.length; i++) {
      if (this.Obj.procCode == this.packageList[i].procedureCode) {
        this.Obj.procName = this.packageList[i].procedureDescription;
      }
    }
    var stat: boolean = false;
    for (const i of this.hospList) {
      if (i.procCode == this.Obj.procCode) {
        stat = true;
      }
    }
    if (stat == false) {
      this.hospList.push(this.Obj);
    }
  }

  onSelectAll(list) {
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.Obj = {
        procCode: "",
        procName: ""
      }
      this.Obj.procCode = item.procedureCode;
      for (var i = 0; i < this.packageList.length; i++) {
        if (this.Obj.procCode == this.packageList[i].procedureCode) {
          this.Obj.procName = this.packageList[i].procedureDescription;
        }
      }
      var stat: boolean = false;
      for (const i of this.hospList) {
        if (i.procCode == this.Obj.procCode) {
          stat = true;
        }
      }
      if (stat == false) {
        this.hospList.push(this.Obj);
      }
    }
  }

  onItemDeSelect(item) {
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.procedureCode == this.hospList[i].procCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  remove(item){
    for (var i = 0; i < this.hospList.length; i++) {
      if (item.procCode == this.hospList[i].procCode) {
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

  resetVal(){
    window.location.reload();
  }
  ResetForm(){
    this.route.navigate(['application/dynamicconfigurationview']);
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  hosplisttostring(hospList:any=[]){
    let hospital="";
      if(hospList.length==0){
        hospital="";
      }else{
        for(let i=0;i<hospList.length;i++){
          hospital=hospital+hospList[i].procCode+","
        }
      }
      return hospital;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    //var regex = new RegExp("^[A-Za-z0-9.,-\\s]+$");
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

  SubmitCreate(){
    let occarance=$('#occa').val();
    let age=$('#age').val();
    let condition=$('#condition').val();
    let report=$('#report').val();
    let packagelist=this.hosplisttostring(this.hospList);

    // if(this.procedureName == null|| this.procedureName=="" || this.procedureName==undefined){
    //   this.swal("Info", "Please Select Package Name", 'info');
    //   return;
    // }
    if(report == null|| report=="" || report==undefined){
      this.swal("Info", "Please Enter Report Name", 'info');
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
          packagename:this.procedureName,
          specilitycode:this.procedure,
          packagecode:packagelist,
          occuarance:occarance,
          age:age,
          agecondition:condition,
          reportname:report,
          createdBy:this.user.userId
        }

        this.service.SubmitdunamicConfiguration(object).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#occa').val('');
            $("#age").val('');
            $('#condition').val('');
            $('#report').val('');
            this.route.navigate(['application/dynamicconfigurationview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });

  }

  updategroup(){
    let packagelist=this.hosplisttostring(this.hospList);
    if(this.getbyid.reportname == null|| this.getbyid.reportname=="" || this.getbyid.reportname==undefined){
      this.swal("Info", "Please Enter Report Name", 'info');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Update this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.getbyid.status=this.status;
        this.getbyid.packagecode=packagelist;
        this.getbyid.updatedBy=this.user.userId;
        this.service.updatedunamicConfiguration(this.getbyid).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#occa').val('');
            $("#age").val('');
            $('#condition').val('');
            $('#report').val('');
            this.route.navigate(['application/dynamicconfigurationview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });

  }

}
