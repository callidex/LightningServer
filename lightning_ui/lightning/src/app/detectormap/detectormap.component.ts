import { Component, OnInit } from '@angular/core';
import { DetectorService } from '../detector.service';
declare var ol: any;
@Component({
  selector: 'app-detectormap',
  templateUrl: './detectormap.component.html',
  styleUrls: ['./detectormap.component.css']
})
export class DetectormapComponent implements OnInit {

  constructor(private detectorService: DetectorService) { }
  map: any;
  nodes = [
    // tslint:disable-next-line: max-line-length
    '{    "id" : 3,    "FirstSeen" : "7/04/2020 11:27:30",  "LastSeen" : "7/04/2020 11:27:30",  "Lon" : 1.5322094726562500E+002,  "Lat" : -2.7560356140136719E+001,  "Height" : 9.5333000183105469E+001,  "udpcount" : 33559952,  "clktrim" : 107998450,  "adcpktssent" : 0,  "adctrigoff" : 31719,  "adcbase" : 2051,  "sysuptime" : 596760,  "netuptime" : 596738,  "gpsuptime" : 16944,  "majorversion" : 0,  "minorversion" : 6,  "noise" : 4,  "auxstatus1" : 3,  "adcudpover" : 24,  "trigcount" : 305,  "udpsent" : 293,  "peaklevel" : 0,  "jabcnt" : 0,  "temppress" : 505817900,  "epochsecs" : 1586258850,  "reserved1" : 0,  "reserved2" : 0,  "telltale1" : -557781506  }',
    // tslint:disable-next-line: max-line-length
    '{    "id" : 3,    "FirstSeen" : "7/04/2020 11:27:30",  "LastSeen" : "7/04/2020 11:27:30",  "Lon" : 1.5322084726562500E+002,  "Lat" : -2.7560356140136719E+001,  "Height" : 9.5333000183105469E+001,  "udpcount" : 33559952,  "clktrim" : 107998450,  "adcpktssent" : 0,  "adctrigoff" : 31719,  "adcbase" : 2051,  "sysuptime" : 596760,  "netuptime" : 596738,  "gpsuptime" : 16944,  "majorversion" : 0,  "minorversion" : 6,  "noise" : 4,  "auxstatus1" : 3,  "adcudpover" : 24,  "trigcount" : 305,  "udpsent" : 293,  "peaklevel" : 0,  "jabcnt" : 0,  "temppress" : 505817900,  "epochsecs" : 1586258850,  "reserved1" : 0,  "reserved2" : 0,  "telltale1" : -557781506  }',
    // tslint:disable-next-line: max-line-length
    '{    "id" : 3,    "FirstSeen" : "7/04/2020 11:27:30",  "LastSeen" : "7/04/2020 11:27:30",  "Lon" : 1.5322074726562500E+002,  "Lat" : -2.7560356140136719E+001,  "Height" : 9.5333000183105469E+001,  "udpcount" : 33559952,  "clktrim" : 107998450,  "adcpktssent" : 0,  "adctrigoff" : 31719,  "adcbase" : 2051,  "sysuptime" : 596760,  "netuptime" : 596738,  "gpsuptime" : 16944,  "majorversion" : 0,  "minorversion" : 6,  "noise" : 4,  "auxstatus1" : 3,  "adcudpover" : 24,  "trigcount" : 305,  "udpsent" : 293,  "peaklevel" : 0,  "jabcnt" : 0,  "temppress" : 505817900,  "epochsecs" : 1586258850,  "reserved1" : 0,  "reserved2" : 0,  "telltale1" : -557781506  }'
  ];


  ngOnInit() {
    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 12
      })
    });
    this.addallpoints();
  }

  add_map_point(lat: string, lng: string) {
    const vectorLayer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
        })]
      }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg'
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }
  addallpoints() {
    this.detectorService.getAll()
      .subscribe(
        (data: string) => {
          const detectors = JSON.parse(data);
          detectors.array.forEach((element: number) => {
            this.detectorService.getByID(element).subscribe(
              (detector: string) => {
                console.log(detector);
                const parsed = JSON.parse(detector);
                this.add_map_point(parsed.Lat, parsed.Lon);
                const view = this.map.getView();
                view.setCenter(ol.proj.fromLonLat([parsed.Lon, parsed.Lat]));
              }
            );
          });

        },
        error => { console.log(error); } // this.error = error // error path
      );
  }
}
