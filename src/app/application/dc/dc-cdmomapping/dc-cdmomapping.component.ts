import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-dc-cdmomapping',
  templateUrl: './dc-cdmomapping.component.html',
  styleUrls: ['./dc-cdmomapping.component.scss']
})
export class DcCdmomappingComponent implements OnInit {
  dcUserId:any='';
  dcList:any=[];
  cdmoList:any=[];
  user:any;
  keyword: any = 'fullName';
  keyword1: any = 'fullName';
  dc:any
  cdmoUserId:any='';
  cdmoname:any="";
  showdc:any=false;
  public settingcdmo: any;
  placeHolder = "Select CDMO Name";
  dcid:any;
  isedit:any=false;
  public stateList: any = [];
  public districtList: any = [];
  updaterecord
  state: any="";
  district: any="";
  @ViewChild('auto') auto;
  group:any="";

  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,private snoService: SnocreateserviceService,
    private route:Router) {
      this.dcid = this.route.getCurrentNavigation().extras.state;
     }

  ngOnInit(): void {
    this.headerService.setTitle('DC CDMO Mapping');
    this.user =  this.sessionService.decryptSessionData("user");
    // this.getuserDetailsbygroup(6);

    if(this.dcid){
      this.isedit=true;
      this.dcUserId=this.dcid.user;
      this.group=this.dcid.groupid
      this.getuserDetailsbygroup(this.group);
      this.getmapdetails(this.dcUserId);
      // this.dcService.getdccdmomaplist(this.dcUserId).subscribe(
      //   (response:any) => {
      //     if(response.status==200){
      //       let data=response.data;
      //         this.cdmoUserId=data[0].cdmouserid;
      //         this.cdmoname=data[0].cdmoname;
      //         this.state=data[0].statecode;
      //         this.OnChangeState(this.state);
      //         this.district=data[0].districtcode;
      //     }else{
      //       this.swal("Error", "Something Went Wrong", 'error');
      //     }
      //   },
      //   (error) => console.log(error)
      // );
    }

    this.settingcdmo = {
      singleSelection: false,
      idField: 'userId',
      textField: 'fullName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 0,
      allowSearchFilter: true,
    };
  }

  getuserDetailsbygroup(groupid:any) {
    this.dcService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.dcList = response.data;
        if(this.dcid){
          for( let element of this.dcList){
            if(element.userId==this.dcUserId){
              this.selectEvent(element);
            }
          }
        }
      },
      (error) => console.log(error)
    )
  }

  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dc=item;
    this.showdc=true;
    this.dcService.getuserDetailsbygroup(12).subscribe(
      (response:any) => {
        this.cdmoList = response.data;
      },
      (error) => console.log(error)
    )
    this.getStateList();
  }

  clearEvent() {
    this.dcUserId = '';
    this.showdc=false;
    this.selectcdmolist=[];
  }

  selectEvent1(item){
    this.cdmoUserId=item.userId;
    this.cdmoname=item.fullName;
  }

  clearEvent1(){
    this.cdmoUserId='';
    this.cdmoname="All";
  }

  getmapdetails(dcid:any){
    this.dcService.getmapingbydcid(dcid).subscribe(
      (response:any) => {
        if(response.status==200){
          let data=response.data;
          this.state=data[0].statecode;
          this.OnChangeState(this.state);
          this.district=data[0].districtcode;
          for(let element of data){
            this.hospObj={
              stateName:element.stateName,
              districtName:element.districtName,
              cdmoname:element.fullName,
              cdmoid:element.userId
            }
            this.selectcdmolist.push(this.hospObj);
          }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    )
  }

  hospObj:any;
  selectcdmolist:any=[];
  onItemSelect(item:any){
    this.hospObj={
      stateName:'',
      districtName:'',
      cdmoname:item.fullName,
      cdmoid:item.userId
    }

    for(const item of this.cdmoList) {
      if(item.userId==this.hospObj.cdmoid){
        this.hospObj.stateName=item.stateName;
        this.hospObj.districtName=item.districtName;
      }
    }

    let stat:boolean = false;
    for (const i of this.selectcdmolist) {
      if(i.cdmoid==this.hospObj.cdmoid) {
        stat=true;
      }
    }

    if(!stat) {
      this.selectcdmolist.push(this.hospObj);
    }
  }

  onItemDeSelect(item:any){
    for(const element of this.selectcdmolist) {
      if(item.userId==element.cdmoid) {
        let index = this.selectcdmolist.indexOf(element);
        if (index !== -1) {
          this.selectcdmolist.splice(index, 1);
        }
      }
    }
  }

  onSelectAll(list:any){
    for(const element of list) {
      this.onItemSelect(element);
    }
  }

  onDeSelectAll(item:any){
    this.selectcdmolist=[];
  }

  remove(item) {
    for(const element of this.selectcdmolist) {
      if(item.cdmoid==element.cdmoid) {
        let index = this.selectcdmolist.indexOf(element);
        if (index !== -1) {
          this.selectcdmolist.splice(index, 1);
        }
      }
    }
  }

  onReset(){
    window.location.reload();
  }
  cancel(){
    this.clearEvent();
    this.route.navigate(['/application/dccdmomappingview']);
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getcdmoid(list:any){
  let s=""
    for(let i of list){
      s=s+i.cdmoid+",";
    }
    return s;
  }

  submit(){
      if(this.dcUserId==null || this.dcUserId=="" || this.dcUserId==undefined){
        this.swal("Info", "Please select DC Name", 'info');
        return;
      }
      let cdmo=this.getcdmoid(this.selectcdmolist);
      if(this.selectcdmolist.length==0){
        this.swal("Info", "Please select CDMO Name", 'info');
        return;
      }
      // let cdmo=this.cdmoUserId;
      // if(cdmo==null || cdmo==''|| cdmo==undefined){
      //   this.swal("Info", "Please select CDMO Name", 'info');
      //   return;
      // }

      let statecode = $('#stateId').val();
      if(statecode==null || statecode==""|| statecode==undefined){
        this.swal("Info", "Please select State Name", 'info');
        return;
      }
      let distcode = $('#districtId').val();
      if(distcode==null || distcode==""|| distcode==undefined){
        this.swal("Info", "Please select District Name", 'info');
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
            "dcUserId":this.dcUserId,
            "cdmoid":cdmo,
            "statecode":statecode,
            "distcode":distcode,
            "createdby":this.user.userId,
          }
          this.dcService.saveDcCdmomapping(object).subscribe(
            (response:any) => {
              if(response.status == 200) {
                this.swal("Successful", "DC Tagged to CDMO Successfully", 'success');
                this.route.navigate(['/application/dccdmomappingview']);
            }else if(response.status ==401){
            this.swal("Error", "DC Already Tagged To CDMO", 'error');
            }else{
              this.swal("Error", "Something Went Wrong.", 'error');
            }
          });
        }
      });
  }

  updateDcDetails(){
    if(this.dcUserId==null || this.dcUserId=="" || this.dcUserId==undefined){
      this.swal("Info", "Please select DC Name", 'info');
      return;
    }
    let cdmo=this.getcdmoid(this.selectcdmolist);
    if(this.selectcdmolist.length==0){
      this.swal("Info", "Please select CDMO Name", 'info');
      return;
    }
    // let cdmo=this.cdmoUserId;
    // if(cdmo==null || cdmo==''|| cdmo==undefined){
    //   this.swal("Info", "Please select CDMO Name", 'info');
    //   return;
    // }

    let statecode = $('#stateId').val();
    if(statecode==null || statecode==""|| statecode==undefined){
      this.swal("Info", "Please select State Name", 'info');
      return;
    }
    let distcode = $('#districtId').val();
    if(distcode==null || distcode==""|| distcode==undefined){
      this.swal("Info", "Please select District Name", 'info');
      return;
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Update This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object={
          "dcUserId":this.dcUserId,
          "cdmoid":cdmo,
          "statecode":statecode,
          "distcode":distcode,
          "createdby":this.user.userId,
        }
        this.dcService.updateDcCdmomapping(object).subscribe(
          (response:any) => {
            if(response.status == 200) {
              this.swal("Successful", "DC Tagged to CDMO Successfully", 'success');
              this.route.navigate(['/application/dccdmomappingview']);
          }else{
            this.swal("Error", "Something Went Wrong", 'error');
          }
        });
      }
    });
  }

}
