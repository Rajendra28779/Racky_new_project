import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { SurverconfurationService } from '../../Services/surverconfuration.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
@Component({
  selector: 'app-surveyquestionmapping',
  templateUrl: './surveyquestionmapping.component.html',
  styleUrls: ['./surveyquestionmapping.component.scss']
})
export class SurveyquestionmappingComponent implements OnInit {
  user: any;
  surveylist: any = [];
  questionlist: any = [];
  questionlistbkp: any = [];
  keyword: any = 'surveyName';
  surveyid: any = "";
  showquestion: boolean = false;
  @ViewChild('auto') auto;
  checkall: any = false;

  constructor(public headerService: HeaderService, private route: Router,
    private surveyserv: SurverconfurationService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData("user");
    this.headerService.setTitle("Survey Question Mapping");
    this.getactivesurveylist();
  }
  getactivesurveylist() {
    this.surveyserv.getactivesurveylist(1).subscribe((data: any) => {
      if (data.status == 200) {
        this.surveylist = data.data;
      } else {
        this.surveylist = [];
        this.swal("Error", "Something Went Wrong", "error");
      }
    });
  }

  selectEvent(item) {
    this.surveyid = item.surveyId;
    this.getquestionlistlist();
    this.showquestion = true;
    this.selectlist = [];
  }
  onReset() {
    this.surveyid = "";
    this.questionlist = [];
    this.showquestion = false;
    this.selectlist = [];
  }

  getquestionlistlist() {
    this.questionlist = [];
    this.questionlistbkp = [];
    this.surveyserv.getquestionlist(this.surveyid).subscribe((data: any) => {
      if (data.status == 200) {
        this.questionlist = data.data;
        this.questionlistbkp = data.data;
        this.checkall = data.checkall;
      } else {
        this.questionlist = [];
        this.swal("Error", "Something Went Wrong", "error");
      }
    });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  selectlist: any = [];
  question: any;
  selectitem(item: any) {

    this.question = {
      id: '',
      status: 0,
    }

    this.question.id = item.qustionId;
    this.question.status = item.status == 0 ? 1 : 0;

    let stat = false;
    for (const i of this.selectlist) {
      if (i.id == this.question.id) {
        stat = true;
      }
    }
    if (stat == false) {
      this.selectlist.push(this.question);
    } else {
      for (let i = 0; i < this.selectlist.length; i++) {
        if (item.qustionId == this.selectlist[i].id) {
          let index = this.selectlist.indexOf(this.selectlist[i]);
          if (index !== -1) {
            this.selectlist.splice(index, 1);
          }
        }
      }
    }
  }

  allselectitem() {
    this.questionlist = this.questionlistbkp;
    this.selectlist = [];
    let status;
    if (this.checkall) {
      status = 1;
    } else {
      status = 0;
    }

    for (let i = 0; i < this.questionlist.length; i++) {
      let item = this.questionlist[i];
      this.questionlist[i].status = status;

      this.question = {
        id: '',
        status: 0,
      }

      this.question.id = item.qustionId;
      this.question.status = status;

      let stat = false;
      for (const i of this.selectlist) {
        if (i.id == this.question.id) {
          stat = true;
        }
      }
      if (stat == false) {
        this.selectlist.push(this.question);
      } else {
        for (let j = 0; j < this.selectlist.length; j++) {
          if (item.qustionId == this.selectlist[j].id) {
            let index = this.selectlist.indexOf(this.selectlist[j]);
            if (index !== -1) {
              this.selectlist.splice(index, 1);
            }
          }
        }
      }
    }
    this.checkall = !this.checkall;
  }

  submit() {
    if (this.surveyid == null || this.surveyid == "" || this.surveyid == undefined) {
      this.swal("Info", "Please select Survey Name", 'info');
      return;
    }
    if (this.selectlist.length == 0) {
      this.swal("Info", "Please select at least One Specialist", 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Save It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let object = {
          surveyid: this.surveyid,
          selectlist: this.selectlist,
          createdby: this.user.userId
        }
        this.surveyserv.savequestionmapping(object).subscribe((data: any) => {
          if (data.status == 200) {
            this.swal("Success", data.message, "success");
            this.getactivesurveylist();
            this.onReset();
            this.auto.clear();
            this.route.navigate(['/application/viewsurveyquestionmapping']);
          } else {
            this.swal("Error", data.message, "error");
          }
        });
      }
    });
  }

  Reset() {
    window.location.reload();
  }

}

