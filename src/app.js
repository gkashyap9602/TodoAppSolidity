const App = {
  // Calling each function of todolist
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.rendertasks();
    await App.RenderCompletedTasks();
    // await App.MoveTasks();
    App.DeleteTasks;
    console.log("app is loading.....");
  },
  loadWeb3: async () => {
    // Creating Instance Of Web3
    if (window.ethereum) {
      App.web3Provider = new Web3(Web3.givenProvider);
      console.log(App.web3Provider);
    } else {
      //If Metamask Not Installed Or Not Connected
      window.alert("please connect metamask");
    }
  },
  loadAccount: async () => {
    try {
      // Request account access if needed
      App.account = await ethereum.request({ method: "eth_accounts" });
      console.log(App.account);
    } catch (error) {
      console.log("account_error", error);
    }
  },
  //Load Function for Solidity Contracts from Blockchain
  loadContract: async () => {
    try {
      const todojson = await fetch("../build/contracts/TodoList.json");
      const todolist = await todojson.json();
      const networkid = Object.keys(todolist.networks)[0];
      const contractAddress = todolist.networks[networkid].address;
      //  Creating Contract Instance For Solidity functions
      App.NewContractt = new App.web3Provider.eth.Contract(
        todolist.abi,
        contractAddress
      );
      console.log(App.NewContractt, "newcontract");
    } catch (error) {
      console.log("load_contract_error", error);
    }
  },
  //Add tasks in todolist on Blockchain
  addtasks: async () => {
    try {
      let item = document.getElementById("additem").value;
      console.log(item);
      if (item == "") {
        document.getElementById("error").innerHTML = "Please Add Something";
      } else {
        const result = await App.NewContractt.methods.createTasks(item).send({
          from: App.account[0],
          gas: 0x93990,
        });
        console.log(result);
      }
      document.getElementById("additem").value = "";
    } catch (error) {
      console.log("addtask_error", error);
    }

    // window.location.reload();
  },
  // Render Stored tasks from Blockchain to first nav tab
  rendertasks: async () => {
    try {
      const taskcount = await App.NewContractt.methods.taskcount().call();
      console.log(taskcount);
      // rendering task from blockchain using taskcount
      for (let i = 1; i <= taskcount; i++) {
        console.log(taskcount, "taskcount");

        const tasks = await App.NewContractt.methods.tasks(i).call();
        console.log(tasks);

        if (tasks.content == "") {
          console.log("content is blank");
        } else {
          //   console.log(tasks.content,"tasks and p");
          const taskid = parseInt(tasks[0]);
          const taskcontent = tasks[1];
          const taskcomplete = tasks[2];
          //  Creating a button to delete tasks
          let removebtn = document.createElement("i");
          removebtn.className = "fa fa-trash";
          removebtn.name = taskid;
          removebtn.id = "btnremove";
          // creating checkbox for each new task
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.innerHTML = "checkme";
          checkbox.className = "checkingbox";
          checkbox.id = taskid;
          // tasklist.appendChild(checkbox)
          // creating li for each new task
          let li = document.createElement("li");
          li.innerHTML = taskcontent;
          li.className = "listitem";
          li.appendChild(removebtn);
          li.appendChild(checkbox);
          tasklist.appendChild(li);
          //Sortable tasks
          const dragarea = document.querySelector("#tasklist");
          new Sortable(dragarea, {
            animation: 150,
          });
          // Trigger Sweet Alert On Click Event
          removebtn.addEventListener("click", function (e) {
            swal({
              title: "Are you sure?",
              text: "You will not be able to recover this imaginary file!",
              icon: "warning",
              buttons: ["No, cancel it!", "Yes, I am sure!"],
              dangerMode: true,
            }).then(function (isConfirm) {
              if (isConfirm) {
                App.DeleteTasks(e);
              } else {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
              }
            });
          });
          // add event listner on checkbox to move completed task to anoth list
          checkbox.addEventListener("change", function (e) {
            if (this.checked) {
              const li = e.target.parentNode;
              li.innerHTML = `<del> taskdone <del>`;
              App.MoveTasks(e);
              console.log("Checkbox is checked..");
            } else {
              console.log("Checkbox is not checked..");
            }
          });
        }
      }
    } catch (error) {
      console.log("render_task_error" + error);
    }
  },
  // delete tasks from todolist
  DeleteTasks: async (event) => {
    try {
      const taskidd = event.target.name;
      console.log(taskidd);
      const taskdone = await App.NewContractt.methods.taskStatus(taskidd).send({
        from: App.account[0],
        gas: 0x93990,
      });
      console.log(taskdone);
      let li = event.target.parentNode;
      tasklist.removeChild(li);
    } catch (error) {
      console.log("delete_task_error", error);
    }

    // window.location.reload();
  },
  MoveTasks: async (e) => {
    const checkid = e.target.id;
    console.log(checkid, "checkbox id");
    const counttaskid = await App.NewContractt.methods
      .completedTasks(checkid)
      .send({
        from: App.account[0],
        gas: 0x93990,
      });
  },
  //   render completed tasks to second nav tab
  RenderCompletedTasks: async () => {
    try {
      const counttaskid = await App.NewContractt.methods.taskidCount().call();
      console.log(counttaskid);
      // rendering task from blockchain using taskcount
      for (let i = 1; i <= counttaskid; i++) {
        const tasks = await App.NewContractt.methods.complTask(i).call();
        console.log(tasks);
        const taskid = parseInt(tasks[0]);
        const taskcontent = tasks[1];
        const taskcomplete = tasks[2];
        //  Creating a button to delete tasks
        let removebtn = document.createElement("i");
        removebtn.className = "fa fa-trash";
        removebtn.name = taskid;
        removebtn.id = "btnremove";
        // creating li for each new task
        let li = document.createElement("li");
        li.innerHTML = taskcontent;
        li.className = "listitem";
        li.id = "listid";
        li.appendChild(removebtn);
        //   li.appendChild(checkbox)
        completedTasks.appendChild(li);
        //Sortable tasks
        //   const dragarea = document.querySelector('#completedTasks')
        //   new Sortable(dragarea,{
        //       animation:150,
        //   })
        // Trigger Sweet Alert On Click Event
        removebtn.addEventListener("click", function (e) {
          swal({
            title: "Are you sure?",
            text: "You will not be able to recover this imaginary file!",
            icon: "warning",
            buttons: ["No, cancel it!", "Yes, I am sure!"],
            dangerMode: true,
          }).then(function (isConfirm) {
            if (isConfirm) {
              // App.DeleteTasks(e);
            } else {
              swal("Cancelled", "Your imaginary file is safe :)", "error");
            }
          });
          // }
        });
      }
    } catch (error) {
      console.log("render_task_error" + error);
    }

    console.log("completed tasks");
  },
};

window.addEventListener("load", (event) => {
  App.load();
});
