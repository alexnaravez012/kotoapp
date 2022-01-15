import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';

declare var H: any;

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.scss'],
})
export class HereMapComponent implements OnInit {

  constructor() { }

  @ViewChild("map")
  public mapElement: ElementRef;

  @Input()
  public appId: any;

  @Input()
  public appCode: any;

  @Input()
  public lat: any;

  @Input()
  public lng: any;

  private platform: any;
  private defaultLayers: any;
  private map: any;

  public ngOnInit() {
    this.Reload();
    //this.router = this.platform.getRoutingService();
  }

  public async reverseGeocode(position:any){
      return new Promise((resolve, reject) => {
          var geocoder = this.platform.getGeocodingService();
          geocoder.reverseGeocode(
              {
                  mode: "retrieveAddresses",
                  maxresults: 1,
                  prox: position.coords.latitude + "," + position.coords.longitude
              }, data => {
                  resolve(data);
              }, error => {
                  reject(error);
              }
          );
      })
  }

  public Resize(){
      this.map.getViewPort().resize();
  }

  public Reload(){
    this.platform = new H.service.Platform({
      // "app_id": this.appId,
      // "app_code": this.appCode,
      apikey:"UIoqjswUAwxj-SQfmmLsfc_un9p_oynEKo5dU0co-7Q"
    });
    this.defaultLayers = this.platform.createDefaultLayers();
  }

  public GetCenter(){
      if(this.map != null){
          return this.map.getCenter();
      }
      else{
          return {lat:0,lng:0};
      }
  }

  public SetCenter(centro){
    this.map.setCenter(centro);
    this.map.setZoom(16);
  }

  public async SearchAddress(address:string){
    var geocoder = this.platform.getGeocodingService();
    let geocodingParameters = {
          searchText: address,
          jsonattributes : 1
        };
    return await new Promise(resolve => {
      geocoder.geocode(
          geocodingParameters,
          (result) => {
            resolve([true,result.response.view]);
          },
          (error) => {
            resolve([false,error]);
          }
      );
    });
  }

  public ngAfterViewInit() {
    setTimeout(() => {
      this.map = new H.Map(
          this.mapElement.nativeElement,
          this.defaultLayers.vector.normal.map,
          {
            zoom: 5,
            center: { lat: this.lat, lng: this.lng }
          }
      );
      let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    }, 100);
  }

  public async ReturnWhenReady(){
    while(1==1){
      await new Promise(resolve => setTimeout(resolve, 100));
      if(this.map != null){break;}
    }
    return true;
  }

  async SetRoute(lat1,lng1,lat2,lng2){
    return new Promise<number>((resolve, reject) => {
      var router = this.platform.getRoutingService(),
          routeRequestParams = {
            mode: 'fastest;bicycle;traffic:disabled',
            representation: 'display',
            routeattributes: 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
            waypoint0: lat1+','+lng1, // Brandenburg Gate
            waypoint1: lat2+','+lng2  // Friedrichstraße Railway Station
          };
      router.calculateRoute(
          routeRequestParams,
          value =>{
            // console.log("calculateRoute es ")
            // console.log(value)
            let tempDistance;
            try {
              tempDistance = value.response.route[0].summary.distance;
            }catch (e) {
              tempDistance = -1;
            }
            try {
              this.addRouteShapeToMap(value.response.route[0]);
              //addManueversToMap(value.response.route[0]);
            }catch (e) {
              console.log(e)
            }
            resolve(tempDistance);
          },
          error =>{
            console.log("calculateRoute error es ")
            console.log(error)
            resolve(-1);
          }
      );
    })
  }

  addRouteShapeToMap(route){
    var lineString = new H.geo.LineString(),
        routeShape = route.shape,
        polyline;

    routeShape.forEach(function(point) {
      var parts = point.split(',');
      lineString.pushLatLngAlt(parts[0], parts[1]);
    });

    polyline = new H.map.Polyline(lineString, {
      style: {
        lineWidth: 4,
        strokeColor: 'rgba(0, 128, 255, 0.7)'
      }
    });
    // Add the polyline to the map
    this.map.addObject(polyline);
    // And zoom to its bounding rectangle
    // this.map.getViewModel().setLookAtData({
    //   bounds: polyline.getBoundingBox()
    // });
  }


  /**
   * Creates a series of H.map.Marker points from the route and adds them to the map.
   * @param {Object} route  A route as received from the H.service.RoutingService
   */
  // addManueversToMap(route){
  //   var svgMarkup = '',
  //       dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
  //       group = new  H.map.Group(),
  //       i,
  //       j;
  //
  //   // Add a marker for each maneuver
  //   for (i = 0;  i < route.leg.length; i += 1) {
  //     for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
  //       // Get the next maneuver.
  //       maneuver = route.leg[i].maneuver[j];
  //       // Add a marker to the maneuvers group
  //       var marker =  new H.map.Marker({
  //             lat: maneuver.position.latitude,
  //             lng: maneuver.position.longitude} ,
  //           {icon: dotIcon});
  //       marker.instruction = maneuver.instruction;
  //       group.addObject(marker);
  //     }
  //   }
  //
  //   group.addEventListener('tap', function (evt) {
  //     map.setCenter(evt.target.getGeometry());
  //     openBubble(
  //         evt.target.getGeometry(), evt.target.instruction);
  //   }, false);
  //
  //   // Add the maneuvers group to the map
  //   map.addObject(group);
  // }

  //CosasGrupoMarcadores
  ListadoMarcadores = [];
  GrupoMarcadores = null;

  public SetMarker(pos,idMarker){
    this.GrupoMarcadores = new H.map.Group();
    this.ListadoMarcadores.push(new H.map.Marker(pos));
    this.GrupoMarcadores.addObjects(this.ListadoMarcadores);
    this.map.addObject(this.GrupoMarcadores);
  }

  public CentrarMapaEnMarcadores(){
    this.map.getViewModel().setLookAtData({
      bounds: this.GrupoMarcadores.getBoundingBox()
    });
    setTimeout(() => {
      let CZoom = this.map.getZoom();
      this.map.setZoom(CZoom*0.9);
    }, 400);
  }

  public ClearMarkers(){
    this.ListadoMarcadores = [];
    this.GrupoMarcadores = new H.map.Group();
  }
}
