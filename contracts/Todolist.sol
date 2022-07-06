// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
  uint256 public taskcount = 0;
  uint256 public taskidCount = 0;

  struct Task {
    uint256 id;
    string content;
    bool completed;
  }

  mapping(uint256 => Task) public tasks;
  mapping(uint256 => Task) public complTask;

  event TaskCompleted(uint256 id, bool completed);

  constructor() public {
    createTasks("hy guys");
  }

  function createTasks(string memory _content) public {
    taskcount++;
    tasks[taskcount] = Task(taskcount, _content, false);
  }

  function taskStatus(uint256 _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    tasks[_id] = _task;
    emit TaskCompleted(_id, _task.completed);
  }

  function MoveCompltTasks(uint256 _id) public {
    Task memory _task = tasks[_id];
    _task.completed = !_task.completed;
    if (_task.completed == false) {
      // taskcount = _id;
      // taskcount++;
      // tasks[taskcount] = _task;
      tasks[_id] = _task;
      emit TaskCompleted(_id, _task.completed);
      // delete complTask[_id];
    } else {
      taskidCount = _id;
      complTask[taskidCount] = _task;
      emit TaskCompleted(_id, _task.completed);
      // delete tasks[_id];
    }
  }

  function deleteCompleteTasks(uint256 _id) public {
    delete complTask[_id];
  }

  function deleteTasks(uint256 _id) public {
    delete tasks[_id];
  }
}
