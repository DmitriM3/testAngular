import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @Input() isExpanded: boolean | undefined;

  public routeLinks = [
    {link: "home", name: "Inicio", icon: "home"},
    {link: "persons", name: "Personas", icon: "people"},
    {link: "buses", name: "Colectivos", icon: "directions_bus"},
    {link: "trips", name: "Viajes", icon: "flight"},
  ];
}
