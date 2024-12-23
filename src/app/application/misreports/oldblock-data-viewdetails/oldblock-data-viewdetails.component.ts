import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { OldBlockDataService } from '../../Services/old-block-data.service';

@Component({
  selector: 'app-oldblock-data-viewdetails',
  templateUrl: './oldblock-data-viewdetails.component.html',
  styleUrls: ['./oldblock-data-viewdetails.component.scss']
})
export class OldblockDataViewdetailsComponent implements OnInit {
  txnid:any;
  result:any;

  constructor(private oldblocksrv:OldBlockDataService) { }

  ngOnInit(): void {
    this.txnid=localStorage.getItem("txnid");
    this.getdata()
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getdata(){
    this.oldblocksrv.getoldblockdataviewdetails(this.txnid).subscribe((data:any)=>{
      console.log(data);
      if(data.status==200){
        this.result=data.data;
      }else{
        console.log(data);
        this.swal('Error','Something Went Wrong','error')
      }
    },
    (error) =>
    this.swal('Error','Something Went Wrong','error')
    );
  }

}
