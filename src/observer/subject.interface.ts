import { Observer } from './observer.interface'

export interface Subject {
	attach(observer: Observer): void
	detach(observer: Observer): void
	notify(action: string, details: any): void
}
