import { Component } from '@angular/core';
import {NavController} from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import {AlertController} from '@ionic/angular';
import { GroceriesServiceService } from '../groceries-service.service';
import { InputDialogServiceService } from '../input-dialog-service.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  items: any = [];
  errorMessage: string;
  title='Grocery List';
  
  constructor(public navController: NavController, public toastController: ToastController, public alertController: AlertController, public dataService: GroceriesServiceService, public inputDialogService: InputDialogServiceService,private socialSharing: SocialSharing) {
    this.loadItems();
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems().subscribe(items => this.items = items, error => this.errorMessage = <any>error);
  }

  async removeItem(item, index) {
    console.log('Removing Item-', item, index);
    const toast= await this.toastController.create({
      message: 'Removing Item: ' + item.name + ' ...',
      duration: 3000
    });
    toast.present();

    this.dataService.removeItem(index);
  }

  async shareItem(item, index) {
    console.log('Sharing Item-', item, index);
    const toast= await this.toastController.create({
      message: 'Sharing Item: ' + item.name + ' ...',
      duration: 3000
    });
    toast.present();

    let message= "Grocery Item - Name: " + item.name + " - Quantity: " + item.Quantity;
    let subject= "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Success!
      console.log("Shared successfully!");
    }).catch((error) => {
      console.log("Error while sharing", error);
      // Error!
    });

  }

  async editItem(item, index) {
    console.log('Edited Item-', item, index);
    const toast= await this.toastController.create({
      message: 'Editing Item: ' + item.name + ' ...',
      duration: 3000
    });
    toast.present();
    this.inputDialogService.showPrompt(item, index);
  }

  async addItem() {
    console.log('Adding Item');
    this.inputDialogService.showPrompt();
  }
}
