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

    const osm = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    const toner = new ol.layer.Tile({
      source: new ol.source.OSM({ url: 'http://tile.stamen.com/toner/{z}/{x}/{y}.png' })
    });
    const watercolour = new ol.layer.Tile({
      source: new ol.source.OSM({ url: 'http://tile.stamen.com/watercolor/{z}/{x}/{y}.png' })
    });


    const topo = new ol.layer.Tile({
      source: new ol.source.OSM({ url: 'http://tile.stamen.com/terrain-labels/{z}/{x}/{y}.png' })
    });




    this.map = new ol.Map({
      target: 'map',
      layers: [toner, topo

        // ,

        // new ol.layer.Graticule({
        //   // the style to use for the lines, optional.
        //   strokeStyle: new ol.layer.Stroke({
        //     color: 'rgba(255,120,0,0.9)',
        //     width: 2,
        //     lineDash: [0.5, 4]
        //   }),
        //   showLabels: true,
        //   wrapX: false
        // })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 12
      })
    });
    this.addallpoints();
  }

  add_map_point(lat: string, lng: string, txt: string) {
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
        }),
        text: new ol.style.Text({
          text: txt,
          scale: 2.2,
          fill: new ol.style.Fill({
            color: '#fff'
          }),
          stroke: new ol.style.Stroke({
            color: '0',
            width: 3
          })
        })
      })
    });

    this.map.addLayer(vectorLayer);
  }
  addallpoints() {
    this.detectorService.getAll()
      .subscribe(
        (detectors: string) => {
          detectors.Detectorlist.forEach((element: number) => {
            this.detectorService.getByID(element).subscribe(
              (parsed: string) => {
                const tempress = parsed.temppress;
                // tslint:disable-next-line: no-bitwise
                const temp = tempress & 0xFFFFF;
                console.log(parsed);
                this.add_map_point(parsed.Lat, parsed.Lon, temp.toString());
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
