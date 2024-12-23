import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Conditional } from '@angular/compiler';
import { formenvironment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RuleenginevalidatorService {

  constructor(private http: HttpClient) { }

  
  getRuleImplimentation(ruleParams:any):Observable<any>{
    let serviceUrl = formenvironment.serviceURL+'getRuleImplimentation';
    let serviceRes = this.http.post(serviceUrl,ruleParams);
     return serviceRes;
  }

  // this.CommonconfigService.schemeDynCtrls(params).subscribe(res => {
      
  //   if(res.status == 1)
  //   {
  //     this.ctrlArr= res.result['ctrlArr'][0]['sectionCtrls'];
 
  //     for(var ctrlArrLoop of this.ctrlArr)
  //     {
       
  //       if(ctrlArrLoop['tinControlType'] == 2) //  For DropDown
  //       {
  //         this.ctrlAllValArr[ctrlArrLoop['jsnControlArray'][0]['ctrlId']]=ctrlArrLoop['jsnOptionArray'][0]['optionArr'];
  //       }
        
  //     }
  //   }  


  // });

  ruleEngineValidation(moduleId:number , processId:number)
  {
    this.getRuleImplimentation({"moduleId":moduleId,"formId":processId ,"ruleId":0}).subscribe(res => {
      if(res.status == 200)
      {
          let allCondServ = res.result[0].conditions;
        for (let rul = 0; rul < allCondServ.length; rul++) {
             console.log(allCondServ[rul]['conditionType']);
         /* if(rul ==0)
            { 
              this.parentRuleArr = [{selType:allCondServ[rul]['conditionType']}];
            }
          else
          {
            this.parentRuleArr.push({selType:allCondServ[rul]['conditionType']});
            
          }*/

      /*for(let rulInner =0;rulInner < allCondServ[rul]['innerConditions'].length; rulInner++)
        {
          let firstloopInd = Number(rul) + Number(1);
          let secondloopInd = Number(rulInner) + Number(1);
          if(allCondServ[rul]['innerConditions'][rulInner]['controlType'] ==6)
          {
            ctrlText = allCondServ[rul]['innerConditions'][rulInner]['ctrlValue']; 
          }
          else
          {
            ctrlValue =  allCondServ[rul]['innerConditions'][rulInner]['ctrlValue']; 
          }
      
         
          if(rulInner ==0)
          {
              this.arrFormGroup[rul]= [{ selFieldType: allCondServ[rul]['innerConditions'][rulInner]['ctrlId'] ,selOperator: allCondServ[rul]['innerConditions'][rulInner]['operator'], selChildOperator: ctrlValue,  txtCondition: ctrlText ,  selOutputOperators: allCondServ[rul]['innerConditions'][rulInner]['outputOperator'] , selOutput:allCondServ[rul]['innerConditions'][rulInner]['output'] ,events : [allCondServ[rul]['innerConditions'][rulInner]['events']]}];

              
          }
          else
          {
            (this.arrFormGroup[rul]).push({
              selFieldType:allCondServ[rul]['innerConditions'][rulInner]['ctrlId'],
              selOperator: allCondServ[rul]['innerConditions'][rulInner]['operator'],
              selChildOperator: ctrlValue,
              txtCondition: ctrlText,
              selOutputOperators: allCondServ[rul]['innerConditions'][rulInner]['outputOperator'],
              selOutput: allCondServ[rul]['innerConditions'][rulInner]['output'],
              events : [allCondServ[rul]['innerConditions'][rulInner]['events']]
          });
          }
           setTimeout(() => {  
          let selectElement:any =document.getElementById('selFieldType_'+firstloopInd+'_'+secondloopInd);
          selectElement.dispatchEvent(
            new Event("change")
          );
          let selectIfElement:any =document.getElementById('selType_'+firstloopInd);
          selectIfElement.dispatchEvent(
            new Event("change")
          );

        }, 1000);  
     
        } */
        }

      //   for(let i in res.result)
      //   {
      //   // console.log(res.result[0]['conditions'][i]['innerConditions'][0]);
      //   console.log(res.result[i]['conditions'])
      //  //   console.log(res.result[0][i][0]['conditionType']);
      //   }
      }
  
    });
  
  }
}
