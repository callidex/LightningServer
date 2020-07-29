import { Component, OnInit } from '@angular/core';
import { DetectorService } from '../detector.service';
import { Detector } from '../detector.model';
import { DetectorList } from '../detector-list.model';
import { Strike } from '../strike.model';
import { Strikelist } from '../strikelist.model';
declare var ol: any;
@Component({
  selector: 'app-detectormap',
  templateUrl: './detectormap.component.html',
  styleUrls: ['./detectormap.component.css']
})
export class DetectormapComponent implements OnInit {

  constructor(private detectorService: DetectorService) { }
  detectorIcon = 'https://upload.wikimedia.org/wikipedia/commons/0/0c/RM-1.svg';
  // strikeIcon = 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Feather-weather-cloud-lightning.svg';

  strikeIcon = 'https://upload.wikimedia.org/wikipedia/commons/d/de/Lightningsymbol.svg';

  map: any;
  selectedDetector: Detector;
  detectors = new Array<Detector>();
  strikes = new Array<Strike>();
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

    const selectPoints = new ol.style.Style({
      image: new ol.style.Circle({
        fill: new ol.style.Fill({
          color: '#ff0000'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffccff'
        }),
        radius: 16
      })
    });

    const selectInteraction = new ol.interaction.Select({
      layers(layer) {
        return layer.get('selectable') === true;
      },
      style: selectPoints
    });

    this.map = new ol.Map({
      target: 'map',
      layers: [osm],
      view: new ol.View({
        center: ol.proj.fromLonLat([0, 0]),
        zoom: 12
      })
    });
    this.map.getInteractions().extend([selectInteraction]);
    this.addallpoints();
  }

  add_map_point(lat: string, lng: string, heat: string, txt: string, icon: string) {
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
          src: icon,
          opacity: 1 / (parseFloat(heat) / 100)
//          color: '#29f'
        }),
        // text: new ol.style.Text({
        //   text: txt,
        //   scale: 2.2,
        //   fill: new ol.style.Fill({
        //     color: '#fff'
        //   }),
        //   stroke: new ol.style.Stroke({
        //     color: '0',
        //     width: 3
        //   })
        // })
      })
    });
    vectorLayer.set('selectable', true);
    this.map.addLayer(vectorLayer);
  }
  public selectDetector(contact) {
    this.selectedDetector = contact;
  }
  addallpoints() {

    this.detectorService.getStrikes(10).subscribe(
      (s: Strikelist) => {
        this.strikes = s.Strikes;
        s.Strikes.forEach((strike: Strike) => {
          this.add_map_point(strike.lat, strike.lon, strike.heat, strike.linecount, this.strikeIcon);

        });
      }, error => { console.log(error); } // this.error = error // error path);
    );
    this.detectorService.getAll()
      .subscribe(
        (detectors: DetectorList) => {
          const arr = detectors.Detectorlist;
          arr.forEach((element: number) => {
            this.detectorService.getByID(element).subscribe(
              (parsed) => {
                const detector = new Detector(parsed);
                this.detectors.push(detector);
                this.add_map_point(detector.Lat, detector.Lon, '1', '', this.detectorIcon);
                this.map.getView().setCenter(ol.proj.fromLonLat([parsed.Lon, parsed.Lat]));
              }
            );
          });

        },
        error => { console.log(error); } // this.error = error // error path
      );
  }
}
