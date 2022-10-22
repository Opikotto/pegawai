import { Component, OnInit, ViewChild } from '@angular/core';
import { EmployeeServices } from '../services/employee.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms'
import { GROUPS, Group } from '../services/listgroup';
import { MatSelect } from '@angular/material/select';
import { takeUntil } from 'rxjs/operators';

@Component({
     selector: 'app-list',
     templateUrl: './list.component.html',
     styleUrls: ['./list.component.less']
})
export class ListComponent implements OnInit {
     tableColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'birthDate', 'basicSalary', 'status', 'group', 'description', 'LookDetail', 'EditThis', 'DeleteThis'];
     dataSource!: MatTableDataSource<any>;

     firstNameSearch = new FormControl();
     groupSearch = new FormControl();

     groups: Group[] = GROUPS;
     group: FormControl = new FormControl();

     filteredValues = {
          firstName: '', lastName: '', group: ''
     };

     @ViewChild(MatPaginator) paginator!: MatPaginator;
     @ViewChild(MatSort) sort!: MatSort;

     groupformControl: FormControl = new FormControl();
     options: ReplaySubject<Group[]> = new ReplaySubject<Group[]>(1);

     @ViewChild('listgroup', { static: true }) listgroup: MatSelect;
     _onDestroy = new Subject<void>();

     constructor(
          private service: EmployeeServices, private router: Router
     ) { }

     ngOnInit(): void {
          this.getSemuaData()
          this.firstNameSearch.valueChanges.subscribe((search) => {
               this.filteredValues['firstName'] = search;
               this.dataSource.filter = this.filteredValues['firstName'].trim().toLowerCase();

               if (this.dataSource.paginator) {
                    this.paginator.firstPage();
               }
          });

          this.options.next(this.groups);
          this.groupformControl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
               this.filterFb();
          })

     }
     getSemuaData() {
          this.service.list().subscribe({
               next: (res) => {
                    this.dataSource = new MatTableDataSource(res);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
               },
               error: (err) => {
                    alert("Error while fetching data Employee")
               }
          })
     }

     edit(row: any) {
          this.router.navigateByUrl(`/edit/${row.id}`)
     }

     delete(id: number) {
          Swal.fire({
               title: 'Are you sure?',
               text: "You won't be able to revert this!",
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
               if (result.isConfirmed) {
                    Swal.fire(
                         'Deleted!',
                         'Your file has been deleted.',
                         'success'
                    )
                    this.service.delete(id).subscribe(response => {
                         this.getSemuaData();
                    },
                         error => {
                              console.log(error);
                         })
               }
          })
     }

     onSelectedFilter(value: string): void {
          this.filteredValues['group'] = value;
          this.dataSource.filter = this.filteredValues['group'].trim().toLowerCase();

          if (this.dataSource.paginator) {
               this.paginator.firstPage();
          }

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
               this.groups.filter(option => {
                    option.name.toLowerCase().indexOf(search) > -1
               })
          );
     }
}
