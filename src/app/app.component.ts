import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'slider';
  // monthlyAmount=[5];
  monthlyAmount=[5,10,20,30,40,50,55];
  sliderValueChange(value: number) {
    console.log(value)
  }
}
