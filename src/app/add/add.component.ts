import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeServices } from '../services/employee.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GROUPS,Group } from '../services/listgroup';
import {  takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.less']
})
export class AddComponent implements OnInit {
addFormData :FormGroup;
basicSalary:'0';
selected:any;
filtered:any;
groups: Group[] = GROUPS;
group: FormControl = new FormControl();

groupformControl:FormControl = new FormControl();
options:ReplaySubject<Group[]> = new ReplaySubject<Group[]>(1);

@ViewChild('listgroup',{static:true}) listgroup:MatSelect;
_onDestroy = new Subject<void>();

constructor(
     private service: EmployeeServices,
     private formBuilder: FormBuilder, 
     private route: ActivatedRoute,
     private router: Router) {}



  ngOnInit(): void {

     this.addFormData = this.formBuilder.group({
          username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
          firstName: ['', [Validators.required]],
          lastName: ['',[Validators.required]],
          email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          birthDate: ['', [Validators.required]],
          basicSalary: ['', [Validators.required, Validators.min(1000000)]],
          status: ['', [Validators.required]],
          group: ['', [Validators.required]],
          description: ['', [Validators.required]]
        });
        
      this.options.next(this.groups);
      this.groupformControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(()=> {
          this.filterFb();
      })
      this.dateTime()
  }


  filterFb() {
     if (!this.groups) {
          return;
     }
     let search = this.groupformControl.value;
     if (!search) {
          this.options.next(this.groups.slice());
          return;
     } else {
          search = search.toLowerCase();
     }
     this.options.next(
          this.groups.filter(group => group.name.toLowerCase().indexOf(search) > -1)
     );
   }

   maxDate:any;
   dateTime() {
     var date:any = new Date();
     var todayDate:any = date.getDate();
     var month:any = date.getMonth() + 1;
     var year:any = date.getFullYear();
     if(todayDate<10){
       todayDate = '0' + todayDate;
     }
 
     if(month<10){
       month = '0' + month;
     }
 
     this.maxDate = year + "-" + month + "-" + todayDate;
   }

   add(){

     Swal.fire( 
     'Congratulation',
     'New employee has been added!',
     'success'
     ).then(()=> {
          this.service.create(this.addFormData.value).subscribe({
               next: () => {
                 this.router.navigate(['/employeelist'], { relativeTo: this.route});
               }, error:()=>{
                 alert("Error while adding new Employee")
               }
             })
     })
   }
}
