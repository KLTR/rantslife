import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-live-record',
  templateUrl: './live-record.component.html',
  styleUrls: ['./live-record.component.css']
})
export class LiveRecordComponent implements AfterViewInit {
  public stream: MediaStream;
  public recordRTC: RecordRTC;
  public isRecording: boolean = false
  public recordCompleted: boolean = false
  @ViewChild('audio') audio;
  constructor() { }

  ngAfterViewInit() {
    // set the initial state of the audio
    const audio: HTMLAudioElement = this.audio.nativeElement;
    audio.muted = false;
    audio.controls = true;
    audio.autoplay = false;
  }

  toggleControls() {
    const audio: HTMLAudioElement = this.audio.nativeElement;
    audio.muted = !audio.muted;
    audio.controls = !audio.controls;
    audio.autoplay = !audio.autoplay;
  }
  successCallback(stream: MediaStream) {

        const options = {
          mimeType: 'audio/webm', // or audio/webm\;codecs=h264 or audio/webm\;codecs=vp9
          audioBitsPerSecond: 128000,
          bitsPerSecond: 128000 // if this line is provided, skip above two
        };
        this.stream = stream;
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();
        const audio: HTMLAudioElement = this.audio.nativeElement;
        audio.src = window.URL.createObjectURL(stream);
        this.toggleControls();
      }

      errorCallback(err: Error) {
        return err;
      }

      processaudio(audioaudioWebMURL) {
        const audio: HTMLAudioElement = this.audio.nativeElement;
        const recordRTC = this.recordRTC;
        audio.src = audioaudioWebMURL;
        this.toggleControls();
        const recordedBlob = recordRTC.getBlob();
        recordRTC.getDataURL(function (dataURL) { });
      }
      startRecording() {
        this.isRecording = true;
        this.recordCompleted = false;
        navigator.mediaDevices
          .getUserMedia({audio: true})
          .then(this.successCallback.bind(this), this.errorCallback.bind(this));
      }
      stopRecording() {
        this.recordCompleted = true;
        this.isRecording = false;
        const recordRTC = this.recordRTC;
        recordRTC.stopRecording(this.processaudio.bind(this));
        const stream = this.stream;
        stream.getAudioTracks().forEach(track => track.stop());
        // Finished recording

      }
      download() {
        this.recordRTC.save('Rants.webm');
      }

}
