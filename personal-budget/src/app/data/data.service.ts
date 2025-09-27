import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface BudgetItem { title: string; budget: number; }

@Injectable({ providedIn: 'root' })
export class DataService {
  private readonly _items$ = new BehaviorSubject<BudgetItem[] | null>(null);

  constructor(private http: HttpClient) {}

  items$(): Observable<BudgetItem[] | null> { return this._items$.asObservable(); }
  get snapshot(): BudgetItem[] | null { return this._items$.value; }

  loadIfEmpty(): Observable<BudgetItem[]> {
    const cached = this._items$.value;
    if (cached) return of(cached);
    return this.http.get<{ myBudget: BudgetItem[] }>('/budget').pipe(
      map(res => res?.myBudget ?? []),
      tap(items => this._items$.next(items))
    );
  }
}
