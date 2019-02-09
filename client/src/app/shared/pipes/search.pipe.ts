import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'filter' })

export class FilterPipe implements PipeTransform {
    transform(employees:any,search:any) {
        if(search === undefined || search ==="") return employees;
        // return employees.filter(function(employees){
        //     return employees.name.toLowerCase().includes(search.toLowerCase());
        // })
     let keys = [];
     let ans = []; 
     keys = Object.keys(employees[0]);
     for (let i of employees) {
     for (let k of keys)
     {  
     if(i[k] === null || i[k] === undefined){}
      else if (i[k].toString().match('^.*' + search +'.*$'))
    {
        ans.push(i);
        break;
      }
    }
  }
  return ans;  
    }
}