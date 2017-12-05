import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  community: any;
  path: any;
  graphLoaded = false;
  imgWidth = 900;
  imgHeight = 900;

  constructor(private userservice: UserService, private sanitization: DomSanitizer) { }

  ngOnInit() {
    console.log(this.community.id);
    this.userservice.showCommunityGraph(this.community.id).subscribe(data => {
      console.log('DATA OT GRAPHA');
      console.log(data);
      this.path = this.sanitization
        .bypassSecurityTrustResourceUrl(`https://debtoff.azurewebsites.net/api/community/${this.community.id}/graph`);
      this.graphLoaded = true;
      // this.path = data;
    });
  }

  optimizeGraph() {
    this.graphLoaded = false;

    this.userservice.optimizeCommunity(this.community.id).subscribe(response => {
      console.log('Response', response);
      // this.graphLoaded = true;
      this.ngOnInit();
    });
  }

  increaseImage() {
    this.imgHeight += 70;
    this.imgWidth += 30;
  }

  decreaseImage() {
    this.imgHeight -= 50;
    this.imgWidth -= 30;
  }

}
