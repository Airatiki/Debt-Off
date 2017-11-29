import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Notification} from "../shared/Notification";

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notification: Notification;
  notifications: any[];
  selectedNotification: Object = {};
  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications() {
    this.userservice.getNotifications()
      .subscribe(data => {
        this.notifications = data.json().invoices;
        console.log(this.notifications);
      }, error => {
        console.log(error);
      });
  }

  onChange(notification) {
    this.userservice.acceptInvoice(notification.id).subscribe(response => {
      console.log('ALAAAAAn');
        this.router.navigate(['home/userinfo/' + notification.creditorId], { relativeTo: this.route });
      },
      error => {
      console.log(error);
      });
  }


}
