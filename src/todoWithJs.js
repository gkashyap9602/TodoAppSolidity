const App = {
  // Calling each function of todolist
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.rendertasks();
    App.btnenable();
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
  btnenable: async () => {
    let button = document.querySelector("#addbtn");
    button.disabled = true; //setting button state to disabled
    let input = document.getElementById("additem");
    input.addEventListener("change", stateHandle);

    function stateHandle() {
      if (input.value === "") {
        button.disabled = true;
      } else {
        button.disabled = false;
      }
    }
  },
  //Add tasks in todolist on Blockchain
  addtasks: async () => {
    try {
      let item = document.getElementById("additem").value;
      console.log(item);

      const result = await App.NewContractt.methods.createTasks(item).send({
        from: App.account[0],
        gas: 0x93990,
      });
      console.log(result);
      document.getElementById("additem").value = "";
    } catch (error) {
      console.log("addtask_error", error);
    }

    window.location.reload();
  },
  // Render Stored tasks from Blockchain to first nav tab
  rendertasks: async () => {
    try {
      const taskcount = await App.NewContractt.methods.taskcount().call();
      console.log(taskcount, "task side");
      // rendering task from blockchain using taskcount
      for (let i = 1; i <= taskcount; i++) {
        console.log(taskcount, "taskcount");

        const tasks = await App.NewContractt.methods.tasks(i).call();
        console.log(tasks);
        //   console.log(tasks.content,"tasks and p");
        const taskid = parseInt(tasks[0]);
        const taskcontent = tasks[1];
        let taskcomplete = tasks[2];
        // console.log(taskcomplete,"taskstataus");
        if (taskcontent == "") {
          console.log("content is deleted task side");
        } else {
          //  Creating a button to delete tasks
          let removebtn = document.createElement("i");
          removebtn.className = "fa fa-trash";
          removebtn.name = taskid;
          // creating checkbox for each new task
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.className = "checkbox";
          checkbox.id = taskid;
          // creating li for each new task
          let li = document.createElement("li");
          li.innerHTML = taskcontent;
          li.className = "listitem";
          //  creating html tags 
          let div = document.createElement("li");
          let lable = document.createElement("lable");
          lable.className = "contain";
          let span = document.createElement("span");
          span.className = "spanmark";
          lable.appendChild(checkbox);
          lable.appendChild(span);
          div.appendChild(lable);
          lable.appendChild(li);
          li.appendChild(removebtn);
          if (taskcomplete == false) {
            tasklist.insertBefore(div, tasklist.childNodes[0]);
          } else {
            completedTasks.insertBefore(div, completedTasks.childNodes[0]);
          }
          //Sortable tasks
          const dragarea = document.querySelector("#tasklist");
          new Sortable(dragarea, {
            animation: 150,
          });
          // Trigger Sweet Alert On Click Event
          removebtn.addEventListener("click", function (e) {
            // send event and boolean value of task true or false
            App.SweetAlert(e);
          });
          // add event listner on checkbox to move completed task to another list
          checkbox.addEventListener("change", function (e) {
            if (this.checked) {
              const li = e.target.parentNode;
              //   li.innerHTML = `<del> taskdone <del>`;
              App.TaskStatus(e);
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
    // window.location.reload();
  },
  SweetAlert: async (e) => {
    //   console.log(e);
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
  },

  TaskStatus: async (e) => {
    const checkid = e.target.id;
    console.log(checkid, "checkbox id");
    const taskmoved = await App.NewContractt.methods.taskStatus(checkid).send({
      from: App.account[0],
      gas: 0x93990,
    });
    console.log(taskmoved.status);
  },
  // delete tasks from todolist
  DeleteTasks: async (event) => {
    try {
      const taskidd = event.target.name;
      console.log(taskidd);
      const taskdone = await App.NewContractt.methods
        .deleteTasks(taskidd)
        .send({
          from: App.account[0],
          gas: 0x93990,
        });
      console.log(taskdone);
      let li = event.target.parentNode;
      tasklist.removeChild(li);
    } catch (error) {
      console.log("delete_task_error", error);
    }

    window.location.reload();
  },
};

window.addEventListener("load", (event) => {
  App.load();
});
