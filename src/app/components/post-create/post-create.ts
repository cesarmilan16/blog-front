import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { PostService } from '../../services/post.service';
import { FormsModule } from '@angular/forms';
import { PostDTO } from '../../models/post';

@Component({
  selector: 'app-post-create',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-create.html',
})
export class PostCreate {

  private service = inject(PostService);
  // ⬅️ INYECTAR ChangeDetectorRef
  private cdr = inject(ChangeDetectorRef);

  public newPostTitle: string = '';
  public newPostContent: string = '';

  public isLoading: boolean = false; 
  public successMessage: string | null = null;

  public createPost(): void {
    
    // Limpieza y validación
    this.successMessage = null;
    if (!this.newPostTitle || !this.newPostContent) {
      alert('El título y el contenido no pueden estar vacíos.');
      return;
    }
    
    // Objeto DTO (usamos los nombres de tu interfaz: title, content)
    const newPost: PostDTO = {
      title: this.newPostTitle,
      content: this.newPostContent,
    };
    
    this.isLoading = true;

    // Llamada al servicio
    this.service.createPost(newPost).subscribe({
      next: (response) => {
        this.successMessage = `Post "${response.title}" creado con éxito.`;
        this.isLoading = false;
        
        // Limpiar formulario y variables
        this.newPostTitle = '';
        this.newPostContent = '';

        setTimeout(() => {
        this.successMessage = null;
        this.cdr.detectChanges();
        }, 3000);

      },
      error: (e) => {
        alert('Error al crear el post. Revisa la consola del navegador y el servidor de Java.');
        console.error('API Error:', e);
        this.isLoading = false;

      }
    });
  }

}
