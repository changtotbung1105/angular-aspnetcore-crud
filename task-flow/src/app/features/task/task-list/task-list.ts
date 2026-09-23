import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Task } from '../../../core/task';

@Component({
  imports: [],
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})


export class TaskList { 
  taskService = inject(Task);
}
