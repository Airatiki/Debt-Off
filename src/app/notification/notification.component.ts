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

  dataLoaded = false;
  notifications: Notification[];
  balance = 0;
  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      window.location.href = 'http://localhost:4200';
      // window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.getNotifications();
  }
  getNotifications() {
    this.userservice.getNotifications()
      .subscribe(data => {
        this.dataLoaded = true;
        this.notifications = data.ingoing;
        this.balance = this.notifications.reduce((total, {amount}) => total += amount, 0);
      }, error => {
        console.log(error);
      });
  }

  onClick(notification) {
    notification.clicked === 'undefined' ? notification.clicked = true : notification.clicked = !notification.clicked;
  }

  onAcceptInvoice(invoice, event: MouseEvent) {
    event.stopPropagation();
    const user = invoice.target.id;
    this.userservice.acceptInvoice(invoice.id).subscribe(() => {
        this.router.navigate(['/home/userinfo/' + user], { relativeTo: this.route });
      },
      error => {
        console.log(error);
      });
  }

  onDeclineInvoice(invoice, event) {
    event.stopPropagation();
    this.userservice.declineInvoice(invoice.id).subscribe(() => {
      console.log('deletted');
      this.getNotifications();
    },
      error => console.log(error));
  }
}
