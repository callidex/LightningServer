import { Component } from '@angular/core';
import { faBroadcastTower, faSignature, faHome } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.css']
})
export class NavMenuComponent {
    faBroadcastTower = faBroadcastTower;
    faSignal = faSignature;
    faHome = faHome;
}
