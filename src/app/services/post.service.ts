import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { PostDTO } from '../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:8081/api/posts';

  private refreshNeeded$ = new Subject<void>();
  get refresh$() { return this.refreshNeeded$.asObservable(); }
  
  constructor(private http: HttpClient) { }

  getPosts(): Observable<PostDTO[]> {
    return this.http.get<PostDTO[]>(this.apiUrl);
  }

  createPost(post: PostDTO): Observable<PostDTO> {
    return this.http.post<PostDTO>(this.apiUrl, post).pipe(
      // Notificar que se necesita refrescar
      tap(() => {
        this.refreshNeeded$.next();
      })
    );
  }

  updatePost(id: number, post: PostDTO): Observable<PostDTO> {
    return this.http.put<PostDTO>(`${this.apiUrl}/${id}`, post);
  }

  deletePost(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

}
