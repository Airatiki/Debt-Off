import { Component, OnInit } from '@angular/core';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationDTO, NotificationStore} from '../shared/Notification';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  dataLoaded = false;
  notifications: NotificationDTO[];
  outGoingNotifications: NotificationDTO[];
  balance = 0;
  outgoingBalance = 0;
  savedData: NotificationStore;
  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      // window.location.href = 'http://localhost:4200';
      window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.getNotifications();
  }
  getNotifications() {
    Notification.requestPermission();
    this.userservice.getNotifications()
      .subscribe(data => {
        this.dataLoaded = true;
        this.notifications = data.ingoing;
        this.outGoingNotifications = data.outgoing;
        this.balance = this.notifications.reduce((total, {amount}) => total += amount, 0);
        this.outgoingBalance = this.outGoingNotifications.reduce((total, {amount}) => total += amount, 0);

        this.reloadNotifications(data);
      }, error => {
        console.log(error);
      });
  }

  reloadNotifications(data: any) {
    if (!this.savedData) {
      this.savedData = data;
      setTimeout(() => this.getNotifications(), 5000);

      return;
    }

    const differIngoing = data.ingoing.filter(item => this.savedData.ingoing.map(not => not.id).indexOf(item.id) === -1);
    const differOutgoing = data.outgoing.filter(item => this.savedData.outgoing.map(not => not.id).indexOf(item.id) === -1);

    this.savedData = data;

    if (this.router.url !== '/home/notifications') {
      if (differIngoing.length !== 0) {
        const ing = differIngoing[0];

        const call = new Notification(`${ing.target.firstName} просит вернуть долг`, {
          body: `${ing.description} : ${ing.amount} руб.`,
          icon: 'https://goo.gl/3eqeiE',
        });
      }

      if (differOutgoing.length !== 0) {
        const out = differOutgoing[0];

        const call = new Notification(`${out.target.firstName} просит вернуть долг`, {
          body: `${out.description} : ${out.amount} руб.`,
          icon: 'https://goo.gl/3eqeiE',
        });
      }
    }

    setTimeout(() => this.getNotifications(), 5000);

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
