class Task {
  constructor({
    title = "",
    time = 0,
    uid = uuidv4(),
    isRunning = false,
    elem = null
  }) {
    this.title = title;
    this.time = time;
    this.uid = uid;
    this.isRunning = isRunning;
    this.elem = elem;
  }

  setTime(time) {
    this.time = time;
  }

  updateTime() {
    $(`#task-${this.uid}`)
      .find(".task-time")
      .html(utils.formatTime(this.time));
  }

  toggleRunningElem(run) {
    setTimeout(() => {
      run
        ? $(`#task-${this.uid}`).addClass("task-running")
        : $(`#task-${this.uid}`).removeClass("task-running");
    }, 0);
  }

  createTaskElem() {
    this.elem = `<li id="task-${this.uid}" class="task">
    <span class="task-title">${this.title}</span>
    <span class="task-time">${utils.formatTime(this.time)}</span>
  </li>`;
  }

  startRunning() {
    this.isRunning = true;
    this.toggleRunningElem(true);
  }

  stopRunning() {
    this.isRunning = false;
    this.toggleRunningElem(false);
  }
}
