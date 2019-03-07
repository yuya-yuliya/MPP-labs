import { Component, OnInit } from "@angular/core";
import { Task } from "../models/task";
import { TaskService } from "../services/task.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"]
})
export class MainPageComponent implements OnInit {
  tasks: Task[];
  visibleTasks: Task[];
  filter: boolean;
  editPanel: boolean;
  existed = false;
  task: Task;
  attachedFile;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.getTasks();
    this.editPanel = false;
  }

  getTasks() {
    this.taskService.getTasks().subscribe(t => {
      this.tasks = t;
      this.visibleTasks = this.tasks;
    });
  }

  onFilterChange(filterValue) {
    if (filterValue != "undefined") {
      this.filter = filterValue == "true";
    } else {
      this.filter = undefined;
    }
    this.visibleTasks = this.filterChange(this.filter);
  }

  onDelete(taskId: string) {
    this.taskService.deleteTask(taskId).subscribe(o => {
      this.filter = undefined;
      const index: number = this.tasks.findIndex(value => value._id == taskId);
      if (index != -1) {
        this.tasks.splice(index, 1);
        this.visibleTasks = this.tasks;
      }
      this.onEditClose();
    });
  }

  onStatusChange(taskId: string, completed: boolean) {
    this.taskService.setTaskStatus(taskId, completed).subscribe(o => {
      const index: number = this.tasks.findIndex(value => value._id == taskId);
      if (index != -1) {
        this.tasks[index].completed = completed;
        this.visibleTasks = this.filterChange(this.filter);
      }
    });
  }

  onEdit(taskId: string) {
    this.task = this.tasks.find(value => value._id === taskId);
    this.existed = true;
    this.editPanel = true;
  }

  filterChange(filterValue: boolean): Task[] {
    if (filterValue != undefined) {
      return this.tasks.filter(value => value.completed == filterValue);
    } else {
      return this.tasks;
    }
  }

  onTaskAdd() {
    this.editPanel = true;
    this.existed = false;
    this.task = new Task("", "", false, new Date(), "", "");
  }

  onEditClose() {
    this.editPanel = false;
    this.existed = false;
    this.attachedFile = undefined;
  }

  onSubmit() {
    if (!this.existed) {
      this.taskService.addTask(this.task, this.attachedFile).subscribe(task => {
        this.tasks.push(task);
        this.onEditClose();
      });
    } else {
      this.taskService
        .updateTask(this.task, this.attachedFile)
        .subscribe(task => {
          let index = this.tasks.findIndex(value => value._id === task._id);
          this.tasks[index] = task;
          this.onEditClose();
        });
    }
  }

  onFileChange(event) {
    this.attachedFile = event.target.files.item(0);
  }

  onDownload(taskId: String) {
    let task = this.tasks.find(value => value._id == taskId);

    if (task != undefined) {
      this.taskService.downloadFile(task.realFileName).subscribe(data => {
        saveAs(data, task.fileName);
      });
    }
  }

  onFileRemove(taskId: String) {
    this.taskService.removeFile(taskId).subscribe(o => {
      let task = this.tasks.find(value => value._id == taskId);
      task.fileName = undefined;
      task.realFileName = undefined;
    });
  }
}
