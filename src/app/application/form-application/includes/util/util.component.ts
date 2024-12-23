import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as $ from 'jquery';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//import { CommonconfigService } from '../../../services/commonconfig.service';
import { CommonconfigService } from 'src/app/services/form-services/commonconfig.service';
import { EncrypyDecrpyService } from 'src/app/services/form-services/encrypy-decrpy.service';
//import { CommonconfigService } from 'src/app/services/commonconfig.service';
import Swal from 'sweetalert2';
import {Location} from '@angular/common';
import * as CryptoJS from 'crypto-js';
//import { EncrypyDecrpyService } from 'src/app/services/encrypy-decrpy.service';

@Component({
  selector: 'app-util',
  templateUrl: './util.component.html',
  styleUrls: ['./util.component.scss']
})
export class UtilComponent implements OnInit {
  message:any;
  @Input() childMessage:any;
  @Input() sendIds:any;
  @Input() funType:any;

  @Output("callfunction") callfunction:EventEmitter<any> = new EventEmitter();
  @Output("callfunction3") callfunction3:EventEmitter<any> = new EventEmitter();
   @Input() reloadUrl:any;

  constructor(private route: Router,
    private httpClient: HttpClient,
    private commonService: CommonconfigService,
    private _location: Location,
    private encDec:EncrypyDecrpyService ) { }
  
  ngOnInit(): void {



  }
  opensearch(){
    
    $(".search-container").toggleClass("active");
  }

  printTable(){
    let printContents;
    let popupWin:any;
    printContents =  $(".print-section").html();
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
  <html>
    <head>
    <link href="../../assets/css/print.css" rel="stylesheet">
     
    </head>
<body onload="window.print();window.close()">
<div class="header">
<img src="../../assets/img/logoblack.png">
</div>

${printContents}</body>
  </html>`
    );
    popupWin.document.close();
  }

  deleteAll(ids:any,ftype:any) {
  let encSchemeStr = this.encDec.encText(ids.toString());
  if(ids.length == 0){
    Swal.fire({
      icon: 'error',
      text: 'Please select the record you want to delete.',
      
    });
  }
else{
    var itemids = ids.toString(); 
     // alert(itemids);

      let letterParams = {
        "itemId":itemids,
        "itemStatus" :"1" 
   };

   Swal.fire({
    title: 'Are you sure?',
    text: "You want to delete this record",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result:any) => {
    if (result.isConfirmed) {
      this.commonService.deleteAll(letterParams,ftype).subscribe((response:any)=>{
        let respData = response.RESPONSE_DATA;
        let respToken = response.RESPONSE_TOKEN;
        let res = JSON.parse(atob(respData));  
        if(res.status==200){
          Swal.fire(
            'Deleted!',
            'Record has been deleted.',
            'success'
          )
          $('.checkAll').prop('checked', false);
          this.callfunction.emit();
           this.callfunction3.emit();
        }
        else{
         
          Swal.fire({
            icon: 'error',
            text: 'Something Went Wrong',
            
          }); 
        }
         
         });
    
     
  
    }
  })



        }
  }
  backClicked() {
    this._location.back();
  }
  publishAll(ids:any,ftype:any) {
    if(ids.length == 0){
      Swal.fire({
        icon: 'error',
        text: 'Please select the record you want to publish.',
        
      });
    }
  else{
    
    var itemids = ids.toString(); 
    // alert(itemids);
     // console.log(ids+"==="+ftype)

      let letterParams = {
        "itemId":itemids,
        "itemStatus" :"2" 
   };

   Swal.fire({
    text: "You want to publish this record",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Yes, publish it!'
   }).then((result:any) => {
     
     if (result.isConfirmed) {
      
      this.commonService.publishAll(letterParams,ftype).subscribe((response:any)=>{
        let respData = response.RESPONSE_DATA;
        let respToken = response.RESPONSE_TOKEN;
        let res = JSON.parse(atob(respData)); 
        
      // console.log(respData)

        if(res.status==200){
        
          Swal.fire(
            'Published!',
            'Publish Records Successfully',
            'success'
          )
 
          $('.checkAll').prop('checked', false);
          this.callfunction.emit();
          this.callfunction3.emit();
        }
        else{
         
          Swal.fire({
            icon: 'error',
            text: 'Something Went Wrong',
            
          }); 
        }
         
         });
   
     }
   })


 
        }
  }
  unpublishAll(ids:any,ftype:any) {
     let encSchemeStr = this.encDec.encText(ids.toString());
    if(ids.length == 0){
      Swal.fire({
        icon: 'error',
        text: 'Please select the record you want to unpublish.',
        
      });
    }
  else{
    var itemids = ids.toString(); 
   // alert(itemids);  

      let letterParams = {
        "itemId":itemids,
        "itemStatus" :"3" 
   };
   Swal.fire({
    text: "You want to unpublish this record",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, unpublish it'
  }).then((result:any) => {
    if (result.isConfirmed) {
      this.commonService.unpublishAll(letterParams,ftype).subscribe((response:any)=>{
        let respData = response.RESPONSE_DATA;
        let respToken = response.RESPONSE_TOKEN;
        let res = JSON.parse(atob(respData)); 
        if(res.status==200){

          Swal.fire(
            'Unpublished !',
            'Unpublish Records Successfully.',
            'success'
          )
          itemids='';
          $('.checkAll').prop('checked', false);
          this.callfunction.emit();
          this.callfunction3.emit();
        }
        else{
         
          Swal.fire({
            icon: 'error',
            text: 'Something Went Wrong',
            
          }); 
        }
         
         });
  
    }
  })

     
        }
  }

}
