import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { SnoCLaimDetailsService } from '../Services/sno-claim-details.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { EnableHospitalDischargeService } from '../Services/enable-hospital-discharge.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-enable-hospital-discharge',
  templateUrl: './enable-hospital-discharge.component.html',
  styleUrls: ['./enable-hospital-discharge.component.scss']
})
export class EnableHospitalDischargeComponent implements OnInit {
  txtsearchDate: any;
  list: any = [];
  user: any;
  totalcount: any;
  showPegi: any = false;
  currentPage: any;
  pageElement: any;
  stateId: any = '';
  districtId: any = '';
  hospital: any = '';
  statelist: Array<any> = [];
  //stateList:any=[];
  districtList: any = [];
  hospitalList: any = [];
  stateData: any = [];
  stateCode: any;
  showdist: boolean = false;
  userId: any;
  distList: any = [];
  selectedItems: any;
  distCode: any;
  state: any = "";
  dist: any = "";
  hosp: any = "";
  hosplist: any = [];
  hosplist1: any = [];
  responseData: any;

  constructor(
    public headerService: HeaderService,
    private snoService2: SnocreateserviceService,
    public snoService: SnoCLaimDetailsService,
    public route: Router,
    private enablehospitaldischarge: EnableHospitalDischargeService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Enable Hospital 1.0 Discharge');
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.search();
    //  this.Update();
  }

