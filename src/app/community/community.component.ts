import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Community} from '../shared/Community';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  dataLoaded = false;
  showCreateButton = true;
  formCreated = false;
  communityForm: FormGroup;
  communityToSubmit: Community;
  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Обязательное поле.',
      'minlength': 'Поле должно содержать не менее 2 символов',
      'maxlength': 'Поле должно содержать менее 25 символов'
    }
  };
  communities: Community[];


  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
  }

  ngOnInit() {
    if (localStorage.getItem('currentUser') === null) {
      // window.location.href = 'http://localhost:4200';
      window.location.href = 'https://airatiki.github.io/Debt-Off';
    }
    this.getCommunities();
  }

  getCommunities() {
    this.userservice.getCommunities()
      .subscribe(data => {
        this.dataLoaded = true;
        this.communities = data;
      }, error => {
        console.log(error);
      });
  }

  onClickCommunity(community) {
    this.router.navigate([`/home/communityinfo/${community.id}/${community.name}`], { relativeTo: this.route });
  }

  createCommunity() {
    this.createForm();
    this.showCreateButton = false;
  }

  createForm() {
    this.formCreated = true;
    this.communityForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]]
    });

    this.communityForm.valueChanges.subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.communityForm) { return; }
    const form = this.communityForm;

    for (const field in this.formErrors) {
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  onSubmit() {
    this.communityToSubmit = this.communityForm.value;
    this.cancelButton();

    this.userservice.createCommunity(this.communityToSubmit.name)
      .subscribe(response => {
          this.communityForm.reset({});
          this.ngOnInit();
        },
        error => {
          console.log(error);
        });
  }

  cancelButton() {
    this.formCreated = false;
    this.showCreateButton = true;
  }

}
