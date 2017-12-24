import { Component, OnInit, ViewChild } from '@angular/core';
import * as RecordRTC from 'recordrtc';
@Component({
  selector: 'app-rtc',
  templateUrl: './rtc.component.html',
  styleUrls: ['./rtc.component.css']
})
export class RtcComponent implements OnInit {
  @ViewChild('video') video: any;
  public recordRTC: RecordRTC;
  public stream: MediaStream;
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // set the initial state of the video
    let video:HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  startRecording() {
    let mediaConstraints = {
       audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
}
successCallback(stream: MediaStream) {
  var options = {
        mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 128000,
        bitsPerSecond: 128000 // if this line is provided, skip above two
      };
      this.stream = stream;
      this.recordRTC = RecordRTC(stream, options);
      this.recordRTC.startRecording();
      let video: HTMLVideoElement = this.video.nativeElement;
      video.src = window.URL.createObjectURL(stream);
      this.toggleControls();
    }
    toggleControls() {
      let video: HTMLVideoElement = this.video.nativeElement;
      video.muted = !video.muted;
      video.controls = !video.controls;
      video.autoplay = !video.autoplay;
    }
    stopRecording() {
      let recordRTC = this.recordRTC;
      recordRTC.stopRecording(this.processVideo.bind(this));
      let stream = this.stream;
      stream.getAudioTracks().forEach(track => track.stop());
      stream.getVideoTracks().forEach(track => track.stop());
    }
    processVideo(audioVideoWebMURL) {
      let video: HTMLVideoElement = this.video.nativeElement;
      let recordRTC = this.recordRTC;
      video.src = audioVideoWebMURL;
      this.toggleControls();
      var recordedBlob = recordRTC.getBlob();
      recordRTC.getDataURL(function (dataURL) { });
    }
    download() {
      this.recordRTC.save('video.webm');
    }
    errorCallback(stream: MediaStream){
      console.log(stream);
    }
}
