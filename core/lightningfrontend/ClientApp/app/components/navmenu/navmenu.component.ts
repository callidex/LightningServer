import { Component } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons/faHome';
import { faSignature } from '@fortawesome/free-solid-svg-icons/faSignature';
import { faBroadcastTower } from '@fortawesome/free-solid-svg-icons/faBroadcastTower';

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
