import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { Item, Items } from './file-manager.types';

@Injectable({ providedIn: 'root' })
export class FileManagerService {

	// Private
	private _item: BehaviorSubject<Item | null> = new BehaviorSubject<Item | null>(null);
	private _items: BehaviorSubject<Items | null> = new BehaviorSubject<Items | null>(null);

	/**
	 * Constructor
	 */
	constructor(private _httpClient: HttpClient) {
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Accessors
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Getter for items
	 */
	get items$(): Observable<Items | null> {
		return this._items.asObservable();
	}

	/**
	 * Getter for item
	 */
	get file$(): Observable<Item | null> {
		return this._item.asObservable();
	}

	// -----------------------------------------------------------------------------------------------------
	// @ Public methods
	// -----------------------------------------------------------------------------------------------------

	/**
	 * Get items
	 */
	getItems(folderId: string | null = null): Observable<Item[]> {
		if (folderId === null) {
			return this._httpClient.get<Items>('api/apps/file-manager').pipe(
				tap((response: any) => {
					this._items.next(response);
				}),
			);
		} else {
			return this._httpClient.get<Items>('api/apps/file-manager', { params: { folderId } }).pipe(
				tap((response: any) => {
					this._items.next(response);
				}),
			);
		}
	}

	/**
	 * Get item by id
	 */
	getItemById(id: string): Observable<Item> {
		return this._items.pipe(
			take(1),
			map((items) => {
				// Find within the folders and files
				const item = [...items!.folders, ...items!.files].find(value => value.id === id) || null;

				console.log("file", item);
				// Update the item
				this._item.next(item);

				// Return the item
				return item;
			}),
			switchMap((item) => {
				if (!item) {
					throw new Error('Could not found the item with id of ' + id + '!');
				}

				return of(item);
			}),
		);
	}
}
