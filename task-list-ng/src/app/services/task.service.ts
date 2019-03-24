import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { Task } from "../models/task";

@Injectable({
  providedIn: "root"
})
export class TaskService {
  private url = environment.apiUrl + "api/tasks/";

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Array<Task>> {
    return this.http.get<Array<Task>>(this.url);
  }

  getTask(taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.url}${taskId}`);
  }

  addTask(task: Task, attachedFile: any): Observable<Task> {
    return this.http.post<Task>(this.url, this.getFormData(task, attachedFile));
  }

  updateTask(task: Task, attachedFile: any): Observable<Task> {
    return this.http.put<Task>(
      `${this.url}${task._id}`,
      this.getFormData(task, attachedFile)
    );
  }

  deleteTask(taskId: string): Observable<Object> {
    return this.http.delete<Task>(`${this.url}${taskId}`);
  }

  setTaskStatus(taskId: string, completedStatus: boolean): Observable<Object> {
    return this.http.put(
      `${this.url}${taskId}/status/${completedStatus}`,
      null
    );
  }

  downloadFile(originalFileName: String): Observable<Object> {
    return this.http.get(`${this.url}/download/${originalFileName}`, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    });
  }

  removeFile(taskId: String): Observable<Object> {
    return this.http.delete(`${this.url}${taskId}/removefile`);
  }

  private getFormData(task: Task, attachedFile: any): FormData {
    let formData = new FormData();
    formData.append("attachedFile", attachedFile);
    Object.getOwnPropertyNames(task).forEach(value => {
      formData.append(value, task[value]);
    });
    return formData;
  }
}
