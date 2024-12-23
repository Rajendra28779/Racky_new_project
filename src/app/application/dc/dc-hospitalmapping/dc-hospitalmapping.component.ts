import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { DcCdmomappingService } from '../../Services/dc-cdmomapping.service';
import { ReferralService } from '../../Services/referral.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';

@Component({
  selector: 'app-dc-hospitalmapping',
  templateUrl: './dc-hospitalmapping.component.html',
  styleUrls: ['./dc-hospitalmapping.component.scss']
})
export class DcHospitalmappingComponent implements OnInit {
  dcUserId:any='';
  dcList:any=[];
  cdmoList:any=[];
  user:any;
  keyword: any = 'fullName';
  dc:any
  cdmoUserId:any='';
  cdmo:any;
  showdc:any=false;
  public settingcdmo: any;
  placeHolder = "Select Hospital";
  dcid:any;
  isedit:any=false;
  public districtList: any = [];
  public hospitalList: any = [];
  public blocklist: any = [];
  selectedItems:any=[];
  sdistrictcode:any;
  group:any="";
  hosptypelist:any=[];

  @ViewChild('multiSelect') multiSelect;
  constructor(private dcService: DcCdmomappingService,
    private sessionService: SessionStorageService,
    public headerService: HeaderService,
    private userService: ReferralService,
    private snoService: SnocreateserviceService,
    private route:Router) {
      this.dcid = this.route.getCurrentNavigation().extras.state;
     }

  ngOnInit(): void {
    this.headerService.setTitle('DC Referral Hospital Mapping');
    this.user =  this.sessionService.decryptSessionData("user");
    // this.getuserDetailsbygroup(6);
    this.getreferralhospitaltype();

    if(this.dcid){
      this.isedit=true;
      this.dcUserId=this.dcid.user;
      this.group=this.dcid.groupid
      this.getuserDetailsbygroup(this.group);
      this.getmapdetails(this.dcUserId);
    }

    this.settingcdmo = {
      singleSelection: false,
      idField: 'hospitalid',
      textField: 'hospitalname',
      itemsShowLimit: 0,
      allowSearchFilter: true,
      selectAllText: 'Select All',
      unSelectAllText: "Un-Select All",
    };
  }

  getreferralhospitaltype(){
    this.userService.getreferralhospitaltype().subscribe(
      (response) => {
        this.hosptypelist = response;
      },
      (error) => console.log(error)
    )
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

  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dc=item;
    this.showdc=true;
    this.OnChangeState(21);
  }

  clearEvent() {
    this.dcUserId = '';
    this.showdc=false;
    this.hospList=[];
  }

  OnChangeState(id) {
    $("#districtId").val("");
    this.hospitalList = [];
    this.selectedItems = [];
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }


  OnChangeDistrict(id) {
    this.selectedItems = [];
    var stateCode = localStorage.getItem("stateCode");
    this.sdistrictcode=id;
    this.userService.getrefHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )

