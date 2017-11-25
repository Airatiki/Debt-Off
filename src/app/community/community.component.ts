import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Community} from '../shared/Community';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  submition = true;
  showCreateButton = true;
  formCreated = false;
  communityForm: FormGroup;
  community: Community;
  formErrors = {
    'name': ''
  };

  validationMessages = {
    'name': {
      'required': 'Name is required.',
      'minlength': 'Name must be at least 2 ch long',
      'maxlength': 'Name must be less than 25 ch long'
    }
  };
  communities: any[];
  selectedCommunity: Object = {};

  myControl: FormControl;

  options = [
    'One',
    'Two',
    'Three'
  ];

  filteredOptions: Observable<string[]>;


  constructor(private userservice: UserService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) {
    this.myControl = new FormControl();
  }

  ngOnInit() {
    this.getCommunities();
    this.filteredOptions = this.myControl.valueChanges
      .startWith(null)
      .map(val => val ? this.filter(val) : this.options.slice());
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  getCommunities() {
    this.userservice.getCommunities()
      .subscribe(data => {
        this.communities = data.json();
        console.log(this.communities);
      }, error => {
        console.log(error);
      });
  }

  onChange(community) {
    this.router.navigate(['/home/communityinfo/' + community.id], { relativeTo: this.route });
  }
  createCommunity() {
    this.createForm();
    this.showCreateButton = false;
    console.log('kek');
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
    this.community = this.communityForm.value;
    this.submition = false;
    this.userservice.createCommunity(this.community.name)
      .subscribe(response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });

    this.communityForm.reset({
      description: '',
      amount: ''
    });
  }

  cancelButton() {
    this.formCreated = false;
    this.showCreateButton = true;

  }

}
