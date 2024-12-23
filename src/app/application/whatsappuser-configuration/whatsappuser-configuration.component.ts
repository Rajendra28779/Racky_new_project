import { Component, OnInit } from '@angular/core';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { WhatsappuserconfigurationServiceService } from 'src/app/services/whatsappuserconfiguration-service.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminconsoleService } from '../Services/adminconsole.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-whatsappuser-configuration',
  templateUrl: './whatsappuser-configuration.component.html',
  styleUrls: ['./whatsappuser-configuration.component.scss']
})
export class WhatsappuserConfigurationComponent implements OnInit {
  user:any;
  // showupdate: boolean;
  childmessage: any;
 list: any;
 user1: any;
 public userList: any = [];
 placeHolder = "Select Group Name";
 distPlaceHolder: "Select User Name";
 distList: any;
 selectedDists: any = [];
 templateId:any;
 groupID:any;
 USERID:any
  keyword: any = 'templateName';
 showdc:any=false;
 public settingcdmo: any;
 public settingDist: any;

 templetid:any="";
 temletname:any="";
 templetdesc:any="";


 groupList: any = [];
 group = new FormGroup({
 templateId: new FormControl(''),
});
getbyid = {
 templateid: '',
 userid: '',
};
  constructor(
    private whatsappuserconfigurationservice: WhatsappuserconfigurationServiceService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private adminService: AdminconsoleService,
    private encryptionService: EncryptionService,
    private route:Router)
    {this.user1 = this.route.getCurrentNavigation().extras.state;
    }

  ngOnInit(): void {
    this.headerService.setTitle('Whatsapp User Configuration');
    this.user =  this.sessionService.decryptSessionData("user");
    this.gllist();
    this.getGroupList();

    this.settingcdmo = {
      singleSelection: false,
      idField: 'typeId',
      textField: 'groupTypeName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };
    this.settingDist = {
      singleSelection: false,
      idField: 'USERID',
      textField: 'FULL_NAME',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

  }

  gllist() {
    this.whatsappuserconfigurationservice.getgllist().subscribe((data) => {
      this.list = data;
      // console.log(this.list)
    });
  }

  selectEvent(item:any){
    this.showdc=true;
    this.temletname=item.templateName;
    this.templetdesc=item.templatebody;
    this.templetid=item.templateId;
  }
  clearEvent(){
    this.showdc=false;
    this.temletname="";
    this.templetdesc="";
    this.templetid="";
  }

  getGroupList() {
    this.adminService.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    );
  }
  selectedStateList: any = [];


  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }
  grouplist:any=[];
  onItemSelect(item:any){
    let stat:boolean = false;
    for (const i of this.grouplist) {
      if(i==item.typeId) {
        stat=true;
      }
    }

    if(!stat) {
      this.grouplist.push(item.typeId);
    }
    this.getuserlist();
  }

  getResponseFromUtil(parentData: any) {
    this.childmessage = parentData;
  }

  onSelectAll(list:any){
    for(const item of list) {
      let stat:boolean = false;
    for (const i of this.grouplist) {
      if(i==item.typeId) {
        stat=true;
      }
    }

    if(!stat) {
      this.grouplist.push(item.typeId);
    }
    }
    this.getuserlist();
  }
  onDeSelectAll(item:any){
    this.grouplist=[];
    this.userList=[];
    this.getuserlist();
  }

  onItemDeSelect(item:any){
    for(const element of this.grouplist) {
      if(item.typeId==element) {
        let index = this.grouplist.indexOf(element);
        if (index !== -1) {
          this.grouplist.splice(index, 1);
        }
      }
    }
    this.userList=[];
    this.getuserlist();
  }

  getgroup(item){
    let grp="";
    for(let i of item){
      grp+=i+",";
    }
    return grp;
  }
  resDistData: any;
  getuserlist(){
    let grouplist=this.getgroup(this.grouplist);
    this.whatsappuserconfigurationservice.getUserNamebyGroupId(grouplist)
    .subscribe((data) => {
      this.userList = data;
    });
  }

  selectuserlist:any=[];
  onDistSelect(item) {
    let stat:boolean = false;
    for (const i of this.selectuserlist) {
      if(i==item.USERID) {
        stat=true;
      }
    }
    if(!stat) {
      this.selectuserlist.push(item.USERID);
    }
  }
  onDistDeSelect(item) {
    for (let i = 0; i < this.selectuserlist.length; i++) {
      if (item.USERID == this.selectuserlist[i]) {
        let index = this.selectuserlist.indexOf(this.selectuserlist[i]);
        if (index !== -1) {
          this.selectuserlist.splice(index, 1);
        }
      }
    }
  }
  onSelectAllDist(list) {
    for(let item of list){
      let stat:boolean = false;
      for (const i of this.selectuserlist) {
        if(i==item.USERID) {
          stat=true;
        }
      }
      if(!stat) {
        this.selectuserlist.push(item.USERID);
      }
    }
  }

  onDeSelectAllDist(item:any){
    this.selectuserlist=[];
  }
  save(){
    // let templateid = $("#global").val().toString();
    let userid=this.getgroup(this.selectuserlist);
    let group=this.getgroup(this.grouplist);

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          "templateId": this.templetid,
          "groupid":group,
          "userid":userid,
         "createdby":this.user.userId,
        }
        this.whatsappuserconfigurationservice.savewhatsappconfigname(object).subscribe(
          (response:any) => {
            if(response.status == 200) {
              this.swal("Successful", "User Configured Successfully", 'success');
              this.route.navigate(['/application/whatsappuserconfigurationview']);
          }else if(response.status ==401){
          this.swal("Error", response.message , 'error');
          }else{
            this.swal("Error", response.message, 'error');
          }
        });
      }
    });

  }
  ResetField() {
    window.location.reload();
  }
}
