import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from 'sweetalert2';
import { HeaderService } from '../application/header.service';
import { SchedularserviceService } from '../application/Services/schedularservice.service';
import { TableUtil } from '../application/util/TableUtil';
import { SessionStorageService } from '../services/session-storage.service';
declare let $: any;

@Component({
  selector: 'app-dishonordeactivation',
  templateUrl: './dishonordeactivation.component.html',
  styleUrls: ['./dishonordeactivation.component.scss']
})
export class DishonordeactivationComponent implements OnInit {
user:any
txtsearchDate:any;
list:any=[];
showPegi: boolean;
currentPage: any;
pageElement: any;
formdate:any
todate:any
totalcount:any=0
sum:any;
dataIdArray: any = [];
show:any=false;
maxChars:any=500


  constructor( public headerService: HeaderService,public schedularserv:SchedularserviceService,
    private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Dishonored Deactivation");
    this.user = this.sessionService.decryptSessionData("user");
    $('.selectpicker').selectpicker();

    $('.datepicker').datetimepicker({
      format: 'DD-MMM-YYYY',
      maxDate: new Date(),
      daysOfWeekDisabled: ['', 7],
    });
    $('.timepicker').datetimepicker({
      format: 'LT',
      daysOfWeekDisabled: ['', 7],
    });
    $('.datetimepicker').datetimepicker({
      format: 'YYYY-MM-DD LT',
      daysOfWeekDisabled: ['', 7],
    });
    this.Search();
  }
  Search(){
    this.list = [];
    this.dataIdArray = [];
    $('#allCheck').prop('checked', false);
    this.show = false;
    this.formdate=$('#formdate').val();
    this.schedularserv.getcpddishonorcountlist(this.formdate,this.todate).subscribe((data:any) => {
      if (data.status==200){
        this.list=data.data;
        this.totalcount=this.list.length;
        let sum=0;
        if(this.totalcount>0){
          for(const element of this.list){
            sum+=parseInt(element.dishonorcount);
          }
          this.sum=sum;
          this.showPegi=true;
        }else{
          this.showPegi=false
        }
        this.pageElement=50;
        this.currentPage=1;
      }else{
        this.swal("Error", "Something Went Wrong", 'error');
      }
    })
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getReset(){
    this.dataIdArray = [];
    $('#allCheck').prop('checked', false);
    this.showPegi=false;
    $('#remark').val('');
    this.show = false;
    window.location.reload();
  }

  checkAllCheckBox(event: any) {
    if (event.target.checked) {
      for (let i = 0; i < this.list.length; i++) {
        $('#' + this.list[i].cpdId).prop('checked', true);
        this.dataIdArray.push(this.list[i].cpdId);
      }
    } else {
      for (let i = 0; i < this.list.length; i++) {
        $('#' + this.list[i].cpdId).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      $('#remark').val('');
      this.show = false;
    }
  }
  tdCheck(event: any, cpdId) {
    if (event.target.checked) {
      this.dataIdArray.push(cpdId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == cpdId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.list.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      $('#remark').val('');
      this.show = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }

  arrtostring(array:any){
    let s="";
    for(let i=0;i<array.length;i++){s=s+array[i]+",";}
    return s;
  }

  submit(){
    let remark=$('#remark').val().trim();
    if (remark==null || remark== "" || remark==undefined){
      this.swal("Info", "Please Enter Remark !", 'info');
      $('#remark').val('');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Deactivate this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Deactive it!'
    }).then((result) => {
      if (result.isConfirmed) {
          let cpdid=this.arrtostring(this.dataIdArray);
          this.schedularserv.deactivecpddishonour(this.formdate,remark,cpdid,this.user.userId).subscribe((data:any) => {
            if (data.status==200){
              this.swal("Success", data.message, 'success');
              this.Search();
            }else{
              this.swal("Error", "Something Went Wrong !", 'error');
            }
          });
      }
    });
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'CPD Name','Total Dishonored']];
  downloadList(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.push(i+1);
      this.sno.push(sna.cpdName);
      this.sno.push(sna.dishonorcount);
      this.report.push(this.sno);
    }
    this.sno=[];
      this.sno.push(i+1);
      this.sno.push("Total");
      this.sno.push(this.sum);
      this.report.push(this.sno);

    if(no==1){
      let filter =[];
      filter.push([['Dishonored Date', this.formdate]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Dishonored Deactivation List',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Dishonored Deactivation List", 80, 15);
      doc.setFontSize(13);
      doc.text('Dishonored Date :- '+this.formdate,15,25);
      doc.text('GeneratedOn :- '+generatedOn,15,33);
      doc.text('GeneratedBy :- '+generatedBy,15,41);
        autoTable(doc, {
          head: this.heading,
          body: this.report,
          theme: 'grid',
          startY: 47,
          headStyles: {
            fillColor: [26, 99, 54]
          },
          columnStyles: {
            0: {cellWidth: 10},
          }
        });
        doc.save('Dishonored_Deactivation_List.pdf');
    }
  }

}
