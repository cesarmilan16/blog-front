import { Component, signal } from '@angular/core';
import { Postlist } from './components/post-list/post-list';
import { PostCreate } from './components/post-create/post-create';


@Component({
  selector: 'app-root',
  imports: [Postlist, PostCreate],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('blog-front');
}
