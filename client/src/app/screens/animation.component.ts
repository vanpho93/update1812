import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-animation',
    template: `
        <p>Animation component</p>
        <div *ngFor="let user of users">
            <div
                [@userAnim]="user.active ? 'active' : 'inactive'"
                (click)="user.active = !user.active"
            >
                <p>Name: {{ user.name }}</p>
            </div>    
        </div>
    `,
    styles: [],
    animations: [
        trigger('userAnim', [
            state('active', style({
                backgroundColor: 'white'
            })),
            state('inactive', style({
                backgroundColor: 'gray'
            })),
            transition('inactive => active', animate('1000ms ease-in')),
            transition('active => inactive', animate('1000ms ease-out')),
        ])
    ]
})

export class AnimationComponent {
    users = [
        { name: 'Ti', active: true },
        { name: 'Teo', active: false },
        { name: 'Tun', active: true },
        { name: 'Tuan', active: false },
    ]
}
