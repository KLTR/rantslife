import { Component, OnInit } from '@angular/core';
import { FirebaseService} from '../../services/firebase.service'
import { Item } from '../../models/item'
@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
item: Item = {
  title: '',
  description: ''
}
  constructor(private firebaseService: FirebaseService) { }

  ngOnInit() {
  }

onSubmit(){
if(this.item.title != '' && this.item.title != ''){
  this.firebaseService.addItem(this.item);
  this.item.title = '';
  this.item.description = '';
}
}
}