    this.snoService.getBlockbyDistrictId(id, stateCode).subscribe(
      (response) => {
        this.blocklist = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeblock(id) {
    this.userService.getrefHospitalbyDistrictIdblockid(id, this.sdistrictcode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangehospital(id) {
    this.userService.getrefHospitalbyDistrictIdhospitaltype(id, this.sdistrictcode).subscribe(
      (response) => {
        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }

  getmapdetails(dcid:any){
    this.dcService.getmappedgovthospbydcid(dcid,"").subscribe(
      (response:any) => {
        if(response.status==200){
          let data=response.data;
          for(let element of data){
            this.hospObj={
              stateCode:element.statecode,
              stateName:element.statename,
              districtCode:element.distcode,
              districtName:element.distname,
              blockCode:"",
              blockName:"",
              hospitalCode:element.hospitalid,
              hospitalName:element.hospitalname
            }
            this.hospList.push(this.hospObj);
          }
        }else{
          this.swal("Error", "Something Went Wrong", 'error');
        }
      },
      (error) => console.log(error)
    )
  }

  hospObj: any;
  hospList: any = [];
  onItemSelect(item) {
    this.hospObj={
      stateCode:"",
      stateName:"",
      districtCode:"",
      districtName:"",
      blockCode:"",
      blockName:"",
      hospitalCode:"",
      hospitalName:""
    }
    this.hospObj.stateCode = $('#stateId').val();
    this.hospObj.stateName = "Odisha";
    this.hospObj.districtCode = $('#districtId').val();
    for(var i=0;i<this.districtList.length;i++) {
      if(this.hospObj.districtCode==this.districtList[i].districtcode) {
        this.hospObj.districtName = this.districtList[i].districtname;
      }
    }
    this.hospObj.blockCode = $('#blockId').val();
    for(var i=0;i<this.blocklist.length;i++) {
      if(this.hospObj.blockCode==this.blocklist[i].blockcode) {
        this.hospObj.blockName = this.blocklist[i].blockname;
      }
    }
    this.hospObj.hospitalCode = item.hospitalid;
    for(var i=0;i<this.hospitalList.length;i++) {
      if(this.hospObj.hospitalCode==this.hospitalList[i].hospitalid) {
        this.hospObj.hospitalName = this.hospitalList[i].hospitalname;
      }
    }

    var stat:boolean = false;
    for (const i of this.hospList) {
      if(i.hospitalCode==this.hospObj.hospitalCode) {
        stat=true;
      }
    }
    if(stat==false) {
      this.hospList.push(this.hospObj);
    }
  }

  onSelectAll(list:any[]) {
    for(let element of list) {
      this.onItemSelect(element);
    }
  }

  onItemDeSelect(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalid==this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }
  }

  onDeSelectAll(list) {
    this.hospList=[];
  }

  remove(item) {
    for(var i=0;i<this.hospList.length;i++) {
      if(item.hospitalCode==this.hospList[i].hospitalCode) {
        var index = this.hospList.indexOf(this.hospList[i]);
        if (index !== -1) {
          this.hospList.splice(index, 1);
        }
      }
    }

    for(var i=0;i<this.selectedItems.length;i++) {
      if(item.hospitalCode==this.selectedItems[i].hospitalid) {
        var index = this.selectedItems.indexOf(this.selectedItems[i]);
        if (index !== -1) {
          this.selectedItems.splice(index, 1);
        }
      }
    }
  }

  onReset(){
    window.location.reload();
  }
  cancel(){
    this.clearEvent();
    this.route.navigate(['/application/dcgovthospitalmappingview']);
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
      s=s+i.hospitalCode+",";
    }
    return s;
  }

  submit(){
      if(this.dcUserId==null || this.dcUserId=="" || this.dcUserId==undefined){
        this.swal("Info", "Please select DC Name", 'info');
        return;
      }

      let dist=$('#districtId').val();
      if(dist==null || dist=="" || dist==undefined){
        this.swal("Info", "Please select District", 'info');
        return;
      }

      let hospital=this.getcdmoid(this.hospList);
      if(this.hospList.length==0){
        this.swal("Info", "Please select Hospital Name", 'info');
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
            "hospitalCode":hospital,
            "createdby":this.user.userId,
          }
          this.dcService.saveDcHospitalmapping(object).subscribe(
            (response:any) => {
              if(response.status == 200) {
                this.swal("Successful", "DC Tagged to Hospital Successfully", 'success');
                this.route.navigate(['/application/dcgovthospitalmappingview']);
            }else if(response.status ==401){
            this.swal("Error", "Hospital Already Tagged To DC.", 'error');
            }else{
              this.swal("Error", "Something Went Wrong.", 'error');
            }
          });
        }
      });


  }

  updateDcDetails(){
    if(this.dcUserId==null && this.dcUserId=="" && this.dcUserId==undefined){
      this.swal("Info", "Please select DC Name", 'info');
      return;
    }
    let hospital=this.getcdmoid(this.hospList);

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
          "hospitalCode":hospital,
          "createdby":this.user.userId,
        }
        this.dcService.updateDcHospitalmapping(object).subscribe(
          (response:any) => {
            if(response.status == 200) {
              this.swal("Successful", "DC Tagged to Hospital Successfully", 'success');
              this.route.navigate(['/application/dcgovthospitalmappingview']);
          }else{
            this.swal("Error", "Something Went Wrong", 'error');
          }
        });
      }
    });
  }

}
