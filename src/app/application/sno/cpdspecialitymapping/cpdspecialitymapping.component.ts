import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { ConfigurationService } from '../../Services/configuration.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-cpdspecialitymapping',
  templateUrl: './cpdspecialitymapping.component.html',
  styleUrls: ['./cpdspecialitymapping.component.scss']
})
export class CpdspecialitymappingComponent implements OnInit {
  user:any
  cpdId:any="";
  cpdname:any="All";
  cpduserid:any="";
  cpdList:any=[];
  keyword: any = 'fullName';
  packageHeaderItem:any=[];
  showpackage:boolean=false;
  datademo:any;
  iscpd:boolean=false;

  constructor(public headerService: HeaderService,
    public config:ConfigurationService,
    private snoService: SnocreateserviceService,
     public route: Router,
     private sesonservice:SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('CPD Specialty Mapping');
    this.user = this.sesonservice.decryptSessionData("user");
    if(this.user.groupId==3){
      this.cpdname=this.user.fullName;
      this.cpduserid=this.user.userId;
      this.getpackagelist();
      this.showpackage=true;
      this.iscpd=true;
    }else{
      this.iscpd=false;
      this.getCPDList();
    }
  }

  getCPDList() {
    this.snoService.getCPDList().subscribe(
      (response) => {
        this.cpdList = response;
      })
  }

  selectEvent(item) {
    this.cpdId = item.bskyUserId;
    this.cpdname=item.fullName;
    this.cpduserid=item.userid;
    this.getpackagelist();
    this.showpackage=true;
  }

  clearEvent() {
    this.cpdId ='';
    this.cpdname="All";
    this.cpduserid='';
    this.showpackage=false;
    this.packageHeaderItem=[];
    this.dataIdArray=[];
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getpackagelist(){
    this.config.getPackageList(this.cpdId,this.cpduserid).subscribe((response:any) => {
        if(response.status==200){
           this.packageHeaderItem=response.data;
        }else{
          this.swal("Error","Something Went Wrong","error")
        }
      });
  }

  dataIdArray:any = [];
  checkAllCheckBox(event: any) {
    if (event.target.checked) {
      for (let i = 0; i < this.packageHeaderItem.length; i++) {
        $('#' + this.packageHeaderItem[i].packageid).prop('checked', true);
        // this.getedataarray(this.packageHeaderItem[i].packageid);
      }
    } else {
      for (let i = 0; i < this.packageHeaderItem.length; i++) {
        $('#' + this.packageHeaderItem[i].packageid).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }

  tdCheck(event: any, packageid,status:any) {
    for(let data of this.packageHeaderItem){
      if(data.packageid==packageid){
        data.docstatus=data.docstatus==0?1:0;
      }
    }
    this.getedataarray(packageid,status);
  }


  getedataarray(pkgid:any,status:any){
    for(let i=0;i<this.packageHeaderItem.length;i++){
      if(this.packageHeaderItem[i].packageid==pkgid){
        this.datademo={
          packageid:"",
          packagename:"",
          document:"",
          doc:0,
          status:this.packageHeaderItem[i].status==0?1:0
        }
        this.datademo.packageid=this.packageHeaderItem[i].packageid;
        this.datademo.packagename=this.packageHeaderItem[i].packagecode;
      }
    }
    let stat = false;
    for (const i of this.dataIdArray) {
      if (i.packageid == this.datademo.packageid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.dataIdArray.push(this.datademo);
    }else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i].packageid == pkgid) {
          $('#d' + pkgid).val('');
          this.dataIdArray.splice(i, 1);
        }
      }
    }
  }

  fileToUpload2:any;
  handleFileInput(event: any,pkgid:any,status:any) {
    this.fileToUpload2 = event.target.files[0];
    if (this.fileToUpload2 != null || this.fileToUpload2 != undefined) {
      let extension = this.fileToUpload2.name.split('.').pop();
      let allowedExtensions = /^(pdf|jpg|jpeg)$/i;
      if (!allowedExtensions.exec(extension)){
        this.swal("Warning", "Only .pdf, .jpg, .jpeg File Are Allowed!","warning");
        $('#d' + pkgid).val('');
        this.fileToUpload2="";
        return;
      }
      if (Math.round(this.fileToUpload2.size / 1024) >= 5120) {
        this.swal('Warning', ' Please Provide Document Size Less than 5MB', 'warning');
        $('#d' + pkgid).val('');
        this.fileToUpload2="";
      } else {
        this.fileToUpload2 = event.target.files[0];
        let stat=false;
        for(let i=0;i<this.dataIdArray.length;i++){
          if(this.dataIdArray[i].packageid==pkgid){
            stat=true;
            this.dataIdArray[i].document=this.fileToUpload2;
            this.dataIdArray[i].doc=1;
          }
        }
        if(!stat){
          if(status==0){
            for(let i=0;i<this.packageHeaderItem.length;i++){
              if(this.packageHeaderItem[i].packageid==pkgid){
                this.datademo={
                  packageid:"",
                  packagename:"",
                  document:"",
                  doc:0,
                  status:this.packageHeaderItem[i].status
                }
                this.datademo.packageid=this.packageHeaderItem[i].packageid;
                this.datademo.packagename=this.packageHeaderItem[i].packagecode;
                this.datademo.document=this.fileToUpload2;
                this.datademo.doc=1;
                // this.packageHeaderItem[i].document=null;
                this.dataIdArray.push(this.datademo);
              }
            }
          }else{
            $('#d' + pkgid).val('');
            this.swal('Warning', ' Before Upload Document Please Select The Row !', 'warning');
          }
        }
      }
    }
  }

  submit(){
    console.log(this.dataIdArray);

    if(this.dataIdArray.length==0){
      this.swal('Warning', 'Please Select Atleast One Speciality', 'warning');
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
            speciality:this.dataIdArray,
            cpdId:this.cpduserid,
            userId:this.user.userId
          }
          this.config.saveCPDSpecialityMapping(object).subscribe(
            (response:any) => {
              if(response.status==200){
                this.swal('Success', response.message,'success');
                this.dataIdArray=[];
                this.showpackage=false;
                this.getpackagelist();
                this.showpackage=true;
                this.route.navigate(['/application/cpdspecialitymappingview']);
              }else{
                this.swal('Error', response.message, 'error');
              }
            });
      }
    });
  }

  documentType: any;
  downloaddoc(pkgid:any){
    let fileToUpload;
    for(let i=0;i<this.dataIdArray.length;i++){
      if(this.dataIdArray[i].packageid==pkgid){
        fileToUpload=this.dataIdArray[i].document;
      }
    }
    if (fileToUpload) {
      const file: File | null = fileToUpload;
      if (file) {
        this.documentType = file.type;
        const blob = new Blob([file], { type: this.documentType });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }
  downloaddocument(fileName:any){
    if (fileName != null && fileName != '' && fileName != undefined) {
      let img = this.config.downloadcpdspecdoc(fileName,this.cpduserid);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'Please Select File', 'info');
    }
  }
}
