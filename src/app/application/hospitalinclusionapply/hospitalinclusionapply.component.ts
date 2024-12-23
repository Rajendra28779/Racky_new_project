import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { ConfigurationService } from '../Services/configuration.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-hospitalinclusionapply',
  templateUrl: './hospitalinclusionapply.component.html',
  styleUrls: ['./hospitalinclusionapply.component.scss']
})
export class HospitalinclusionapplyComponent implements OnInit {

  list:any=[];
  txtsearchDate:any;
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount:any=0;
  districtList:any=[];
  stateList:any=[];
  user:any;
  state:any="";
  dist:any="";

  constructor(private snoService: SnocreateserviceService,public headerService: HeaderService,public config:ConfigurationService,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("CPD Configuration Apply");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.sabmit();
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

  sabmit(){
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.config.gethospitalforinclusion(this.user.userId,this.state,this.dist).subscribe((data:any)=>{
      console.log(data);
      this.list=data;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true;
        this.currentPage=1;
        this.pageElement=100;
      }else{
        this.showPegi=false;
      }
    },
    (error) => console.log(error));
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  onaction(item:any){
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want Apply For Inclusion !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Save it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.config.applyhospitalforinclusion(this.user.userId,item.hospitalCode).subscribe((data:any)=>{
          if(data.status==200){
            this.swal("Success", data.message, "success");
            this.sabmit();
          }else{
            this.swal("Error", data.message, "error");
          }
        },
          (error) => console.log(error)
          );      }
    });
  }
  onreset(){
    $('#stateId').val('');
    $('#districtId').val('');
    this.sabmit();
  }

}
