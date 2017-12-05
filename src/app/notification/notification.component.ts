import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Notification} from '../shared/Notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notification: Notification;
  dataLoaded = false;
  notifications: any[];
  balance = 0;
  selectedNotification: Object = {};
  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getNotifications();
  }
  getNotifications() {
    this.userservice.getNotifications()
      .subscribe(data => {
        this.dataLoaded = true;
        this.notifications = data.json().ingoing;
        this.balance = this.notifications.reduce((total, {amount}) => total += amount, 0);
        console.log(this.notifications);
      }, error => {
        console.log(error);
      });
  }

  onClick(notification) {
    console.log(notification);
    notification.clicked === 'undefined' ? notification.clicked = true : notification.clicked = !notification.clicked;
  }

  onAcceptInvoice(invoice, event: MouseEvent) {
    event.stopPropagation();
    console.log(invoice);
    const user = invoice.target.id;
    this.userservice.acceptInvoice(invoice.id).subscribe(response => {
        this.router.navigate(['/home/userinfo/' + user], { relativeTo: this.route });
      },
      error => {
        console.log(error);
      });
  }

  onDeclineInvoice(invoice, event) {
    event.stopPropagation();
    console.log(invoice);
    this.userservice.declineInvoice(invoice.id).subscribe(() => {
      console.log('deletted');
      this.getNotifications();
    },
      error => console.log(error));
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
