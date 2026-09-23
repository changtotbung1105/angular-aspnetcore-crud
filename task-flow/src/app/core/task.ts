import { Injectable, signal, computed } from '@angular/core';
import { TaskItem } from '../shared/models/task.model';

@Injectable({ providedIn: 'root' })
export class Task {
  private readonly _tasks = signal<TaskItem[]>([
    { id: 1, title: 'Design schema', done: false },
    { id: 2, title: 'Wire up routing', done: true },
  ]);

  readonly tasks = this._tasks.asReadonly();
  readonly pending = computed(() => this._tasks().filter(t => !t.done));
  readonly completed = computed(() => this._tasks().filter(t => t.done));

  add(title: string) {
    this._tasks.update(list => [...list, { id: Date.now(), title, done: false }]);
  }

  toggle(id: number) {
    this._tasks.update(list =>
      list.map(t => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }
}