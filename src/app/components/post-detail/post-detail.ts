import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  imports: [],
  templateUrl: './post-detail.html',
})
export class PostDetail {
  postId: string | null = null;

  constructor(private route: ActivatedRoute) {} 

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.postId = params.get('id');
            console.log('Post ID cargado:', this.postId);
        });
    }
}
