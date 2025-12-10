import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostDTO } from '../../models/post';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule], // Necesitas importar CommonModule para usar el | async o @for
  templateUrl: './post-list.html',
})
export class Postlist implements OnInit {
  
  // 1. INYECCIÓN MODERNA
  private service = inject(PostService); 
  
  // 2. DECLARACIÓN DE LA PROPIEDAD
  public postList$!: Observable<PostDTO[]>; 

  ngOnInit(): void {
    // Asignar el observable de forma directa
    this.postList$ = this.service.getPosts();
  }
}