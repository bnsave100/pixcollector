import {
  Component,
  EventEmitter,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output, Renderer2,
  SimpleChanges
} from '@angular/core';
import Timeout = NodeJS.Timeout;

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() viewerPix;
  @Output() close = new EventEmitter<boolean>();
  @Output() slideTo = new EventEmitter<string>();
  href: string;
  controlsViewed: boolean = false;
  globalMousemoveListenFunc: Function;
  globalMousemoveStopInterval: Timeout;

  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.href = this.viewerPix.url;
    this.globalMousemoveStopInterval = setInterval(() => {
      this.controlsViewed = false;
    }, 3000);
    this.globalMousemoveListenFunc = this.renderer.listen('document', 'mousemove', e => {
      console.log(e);
      this.controlsViewed = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if ('viewerPix' in changes) {
      this.href = this.viewerPix.url;
    }
  }

  ngOnDestroy() {
    this.globalMousemoveListenFunc();
    clearInterval(this.globalMousemoveStopInterval);
  }

  public slideHandler(direction: 'left' | 'right'): void {
    this.slideTo.emit(direction);
  }

  public closeHandler(): void {
    this.close.emit();
  }

}
