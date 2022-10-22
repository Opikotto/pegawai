export interface Group{
     id: string;
     name: string;
 }
 
 export interface GroupList{
     name: string;
     groups: Group[];
 }
 
 export const GROUPS: Group[] = [  
     {name: 'Frontend Developer', id:'1'},
     {name: 'Backend Developer', id:'2'},
     {name: 'IT Infrastructure', id:'3'},
     {name: 'DB Admin',id:'4'},
     {name: 'System Implementor', id:'5'},
     {name: 'QA Engineer', id: '6'},
     {name: 'Project Manager',id: '7'},
     {name: 'Flutter Developer', id:'8'},
     {name: 'Graphic Designer', id:'9'},
     {name: 'Product Owner',id:'10'}
     
 ];