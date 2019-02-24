class Task {
    constructor(
        id,
        title,
        completed,
        dueDate,
        fileName,
        realFileName
    ) {
        this.id = id;
        this.title = title;
        this.completed = completed;
        this.dueDate = dueDate;
        this.fileName = fileName;
        this.realFileName = realFileName;
     }
}

module.exports = Task;