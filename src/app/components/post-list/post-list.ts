import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { PostDTO } from '../../models/post';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-post-list',
  imports: [CommonModule, FormsModule, RouterModule, ConfirmationDialog], // Necesitas importar CommonModule para usar el | async o @for
  templateUrl: './post-list.html',
})
export class Postlist implements OnInit {

  // 1. INYECCIÓN MODERNA
  private service = inject(PostService);
  private cdr = inject(ChangeDetectorRef);

  // 2. DECLARACIÓN DE LA PROPIEDAD
  public postList$!: Observable<PostDTO[]>;

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
  // 🆕 PROPIEDADES PARA EL MODAL
  public isModalVisible: boolean = false;
  public postToDeleteId: number | null = null;
  public confirmationMessage: string = '';

  // -------------------------
  //  1. ABRIR MODAL
  // -------------------------
  promptDelete(id: number): void {
    this.postToDeleteId = id;
    this.confirmationMessage = `¿Estás seguro de que lo quieres eliminar?`;
    this.isModalVisible = true;
  }

  // -------------------------
  //  2. CERRAR MODAL (CANCELAR)
  // -------------------------
  cancelDelete(): void {
    this.isModalVisible = false;
    this.postToDeleteId = null;
  }

  // -------------------------
  //  3. CONFIRMAR Y ELIMINAR
  // -------------------------
  confirmDelete(): void {
    if (this.postToDeleteId === null) return;

    const id = this.postToDeleteId;

    // Cierra el modal primero para que el usuario sepa que está procesando
    this.isModalVisible = false;

    this.service.deletePost(id).subscribe({
      next: () => {
        this.loadPosts(); // recargar lista
        this.cdr.detectChanges();
        this.postToDeleteId = null; // Limpiar el estado
      },
      error: (e) => {
        console.error('Error al eliminar:', e);
        alert('No se ha podido eliminar el post. Revisa la consola.');
        this.postToDeleteId = null;
      }
    });
  }
}
