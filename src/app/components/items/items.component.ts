import { Component, OnInit } from '@angular/core';
import { FirebaseService} from '../../services/firebase.service'
import { Item } from '../../models/item'
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit {
  items: Item[]
  editState: boolean = false;
  itemToEdit:Item;
  constructor(
    private firebaseService: FirebaseService)
     { 

     }

  ngOnInit() {
    // this.firebaseService.getItems().subscribe(items => {
    //   this.items = items;
    // });
  }

deleteItem(event, item: Item){
  this.clearState();
  this.firebaseService.deleteItem(item);
}

editItem(event, item: Item){
  this.editState = true;
  this.itemToEdit = item;
}
updateItem(item: Item){
  this.firebaseService.updateItem(item);
  this.clearState();
}
clearState(){
  this.editState = false;
  this.itemToEdit = null;
}

}
