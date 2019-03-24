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
  filter: boolean;
  editPanel: boolean;
  selectedIndex: number;

  constructor(private taskService: TaskService) {}

  get visibleTasks(): Task[] {
    if (this.filter !== undefined) {
      return this.tasks.filter(task => task.completed == this.filter);
    } else {
      return this.tasks;
    }
  }

  ngOnInit() {
    this.getTasks();
    this.editPanel = false;
  }

  editHide(value: boolean) {
    this.editPanel = value;
  }

  getTasks() {
    this.taskService.getTasks().subscribe(
      t => {
        this.tasks = t;
        this.filter = undefined;
      },
      error => {
        this.tasks = [
          new Task("1", "my", false, new Date(), undefined, undefined)
        ];
      }
    );
  }

  onFilterChange(filterValue) {
    if (filterValue != "undefined") {
      this.filter = filterValue == "true";
    } else {
      this.filter = undefined;
    }
  }

  onStatusChange(taskId: string, completed: boolean) {
    this.taskService.setTaskStatus(taskId, completed).subscribe(o => {
      const index: number = this.tasks.findIndex(value => value._id == taskId);
      if (index != -1) {
        this.tasks[index].completed = completed;
      }
    });
  }

  onEdit(taskId: string) {
    this.selectedIndex = this.tasks.findIndex(value => value._id === taskId);
    this.editPanel = true;
  }

  onTaskAdd() {
    this.editPanel = true;
    this.selectedIndex = -1;
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
