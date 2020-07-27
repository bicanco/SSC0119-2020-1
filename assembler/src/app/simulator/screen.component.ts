import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-screen',
  template: `<div class="d-flex justify-content-center py-4">
    <canvas #canvas width="800px" height="600px"></canvas>
  </div>`,
})
export class ScreenComponent implements OnInit {
  @ViewChild('canvas', { static: true }) private canvas: ElementRef;

  private char_: string;
  private x_: string;
  private write_: boolean;
  private context;

  ngOnInit() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.context.fillstyle = 'black';
    this.context.font = '40px serif';
    this.context.fillRect(0, 0, 800, 600);
  }

  set write(value: boolean) {
    this.write_ = value;
    this.draw();
  }

  set char(value: string) {
    this.char_ = value;
    this.draw();
  }

  set x(value: string) {
    this.x_ = value;
    this.draw();
  }

  private draw() {
    if (!this.write_) {
      return;
    }

    this.setColor();

    const text = String.fromCharCode(parseInt(this.char_.substring(8, 16), 2));
    const position = parseInt(this.x_, 2);

    this.context.fillText(text, (position % 40) * 2, Math.floor(position / 40)*2 + 40);
  }

  private setColor() {
    switch (this.char_.substring(0, 8)) {
      case '00000000':
        this.context.fillStyle = 'white';
        break;
      case '00010000':
        this.context.fillStyle = 'brown';
        break;
      case '00100000':
        this.context.fillStyle = 'green';
        break;
      case '00110000':
        this.context.fillStyle = 'olive';
        break;
      case '01000000':
        this.context.fillStyle = 'navy';
        break;
      case '01010000':
        this.context.fillStyle = 'purple';
        break;
      case '01100000':
        this.context.fillStyle = 'teal';
        break;
      case '01110000':
        this.context.fillStyle = 'silver';
        break;
      case '10000000':
        this.context.fillStyle = 'gray';
        break;
      case '10010000':
        this.context.fillStyle = 'red';
        break;
      case '10100000':
        this.context.fillStyle = 'lime';
        break;
      case '10110000':
        this.context.fillStyle = 'yellow';
        break;
      case '11000000':
        this.context.fillStyle = 'blue';
        break;
      case '11010000':
        this.context.fillStyle = 'pink';
        break;
      case '11100000':
        this.context.fillStyle = 'aqua';
        break;
      case '11110000':
        this.context.fillStyle = 'white';
        break;
    }
  }
}
