import { Component } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  navbar = false;

  constructor(public router: Router) {
    router.events.subscribe((url: any) => {
      console.log(router.url);
      router.url === '/header' ? this.navbar = false : this.navbar = true;
      console.log(this.navbar);
    });
    // console.log(router.url);
  }
}
