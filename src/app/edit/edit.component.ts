import { Component, OnInit, ViewChild, Optional, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GROUPS, Group } from '../services/listgroup';
import { MatSelect } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup,Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import Swal from 'sweetalert2';
import { EmployeeServices } from '../services/employee.service';

@Component({
     selector: 'app-edit',
     templateUrl: './edit.component.html',
     styleUrls: ['./edit.component.less']
})


export class EditComponent implements OnInit {

     getEmployeeId: any;
     editFormEmploye: FormGroup;
     id: string;
     submit = false;
     isEdit: boolean;
     basicSalary = '0'
     filter: any;
     selected: any;

     groups: Group[] = GROUPS
     group: FormControl = new FormControl();
     groupFilterFormcontrol: FormControl = new FormControl();

     options: ReplaySubject<Group[]> = new ReplaySubject(1);
     @ViewChild('listgroup') listgroup: MatSelect;

     _onDestroy = new Subject<void>();

     constructor(
          private formBuilder: FormBuilder,
          private route: ActivatedRoute,
          private router: Router,
          private service: EmployeeServices,
          private dateAdapter: DateAdapter<Date>,
          @Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string
     ) {
          this.dateAdapter.setLocale('id');
     }

     ngOnInit(): void {
          this.id = this.route.snapshot.params['id'];

          this.getDataByid(this.route.snapshot.paramMap.get('id'));
          this.dateDisable()

          this.editFormEmploye = this.formBuilder.group({
               username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]],
               firstName: ['', [Validators.required]],
               lastName: ['', [Validators.required]],
               email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
               birthDate: ['', [Validators.required]],
               basicSalary: ['', [Validators.required, Validators.min(1000000)]],
               status: ['', [Validators.required]],
               group: ['', [Validators.required]],
               description: ['', [Validators.required]]
          });
         
          if (this.isEdit) {
               this.service.getItem(this.id).pipe(first()).subscribe(x => this.editFormEmploye.patchValue(x));
          }

          this.group.setValue(this.groups[10]);
          this.options.next(this.groups.slice());
          this.groupFilterFormcontrol.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
               this.filterGroup();
          })
     }


     maxDate: any;
     dateDisable() {
          let date: any = new Date();
          let todayDate: any = date.getDate();
          let month: any = date.getMonth() + 1;
          let year: any = date.getFullYear();
          if (todayDate < 10) {
               todayDate = '0' + todayDate;
          }

          if (month < 10) {
               month = '0' + month;
          }

          this.maxDate = year + "-" + month + "-" + todayDate;
     }

     getDataByid(id: string | null) {
          this.service.getItem(id)
               .subscribe(
                    (employee: null) => {
                         this.getEmployeeId = employee;
                    },
                    (error: any) => {
                         console.log(error);
                    });
     }

     edit() {
          this.submit = true;
          if (this.editFormEmploye.invalid) {
               return;
          }

          if (this.editFormEmploye) {
               this.update();
          }
     }
     filterGroup() {
          if (!this.groups) {
               return;
          }
          let search = this.groupFilterFormcontrol.value;
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

     update() {
          this.service.update(this.id, this.editFormEmploye.value).pipe(first()).subscribe({
               next: () => {
                    Swal.fire('Congratulation', 'Your Employee Data changed successfully!', 'success')
                    this.router.navigate(['/employeelist'], { relativeTo: this.route });
               }, error: error => {
                    Swal.fire({
                         icon: 'error',
                         title: 'Oops..',
                         text: 'Something went wrong!'
                    })
               }
          })
     }
}
