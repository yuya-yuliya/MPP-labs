import { Component, OnInit } from "@angular/core";
import { Task } from "../models/task";
import { TaskService } from "../services/task.service";
import { saveAs } from "file-saver";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { first } from "rxjs/operators";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.css"],
  providers: [TaskService]
})
export class MainPageComponent implements OnInit {
  tasks: Task[];
  filter: boolean;
  editPanel: boolean;
  selectedIndex: number;

  constructor(
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {
    this.taskService
      .onUnauthorized()
      .pipe(first())
      .subscribe(() => {
        this.userService.signout();
        this.router.navigate(["/signin"]);
      });
  }

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

  onDelete(taskId: string) {
    let index = this.tasks.findIndex(task => task._id == taskId);
    this.taskService
      .deleteTask(taskId)
      .pipe(first())
      .subscribe(flag => {
        if (flag) {
          this.tasks.splice(index, 1);
          this.editPanel = false;
        }
      });
  }

  signout() {
    this.userService.signout();
    this.router.navigate(["/signin"]);
  }

  editHide(value: boolean) {
    this.editPanel = value;
  }

  getTasks() {
    this.taskService
      .getTasks()
      .pipe(first())
      .subscribe(
        tasks => {
          this.tasks = tasks;
          this.filter = undefined;
        },
        error => {
          this.tasks = [
            new Task("1", "my", false, new Date(), undefined, undefined)
          ];
        }
      );
  }

  onFilterChange(filterValue: any) {
    if (filterValue != "undefined") {
      this.filter = filterValue == "true";
    } else {
      this.filter = undefined;
    }
  }

  onStatusChange(taskId: string, completed: boolean) {
    this.taskService
      .setTaskStatus(taskId, completed)
      .pipe(first())
      .subscribe(flag => {
        if (flag) {
          const index: number = this.tasks.findIndex(
            value => value._id == taskId
          );
          if (index != -1) {
            this.tasks[index].completed = completed;
          }
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
      this.taskService
        .downloadFile(task.realFileName)
        .pipe(first())
        .subscribe(data => {
          saveAs(data, task.fileName);
        });
    }
  }

  onFileRemove(taskId: String) {
    this.taskService
      .removeFile(taskId)
      .pipe(first())
      .subscribe(flag => {
        if (flag) {
          let task = this.tasks.find(value => value._id == taskId);
          task.fileName = undefined;
          task.realFileName = undefined;
        }
      });
  }
}
