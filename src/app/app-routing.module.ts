import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';
import { DetailComponent } from './detail/detail.component';

const routes: Routes = [{
  path:'',
  component:LoginComponent
},{
  path: 'employeelist',
  component:ListComponent
},{
  path: 'add',
  component:AddComponent
},{
  path: 'edit/:id',
  component:EditComponent
},{
  path: 'detail/:id',
  component:DetailComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
