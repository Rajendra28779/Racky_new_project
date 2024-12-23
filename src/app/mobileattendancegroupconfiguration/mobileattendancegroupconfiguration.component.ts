import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { DcCdmomappingService } from '../application/Services/dc-cdmomapping.service';
import { UsercreateService } from '../application/Services/usercreate.service';
import { EncryptionService } from '../services/encryption.service';
import { SessionStorageService } from '../services/session-storage.service';

@Component({
  selector: 'app-mobileattendancegroupconfiguration',
  templateUrl: './mobileattendancegroupconfiguration.component.html',
  styleUrls: ['./mobileattendancegroupconfiguration.component.scss']
})
export class MobileattendancegroupconfigurationComponent implements OnInit {
  groupList:any=[];
  user:any;
  txtsearchDate:any

  constructor(private route: Router,
    public headerService: HeaderService,
    private userService: UsercreateService,
    private encryptionService: EncryptionService,
    private sessionService: SessionStorageService,
    private dcService: DcCdmomappingService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle('Mobile Group Attendance Configuration');
    this.getGroupList();
  }

  getGroupList() {
    this.dcService.getconfigGroupList().subscribe(
      (response: any) => {
        this.groupList = response.data;
      },
      (error) => console.log(error)
    )
  }

  selecteditemlist:any=[]
  selectitem(item:any){
    console.log(item);
    for(let element of this.groupList){
      if(element.typeId==item.typeId){
        element.tempstatus=element.status==0?1:0
      }
    }
    let obj={
      createby:this.user.userId,
      groupid:item.typeId,
      attendancestatus:item.status==0?1:0
    }

    let stat: boolean = false;
    for (const i of this.selecteditemlist) {
      if (i.groupid == item.typeId) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selecteditemlist.push(obj);
    }else{
      for (const element of this.selecteditemlist) {
        if (item.typeId == element.groupid) {
          let index = this.selecteditemlist.indexOf(element);
          if (index !== -1) {
            this.selecteditemlist.splice(index, 1);
          }
        }
      }
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  Submit(){
    if(this.selecteditemlist.length==0){
      this.swal("Info","Please select Atleast one Group","info")
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
          this.dcService.savegroupmobilemast(object).subscribe((data:any)=>{
            if(data.status==200){
              this.swal("Success","Mobile Configuration Successfully","success");
              this.resetVal();
            }else{
              this.swal("Error","Something Went Wrong","error");
            }
          });
      }
    });
  }

  resetVal(){
    this.selecteditemlist=[];
    this.groupList=[];
    this.getGroupList();
  }

}
