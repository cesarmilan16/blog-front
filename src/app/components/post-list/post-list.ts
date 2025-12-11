import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostDTO } from '../../models/post';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, FormsModule], // Necesitas importar CommonModule para usar el | async o @for
  templateUrl: './post-list.html',
})
export class Postlist implements OnInit {
  
  // 1. INYECCIÓN MODERNA
  private service = inject(PostService);
  private cdr = inject(ChangeDetectorRef);
  
  // 2. DECLARACIÓN DE LA PROPIEDAD
  public postList$!: Observable<PostDTO[]>;

  // --- PROPS PARA EDICIÓN INLINE ---
  public editingId: number | null = null;
  public editTitle: string = '';
  public editContent: string = '';
  public isSaving: boolean = false;
  // -----------------------------------

  ngOnInit(): void {
    
    this.loadPosts(); // primera carga

    // cuando se cree un post → recargar lista
    this.service.refresh$.subscribe(() => {
      this.loadPosts();
      this.cdr.detectChanges();
    });
  }

  private loadPosts() {
    this.postList$ = this.service.getPosts();
  }

  // -------------------------
  //  ELIMINAR
  // -------------------------
  deletePost(id: number): void {
    if (!confirm('¿Seguro que quieres eliminar este post?')) return;

    this.service.deletePost(id).subscribe({
      next: () => {
        // recargar lista tras eliminar
        this.loadPosts();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al eliminar:', e);
        alert('No se ha podido eliminar el post. Revisa la consola.');
      }
    });
  }

  // -------------------------
  //  EDITAR (inline)
  // -------------------------
  startEdit(post: PostDTO): void {
    this.editingId = (post as any).id ?? null; // usa la propiedad id que tengas
    this.editTitle = post.title;
    this.editContent = post.content;
    // forzar detect si quieres
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editTitle = '';
    this.editContent = '';
  }

  saveEdit(): void {
    if (this.editingId === null) return;

    // validaciones básicas
    if (!this.editTitle.trim() || !this.editContent.trim()) {
      alert('Título y contenido no pueden estar vacíos.');
      return;
    }

    this.isSaving = true;
    const updated: PostDTO = {
      title: this.editTitle,
      content: this.editContent
    };

    this.service.updatePost(this.editingId, updated).subscribe({
      next: (res) => {
        // cerrar editor y recargar lista
        this.editingId = null;
        this.editTitle = '';
        this.editContent = '';
        this.isSaving = false;

        this.loadPosts();
        this.cdr.detectChanges();
      },
      error: (e) => {
        console.error('Error al actualizar:', e);
        alert('No se ha podido actualizar el post. Revisa la consola.');
        this.isSaving = false;
      }
    });
  }
}