  getStateList() {
    this.snoService.getStateList().subscribe((data: any) => {
      this.stateData = data;
      this.stateData.sort((a, b) => a.stateName.localeCompare(b.stateName));
      for (let j = 0; j < this.stateData.length; j++) {
        if (this.stateData[j].stateCode == '21') {
          this.statelist.push(this.stateData[j]);
        }
      }
      for (let i = 0; i < this.stateData.length; i++) {
        if (this.stateData[i].stateCode != '21') {
          this.statelist.push(this.stateData[i]);
        }
      }
    })
    this.search();
  }
  OnChangeState(event) {
    this.stateCode = event.target.value;
    if (this.user.groupId == 4) {
      this.showdist = true;
      this.userId = this.user.userId;
      this.snoService.getDistrictListByState(this.userId, this.stateCode).subscribe((data) => {
        this.distList = data;
        this.distList.sort((a, b) => a.DISTRICTNAME.localeCompare(b.DISTRICTNAME));
      })
    } else {
      this.showdist = false;
      this.selectedItems = [];
      localStorage.setItem("stateCode", this.stateCode);
      this.snoService2.getDistrictListByStateId(this.stateCode).subscribe(
        (response) => {
          this.distList = response;
        },
        (error) => console.log(error)
      )
    }


  }
  OnChangeDist(event) {
    this.distCode = event.target.value;
    if (this.user.groupId == 4) {
      this.showdist = true;
      this.userId = this.user.userId;
      this.snoService.getHospitalByDist(this.userId, this.stateCode, this.distCode).subscribe((data) => {
        this.hospitalList = data;
      })
    } else {
      this.showdist = false;
      var stateCode = localStorage.getItem("stateCode");
      this.snoService2.getHospitalbyDistrictId(this.distCode, stateCode).subscribe(
        (response) => {

          this.hospitalList = response;
        },
        (error) => console.log(error)
      )
    }
  }
  username: any;
  timespan: any;
  search() {
    this.state = $('#statecode1').val();
    this.dist = $('#distcode1').val();
    this.hosp = $('#hospitalcode').val();
    if (this.state == null || this.state == undefined) {
      this.state = "";
    }
    if (this.dist == null || this.dist == undefined) {
      this.dist = "";
    }
    if (this.hosp == null || this.hosp == undefined) {
      this.hosp = "";
    }
    this.username = this.user.fullName
    this.timespan = new Date()
    this.enablehospitaldischarge.gethospitallist(this.user.userId, this.state, this.dist, this.hosp).subscribe((data: any) => {
      this.list = data;
      this.totalcount = this.list.length;
      if (this.totalcount > 0) {
        this.currentPage = 1;
        this.pageElement = 100;
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
    },
    );
  }

  onreset() {
    $('#statecode1').val('');
    $('#distcode1').val('');
    $('#hospitalcode').val('');
    this.search();
  }
  getReset() {
    window.location.reload();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  dataIdArray: any = [];
  checkAllCheckBox1(event: any) {

    if (event.target.checked) {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].status = true
        this.hosp = {
          hospitalCode: ""
        }
        this.hosp.hospitalCode = this.list[i].hospitalcode
        this.hosplist.push(this.hosp);
        this.hosplist1 = []
      }
    } else {
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].status = false;
        this.hosp = {
          hospitalCode: ""
        }
        this.hosp.hospitalCode = this.list[i].hospitalcode
        this.hosplist1.push(this.hosp);
        this.hosplist = []
      }
    }

  }

  show: boolean = false;



  checkeddata(item: any) {
    this.hosp = {
      hospitalCode: ""
    }
    this.hosp.hospitalCode = item.hospitalcode
    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].hospitalcode == item.hospitalcode) {
        this.list[i].status = !item.status;
        if (this.list[i].status) {
          this.hosplist.push(this.hosp);
        } else {
          this.hosplist1.push(this.hosp);
        }
      }
    }

  }
  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  SubmitCreate() {
    let data = {
      "snoid": this.user.userId,
      "hospobj": this.hosplist,
      "hospobjd": this.hosplist1,
    }

    Swal.fire({
      title: '',
      text: 'Are you sure You Want To Submit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {


        this.enablehospitaldischarge.submithosplist(data).subscribe((data: any) => {
          this.responseData = data;
          if (this.responseData.status == 200) {
            this.swal('Success', this.responseData.message, 'Success');
            this.onreset();
          }
          if (this.responseData.status == 400) {
            this.swal('error', this.responseData.message, 'error');
          }
        },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }

        );
      }
    });
  }


  DisableCreate() {
    let data1 = {
      "snoid": this.user.userId,
      "hospobj": this.hosplist1,
    }

    Swal.fire({
      title: '',
      text: 'Are you sure You Want To Submit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {


        this.enablehospitaldischarge.disablehosp(data1).subscribe((data: any) => {
          this.responseData = data;
          if (this.responseData.status == 400) {
            this.swal('Success', this.responseData.message, 'Success');
            this.onreset();
          }
          if (this.responseData.status == 200) {
            this.swal('error', this.responseData.message, 'error');
          }
        },
          (error) => {
            console.log(error);
            this.swal('', 'Something went wrong.', 'error');
          }

        );
      }
    });
  }
  report: any = [];
  sno: any = {
    Slno: '',
    hospitalname: '',
    hospitalcode: '',
  };
  heading = [
    [
      'Sl#',
      'Hospital Name',
      'Hospital Code',
    ],
  ];
  statename: any = "ALL";
  districtName: any = "ALL";
  hospitalname: any = "ALL";
  downloadReport(type) {
    this.report = [];
    let claim: any;
    for (var i = 0; i < this.list.length; i++) {
      claim = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.hospitalname = claim.hospitalname;
      this.sno.hospitalcode = claim.hospitalcode;
      this.report.push(this.sno);
    }
    for (let i = 0; i < this.statelist.length; i++) {
      if (this.statelist[i].stateCode == this.state) {
        this.statename = this.statelist[i].stateName
      }
    }
    if (this.showdist) {
      for (let i = 0; i < this.distList.length; i++) {
        if (this.distList[i].DISTRICTCODE == this.dist) {
          this.districtName = this.distList[i].DISTRICTNAME;
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hosp == this.hospitalList[i].HOSPITALCODE) {
          this.hospitalname = this.hospitalList[i].HOSPITALNAME;
        }
      }
    } else {
      for (let i = 0; i < this.distList.length; i++) {
        if (this.distList[i].districtcode == this.dist) {
          this.districtName = this.distList[i].districtname;
        }
      }
      for (let i = 0; i < this.hospitalList.length; i++) {
        if (this.hosp == this.hospitalList[i].hospitalCode) {
          this.hospitalname = this.hospitalList[i].hospitalName;
        }
      }
    }

    if (type == 'xcl') {
      let filter = [];
      filter.push([['State:- ', this.statename]]);
      filter.push([['District:- ', this.districtName]]);
      filter.push([['Hospital Name:- ', this.hospitalname]]);

      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Enable Hospital 1.0 Discharge',
        this.heading, filter
      );
    }
    else if (type == 'pdf') {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [360, 260]);
      doc.setFontSize(12);

      doc.text("Enable Hospital 1.0 Discharge", 15, 10);

      doc.text('State Name :- ' + this.statename, 15, 20);
      doc.text('District Name :- ' + this.districtName, 15, 30);
      doc.text('Hospital Name :- ' + this.hospitalname, 15, 40);

      doc.text('Generated By :- ' + this.username, 15, 50);

      doc.text('Generated On :' + this.convertDate(this.timespan), 15, 60);



      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.hospitalname;
        pdf[2] = clm.hospitalcode;

        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 75,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 150 },
          2: { cellWidth: 150 },
        }
      });
      doc.save('Bsky_Enable Hospital 1.0 Discharge.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy, h:mm:ss a');
    return date;
  }
}
