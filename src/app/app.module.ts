import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';

import { NgxFaceApiJsModule } from 'ngx-face-api-js';
import { HomePage } from './home/home.page';


@NgModule({
  declarations: [AppComponent, HomePage],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), NgxFaceApiJsModule.forRoot({ modelsUrl: 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights',}), AppRoutingModule],
  providers: [
    MediaCapture,
    StatusBar,
    SplashScreen,
    AndroidPermissions,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}