const app = (function() {
  return {
    init() {
      const $form = $("#js-new-task-form");
      const $input = $form.find("input");
      const $title = $("#js-title");
      const $total = $("#js-total");
      const $list = $("#js-list");

      // Messaging listeners
      chrome.runtime.onMessage.addListener(function(msg) {
        switch (msg.type) {
          case "UPDATE":
            const runningTask = tasks.find(t => t.isRunning);
            if (!runningTask) {
              break;
            }
            runningTask.time = msg.seconds;
            runningTask.startRunning();
            runningTask.updateTime();
            tasks.forEach((t, index) => {
              if (t.uid === runningTask.uid) {
                tasks[index] = runningTask;
                storage.set("tasks", { tasks });
              }
            });
            break;
        }
      });

      // Get tasks from storage
      const data = getTasksFromStorage();

      // Tasks
      let tasks = data ? data.tasks : [];
      app.tasks = tasks;

      // Attach protoype objects to tasks saved in storage
      tasks = tasks.map(t => new Task(t));

      // Render tasks list from tasks saved in storage
      renderTasksFromStorage(tasks);

      // Get seconds from background page
      requestForTime();

      // Set today's date
      setToday();

      // Handle form submit
      $form.on("submit", function(evt) {
        evt.preventDefault();

        // Stop all other tasks
        tasks.length && tasks.forEach(task => task.stopRunning());
        // Tell background page to stop the timer
        signalToStop();

        // Create a new task
        const newTask = new Task({
          title: $input.val(),
          time: 0
        });
        // Create new task DOM
        newTask.createTaskElem();
        // Start the task in DOM
        newTask.startRunning();

        // Add it to storages
        tasks.push(newTask);
        storage.set("tasks", { tasks });

        // Signal background page to start the timer
        signalToStart();
        // Add it to list
        addTask(newTask);
        // Reset input
        $input.val("");
      });

      // Add task to tasks list in DOM
      function addTask(task) {
        $list.prepend($(task.elem));
      }

      // Get tasks from storage
      function getTasksFromStorage() {
        return storage.get("tasks");
      }

      // Render tasks from storage
      function renderTasksFromStorage(tasks) {
        tasks.forEach(task => {
          task.createTaskElem();
          addTask(task);
        });
      }

      // Set today's date
      function setToday() {
        $title.html(utils.today());
      }

      // Get seconds from background page
      function requestForTime() {
        chrome.runtime.sendMessage({
          type: "UPDATE"
        });
      }

      // Signal to background page to start the timer
      function signalToStart() {
        chrome.runtime.sendMessage({
          type: "START"
        });
      }

      // Signal to background page to stop the timer
      function signalToStop() {
        chrome.runtime.sendMessage({
          type: "STOP"
        });
      }
    }
  };
})();
