import { Component, Input } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-header-app',
  standalone: true,
  imports: [
    MatToolbarModule
    ],
  templateUrl: './header-app.component.html',
  styleUrl: './header-app.component.css'
})
export class HeaderAppComponent {
  
  @Input() color!:string;
  @Input() text!:string;

}
