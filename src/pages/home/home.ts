import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

declare var google;
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
 
  @ViewChild('map') mapElement: ElementRef;
  
  map: any;
  me: any;
  path12=[];

  markers=[];
  
  k:any;
  i: any;
    lat=[11.250405, 11.243746, 11.218712, 11.228505, 11.240194, 11.2408389];
    longi=[-74.197946,-74.211167, -74.237991,-74.177334, -74.196328,-74.21567909999]
  loc= [
    ['Energesis Natura', 11.2408389, -74.21567909999, 7],
    ['Estatua del Pibe', 11.240194, -74.196328, 6],
    ['Quinta de SanPedro Alejandrino', 11.228505, -74.177334, 5],
    ['Playa Blanca', 11.218712, -74.237991, 3],
    ['Catedral de Santa Marta', 11.243746, -74.211167, 2],
    ['Casa', 11.250405, -74.197946, 1]
  ];
  constructor(public navCtrl: NavController, public geolocation: Geolocation, private alertCtrl: AlertController) {
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      let mylatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: mylatLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    },
    (err) => {
      console.log(err);
    });
  }
  
  addMarker(){
    let i;
    var poly = new Array();
    for(this.i=0; this.i<this.loc.length; this.i++){
      let lugares= this.loc[this.i][0]
      let content = '<p> Posición: ' + lugares + '</p>'
      let marker = new google.maps.Marker({
        position: new google.maps.LatLng(this.loc[this.i][1], this.loc[this.i][2]),
        map: this.map
      });
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.setContent(content);
        infoWindow.open(this.map, marker);
      });
      var pos = new google.maps.LatLng(this.lat[this.i], this.longi[this.i])
      poly.push(pos);  
      this.markers.push(marker);    
    }
      console.log(poly);
      var path1 = new google.maps.Polyline({
      path: poly,
      geodesic: true,
      strokeColor: '#ff004c',
      strokeOpacity: 1.0,
      strokeWeight: 5
      });

      let lenght2 = (google.maps.geometry.spherical.computeLength(path1.getPath())/1000).toFixed(2);
      console.log(lenght2)
    path1.setMap(this.map);
    this.path12.push(lenght2)
    //his.path12.push(path1);
    //this.AddPolylines(this.map);
    //this.RemovePoly(path1);
  }
    
    setMapAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
    }
    clearMarkers() {
    this.setMapAll(null);
    }
    deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
    }
    presentAlert(){
      //let lenght3 = lenght2
      let alert = this.alertCtrl.create({
          title: 'Trayectoria',
          message: 'El objetivo ha recorrido '+ this.path12 + ' kilometros',
          buttons: ['OK']
      });
      alert.present();
    }
}
