import { Routes } from '@angular/router';
import { Postlist } from './components/post-list/post-list';
import { PostCreate } from './components/post-create/post-create';

export const routes: Routes = [
    // 1. Ruta para la página principal (Listado de Posts)
    { path: '', component: Postlist }, 
    
    // 2. Ruta para la página de creación (El formulario)
    { path: 'create', component: PostCreate },
    
    // Opcional: Redirigir cualquier ruta desconocida al inicio
    { path: '**', redirectTo: '' }
];
