// import { NgModule } from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
// import { ApplicationSummaryComponent } from './application-summary/application-summary.component';
// import { ApplicationComponent } from './application.component';
// import { ApprovedApplicationComponent } from './approved-application/approved-application.component';
// import { PendingApplicationComponent } from './pending-application/pending-application.component';
// import { RejectedApplicationComponent } from './rejected-application/rejected-application.component';
// import { RevertedApplicationComponent } from './reverted-application/reverted-application.component';
// import { TakeActionComponent } from './take-action/take-action.component';
// import { ViewApplicationListComponent } from './view-application-list/view-application-list.component';
// import { ViewFormListComponent } from './view-form-list/view-form-list.component';
// const routes: Routes = [
//   {
//     path: '',
//     component: ApplicationComponent,
//     children: [
//      { path: 'view-form-list', component: ViewFormListComponent },
//       {
//         path: 'view-application-list/:id',
//         component: ViewApplicationListComponent,
//       },
//       { path: 'take-action/:id', component: TakeActionComponent },
//       {
//         path: 'pending-application/:id',
//         component: PendingApplicationComponent,
//       },
//       {
//         path: 'application-summary/:id',
//         component: ApplicationSummaryComponent,
//       },
//       {
//         path: 'approved-application/:id',
//         component: ApprovedApplicationComponent,
//       },
//       {
//         path: 'rejected-application/:id',
//         component: RejectedApplicationComponent,
//       },
//       {
//         path: 'reverted-application/:id',
//         component: RevertedApplicationComponent,
//       },
//     ],
//   },
// ];

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })
// export class ApplicationRoutingModule {}
