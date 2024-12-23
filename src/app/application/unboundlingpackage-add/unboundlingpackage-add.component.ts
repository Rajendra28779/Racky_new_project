import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from './../header.service';
import { SnoCLaimDetailsService } from './../Services/sno-claim-details.service';
import { HospitalPackageMappingService } from './../Services/hospital-package-mapping.service';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DynamicreportService } from '../Services/dynamicreport.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-unboundlingpackage-add',
  templateUrl: './unboundlingpackage-add.component.html',
  styleUrls: ['./unboundlingpackage-add.component.scss']
})
export class UnboundlingpackageAddComponent implements OnInit {
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
  maxChars:any=1000;
  id:any;
  status: any;
  selectedItems:any=[];

  constructor(
    public headerService: HeaderService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private hospitalService: HospitalPackageMappingService,
    private service:DynamicreportService,
    private sessionService: SessionStorageService) {this.id = this.route.getCurrentNavigation().extras.state; }

  ngOnInit(): void {
    this.headerService.setTitle("Unbundling Package Master");
    this.user = this.sessionService.decryptSessionData("user");
    this.getPackageHeader();

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'procedureCode',
      textField: 'procedureDescription',
      itemsShowLimit: 1,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };

    if(this.id){
      this.service.getunboundingbyid(this.id.id).subscribe((data: any) => {
        this.getbyid = data;
        this.status=this.getbyid.status;
        this.packagearray(this.getbyid);
        this.isUpdateBtnInVisible=false
      });
    }
  }

  package1:any;
    packagearray(data:any){
    if(data.packagecode!=null){
      let list=data.specialitycode.split(',');
      this.package1=data.packagecode.split(',');
      this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
            this.packageHeaderItem = data;
          for (var x = 0; x < list.length; x++) {
            this.procedure = list[x];
            for(let i=0;i<this.packageHeaderItem.length;i++){
              if(this.packageHeaderItem[i].packageheadercode==this.procedure){
                this.procedureName=this.packageHeaderItem[i].packageheadername
              }
            }
            this.getpackagefromstring(this.procedure,this.procedureName);
          }
    });
      this.procedure='';
      this.procedureName='';
    }
  }

  getpackagefromstring(procedureCode,procedureName){
    this.snoService.getPackageName(procedureCode).subscribe(
      (response:any) => {
        if (response.status == 'success') {
          let data = JSON.parse(response.data);
          let packageList = data.packageArray;
            for(let k=0;k<packageList.length;k++){
              for(let j=0;j<this.package1.length;j++){
                if(packageList[k].procedureCode==this.package1[j]){
                this.Obj = {
                  specCode: "",
                  specName: "",
                  procCode: "",
                  procName: ""
                }
                this.Obj.specCode = procedureCode;
                this.Obj.specName = procedureName;
                this.Obj.procCode = packageList[k].procedureCode;
                this.Obj.procName = packageList[k].procedureDescription;
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
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

getbyid ={
  unboundlingid:"",
  packagename:"",
  specialitycode:"",
  packagecode:"",
  status:"",
  updatedBy:"",
}

  getPackageHeader() {
    this.hospitalService.getallPackageHeaders().subscribe((data: any) => {
      // console.log(data);
      this.packageHeaderItem = data;
    });
  }


  getPackageName(data) {
    this.package = '';
    let procedureCode = data;
    this.snoService.getPackageName(procedureCode).subscribe(
      (response) => {
        // console.log(response);
        this.packageResponseData = response;
        if (this.packageResponseData.status == 'success') {
          let data = JSON.parse(this.packageResponseData.data);
          this.packageList = data.packageArray;
          // console.log(data);
        } else {
          this.swal('Error', 'Something went wrong.', 'error');
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
    this.procedure = item.packageheadercode;
    this.getPackageName(this.procedure);
    this.procedureName = item.packageheadername;
  }

  clearEvent() {
    this.selectedItems=[];
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
      specCode: "",
      specName: "",
      procCode: "",
      procName: ""
    }
    this.Obj.specCode = this.procedure;
    this.Obj.specName = this.procedureName;
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
    // console.log(list);
    for (var x = 0; x < list.length; x++) {
      let item = list[x];
      this.Obj = {
        specCode: "",
        specName: "",
        procCode: "",
        procName: ""
      }
      this.Obj.specCode = this.procedure;
      this.Obj.specName = this.procedureName;
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
    this.route.navigate(['application/packgaeunbundlingmasterview']);
  }

  yes($event: any) {
    this.status = 0;
  }

  no($event: any) {
    this.status = 1;
  }

  hosplisttostring(hospList:any=[],no:any){
    let hospital="";
      if(hospList.length==0){
        hospital="";
      }else{
        if(no==1){
          for(let i=0;i<hospList.length;i++){
            hospital=hospital+hospList[i].procCode+","
          }
        }else{
          for(let i=0;i<hospList.length;i++){
            hospital=hospital+hospList[i]+","
          }
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
listpackage(hospList:any){
  let list=[]
  for(let i=0;i<hospList.length;i++){
   let p=hospList[i].specCode;
    var stat: boolean = false;
      for (const i of list) {
        if (i == p) {
          stat = true;
        }
      }
      if (stat == false) {
        list.push(p);
      }
  }
  // console.log(list);
  return list;
}

  SubmitCreate(){
    let neme=$('#packagename').val();
    let listpackage=this.listpackage(this.hospList);
    let packagelist=this.hosplisttostring(this.hospList,1);
    let spelist=this.hosplisttostring(listpackage,2);

    if(neme == null|| neme=="" || neme==undefined){
      this.swal("Info", "Please Enter Unbundling Package Name", 'info');
      return;
    }
    if(spelist==""){
      this.swal("Info", "Please Select Speciality Code", 'info');
      return;
    }
    if(this.hospList.length==0){
      this.swal("Info", "Please Select At least one Package Code", 'info');
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
          packagename:neme,
          packagecode:packagelist,
          specialitycode:spelist,
          createdBy:this.user.userId
        }
        this.service.SubmitunboundlingConfiguration(object).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#packagename').val('');
            this.hospList=[];
            this.route.navigate(['application/packgaeunbundlingmasterview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });

  }

  updategroup(){
    let packagelist=this.hosplisttostring(this.hospList,1);
    let listpackage=this.listpackage(this.hospList);
    let spelist=this.hosplisttostring(listpackage,2);
    if(this.getbyid.packagename == null|| this.getbyid.packagename=="" || this.getbyid.packagename==undefined){
      this.swal("Info", "Please Enter Report Name", 'info');
      return;
    }
    if(spelist==""){
      this.swal("Info", "Please Select Speciality Code", 'info');
      return;
    }
    if(this.hospList.length==0){
      this.swal("Info", "Please Select At least one Package Code", 'info');
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
        this.getbyid.specialitycode=spelist;
        this.service.updateunboundingConfiguration(this.getbyid).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, 'success');
            $('#packagename').val('');
            this.route.navigate(['application/packgaeunbundlingmasterview']);
          }else{
            this.swal("Error", data.message, 'error');
          }
        });
      }
    });

  }

}
