export interface Observer {
	update(action: string, details: any): void
}
