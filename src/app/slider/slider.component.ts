import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sliderLabel') sliderLabel!: ElementRef;
  @ViewChild('sliderContainer') sliderContainer!: ElementRef;
  @Input() ticks: Array<number> = [];
  @Input() index = 0;
  @Output() updateSliderValue = new EventEmitter<number>();
  activeItem: HTMLElement | any;
  dotMargin = 0;
  displayValue = 0;
  isSliding = false;
  oneTick = false;
  sliderLength = 0;
  sliderElement: HTMLElement | any;
  dotWidth = 5;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.displayValue = this.ticks[this.index];
    this.oneTick = this.ticks.length === 1;
  }

  ngAfterViewInit() {
    // Init dot margin
    // Fix issue: Calculate dotmargin before loaded
    // this.waitElement('#container').then(() => {
    //   this.initDynamicMargin();
    // });
    this.initDynamicMargin();
  }

  // Wait element until it is loaded
  // private waitElement(selector: string) {
  //   return new Promise<void>((resolve) => {
  //     if (document.querySelector(selector)) {
  //       resolve();
  //     }
  //     const observer = new MutationObserver((mutations) => {
  //       if (document.querySelector(selector)) {
  //         resolve();
  //         observer.disconnect();
  //       }
  //     });

  //     observer.observe(document.body, {
  //       childList: true,
  //       subtree: true,
  //     });
  //   });
  // }

  private initDynamicMargin() {
    this.sliderElement = document.getElementById('slider-container');
    if (this.sliderElement) {
      this.sliderLength = this.sliderElement.clientWidth;
      this.dotMargin =
        (this.sliderLength - this.dotWidth * this.ticks.length) /
        (this.ticks.length - 1);
      // this.activeItem = document.getElementById('sliderLabel');
      this.activeItem = this.sliderLabel.nativeElement;
      this.activeItem.xOffset = (this.dotMargin + this.dotWidth) * this.index;
      this.activeItem.currentX = this.activeItem.xOffset + this.dotWidth / 2;
      this.activeItem.style.transform = `translate3d(${
        this.activeItem.currentX
      }px, ${0}px, 0)`;

      this.bindEvents();
      this.changeDetectorRef.detectChanges();
    }
  }

  // Resize function to get dynamic dot margin when user change device resolution
  @HostListener('window:resize', ['$event']) onResize() {
    this.initDynamicMargin();
  }

  private pointerDown(event: any) {
    // Don't do anything if the slider is disabled or sliding
    if (this.oneTick || this.isSliding) {
      return;
    }
    this.dragStart(event);
    document.addEventListener('mouseup', this.dragEnd.bind(this), false);
    document.addEventListener('mousemove', this.drag.bind(this), false);
  }

  private bindEvents() {
    this.sliderElement = this.sliderContainer.nativeElement;
    // Bind touch event for mobile view
    this.sliderElement.addEventListener(
      'touchstart',
      this.dragStart.bind(this),
      false
    );
    this.sliderElement.addEventListener(
      'touchend',
      this.dragEnd.bind(this),
      false
    );
    this.sliderElement.addEventListener(
      'touchmove',
      this.drag.bind(this),
      false
    );
    // Bind mouse event for desktop
    this.sliderElement.addEventListener(
      'mousedown',
      this.pointerDown.bind(this),
      false
    );
  }

  private removeGlobalEvents() {
    document.removeEventListener('mouseup', this.dragEnd.bind(this), false);
    document.removeEventListener('mousemove', this.drag.bind(this), false);
    if (this.sliderElement) {
      this.sliderElement.removeEventListener(
        'mousedown',
        this.pointerDown.bind(this),
        false
      );
      this.sliderElement.removeEventListener(
        'touchstart',
        this.dragStart.bind(this),
        false
      );
      this.sliderElement.removeEventListener(
        'touchend',
        this.dragEnd.bind(this),
        false
      );
      this.sliderElement.removeEventListener(
        'touchmove',
        this.drag.bind(this),
        false
      );
    }
  }

  private dragStart(e: any) {
    this.isSliding = true;
    // this is the item we are interacting with
    // this.activeItem = document.getElementById('sliderLabel');
    this.activeItem = this.sliderLabel.nativeElement;
    if (this.activeItem) {
      if (!this.activeItem.xOffset) {
        this.activeItem.xOffset = 0;
      }

      if (e.type === 'touchstart') {
        this.activeItem.initialX =
          e.touches[0].clientX - this.activeItem.xOffset;
      } else {
        this.activeItem.initialX = e.clientX - this.activeItem.xOffset;
      }
    }
  }

  private dragEnd() {
    if (this.isSliding) {
      if (this.activeItem) {
        this.activeItem.initialX = this.activeItem.currentX;
      }
      this.isSliding = false;
      this.activeItem = null;
    }
    this.removeGlobalEvents();
  }

  private drag(e: any) {
    if (this.isSliding) {
      if (e.type === 'touchmove') {
        e.preventDefault();
        const offsetX = e.touches[0].clientX - this.activeItem.initialX;
        if (offsetX > 0 && offsetX < this.sliderLength) {
          this.activeItem.currentX = offsetX;
          this.index = Math.round(offsetX / (this.dotMargin + this.dotWidth));
        }
      } else {
        const offsetX = e.clientX - this.activeItem.initialX;
        if (offsetX > 0 && offsetX < this.sliderLength) {
          this.activeItem.currentX = offsetX;
          this.index = Math.round(offsetX / (this.dotMargin + this.dotWidth));
        }
      }
      const newValue = this.ticks[this.index];
      if (newValue !== this.displayValue) {
        this.displayValue = newValue;
        this.updateSliderValue.emit(this.displayValue);
      }
      this.activeItem.xOffset = (this.dotMargin + this.dotWidth) * this.index;
      this.activeItem.currentX = this.activeItem.xOffset;
      this.activeItem.style.transform = `translate3d(${
        this.activeItem.currentX + this.dotWidth / 2
      }px, ${0}px, 0)`;
    }
  }

  ngOnDestroy() {
    this.removeGlobalEvents();
  }
}
