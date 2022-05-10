const App = {
  // Calling each function of todolist
  load: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.rendertasks();
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

    window.location.reload();
  },
  // Render Stored tasks from Blockchain
  rendertasks: async () => {
    try {
      const taskcount = await App.NewContractt.methods.taskcount().call();
      console.log(taskcount);
      // rendering task from blockchain using taskcount
      for (let i = 1; i <= taskcount; i++) {
        const tasks = await App.NewContractt.methods.tasks(i).call();
        console.log(tasks);
        const taskid = parseInt(tasks[0]);
        const taskcontent = tasks[1];
        const taskcomplete = tasks[2];
        //  Creating a button to delete tasks
        let removebtn = document.createElement("button");
        removebtn.textContent = "X";
        removebtn.className = "remove";
        removebtn.name = taskid;
        removebtn.id = "btnremove";
        // creating li for each new task

        let li = document.createElement("li");
        li.innerHTML = taskcontent;
        li.appendChild(removebtn);
        tasklist.appendChild(li);
        // Trigger Sweet Alert On Click Event
        removebtn.addEventListener("click", function (e) {
          //  Trigger Sweet alert on click event
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

    window.location.reload();
  },
};

window.addEventListener("load", (event) => {
  App.load();
});
