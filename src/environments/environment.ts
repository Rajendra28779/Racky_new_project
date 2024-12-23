// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl:"http://localhost:8080",
  // baseUrl: "https://bskycms.odisha.gov.in:8443/bsky_service",
  grievancePreviewUrl: "http://192.168.10.46/bsky_grv_testI/#/website/formPreview/",
  hospitalEmpanelmentUrl: 'http://localhost:4201/#/landing/',
  hospitalEnrollmentUrl: 'http://localhost:4202/#/landing/',
  reporttUrl: 'http://localhost:4204/#/landing/',
  routingUrl: "/#",
  // ============================Empanelment properties==================================
  apiHashingKey: '22CSMTOOL2022',
  encryptIV: '26102021@qwI',
  errorMsg: 'Some Error Occured',
  apiUrl: 'http://192.168.203.171:8080/',
  tempUrl: 'http://localhost:8080' + 'downloadForm/',
  tempUrlForApproval: 'http://192.168.10.46/bsky_service_testI/' + 'downloadApprovalForm/',
  //tempUrlForApproval:'http://localhost:8080/'+'downloadApprovalForm/',
  // tempUrl:'http://localhost:8081/'+'downloadForm/',
  installURL: 'http://192.168.203.171:8080/',
  siteURL: 'http://192.168.10.186/framework/csmFrameWork/',
  logotypes: [
    {
      typeId: 1,
      typeName: 'Console Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 2,
      typeName: 'Portal Login Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 3,
      typeName: 'Admin left-panel Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 4,
      typeName: 'Citizen Login Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 5,
      typeName: 'Citizen Profile Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 6,
      typeName: 'Favicons Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '0',
      intCreatedBy: '',
    },
    {
      typeId: 7,
      typeName: 'Certificate Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
    {
      typeId: 8,
      typeName: 'Recipent Logo',
      typeheading: '',
      imgurl: '',
      intUpdatedBy: '',
      intCreatedBy: '',
    },
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
