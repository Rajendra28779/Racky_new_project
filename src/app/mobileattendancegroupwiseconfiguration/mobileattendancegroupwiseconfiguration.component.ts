import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { AdminconsoleService } from '../application/Services/adminconsole.service';
import { DcCdmomappingService } from '../application/Services/dc-cdmomapping.service';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-mobileattendancegroupwiseconfiguration',
  templateUrl: './mobileattendancegroupwiseconfiguration.component.html',
  styleUrls: ['./mobileattendancegroupwiseconfiguration.component.scss']
})
export class MobileattendancegroupwiseconfigurationComponent implements OnInit {
  user:any;
  groupList:any;
  configgrouplist:any=[];
  selecteditemlist:any=[];

  constructor(private route: Router,
    public headerService: HeaderService,
    private adminService: AdminconsoleService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService,
    private dcService: DcCdmomappingService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('User Mobile Attendance Configuration');
    this.getGroupList();
    this.getconfiggroupalldata();
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

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onchangegroup(group:any){
    this.selecteditemlist=[];
    this.getconfiggroupalldata();
  }

  selectitem(item:any){
    let group = $('#groupId').val();
    if (group == null || group == "" || group == undefined) {
      this.swal("Warning", "Please Select GroupType", 'info');
      return;
    }

    for(let element of this.configgrouplist){
      if(element.groupid==item.groupid){
        element.tempstatus=element.status==0?1:0
      }
    }
    let obj={
      userid:group,
      createby:this.user.userId,
      groupid:item.groupid,
      statusflag:item.status==0?1:0
    }

    let stat: boolean = false;
    for (const i of this.selecteditemlist) {
      if (i.groupid == item.groupid) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selecteditemlist.push(obj);
    }else{
      for (const element of this.selecteditemlist) {
        if (item.groupid == element.groupid) {
          let index = this.selecteditemlist.indexOf(element);
          if (index !== -1) {
            this.selecteditemlist.splice(index, 1);
          }
        }
      }
    }
  }

  getconfiggroupalldata(){
    this.dcService.getconfiggroupalldata().subscribe((data:any) => {
      if(data.status==200){
        this.configgrouplist=data.data;
      } else {
        this.swal('Error','Something Went Wrong','error');
      }
    });
  }

  Submit(){
    let group = $('#groupId').val();
    if (group == null || group == "" || group == undefined) {
      this.swal("Warning", "Please Select GroupType", 'info');
      return;
    }

    if(this.selecteditemlist.length==0){
      this.swal("Info","Please select Atleast one","info")
      return;
    }

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
            selectedlist:this.selecteditemlist,
          }
          this.dcService.savegroupwisemobileconfig(object).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success","Mobile User Attendance Configuration Successfully","success");
              this.resetVal();
            }else{
              this.swal("Error","Something Went Wrong","error");
            }
          });
      }
    });

  }

  resetVal(){
    $('#groupId').val('');
    this.selecteditemlist=[];
    this.getconfiggroupalldata();
  }
}
