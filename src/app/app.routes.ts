import { Routes } from '@angular/router';
import { Projects } from './projects/projects';
import { Home } from './home/home';
import { Contact } from './contact/contact';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'projects', component: Projects},
    {path: 'contact', component: Contact}
];
