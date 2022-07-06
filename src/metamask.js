const spanAccount = document.getElementById("ethAcc");
const spanBalance = document.getElementById("ethBal");
const divinfo = document.getElementById("divinfo");
divinfo.style.visibility = "hidden";

const modalBtn = document.getElementById("show-modal-btn");
const discon_btn = document.getElementById("disconnect_btn");

discon_btn.style.visibility = "hidden";

const SignInMetamask = async () => {
  // Creating Instance Of Web3
  try {
    if (window.ethereum) {
      web3Provider = new Web3(Web3.givenProvider);
      console.log(web3Provider);
      let account = await ethereum.request({ method: "eth_requestAccounts" });
      console.log(account);
      let getBal = await web3Provider.eth.getBalance(account[0]);
      console.log(typeof getBal);
      const AccBalance = parseFloat(
        web3Provider.utils.fromWei(getBal, "ether")
      );
      const balance = AccBalance.toFixed(4);
      console.log(balance);
      spanAccount.innerHTML = account[0];
      spanBalance.innerHTML = balance;
      divinfo.style.visibility = "visible";
      console.log("visible");

      let overlay = document.getElementById("overlay");
      overlay.style.display = "none";
      // --------------------------------
      discon_btn.style.visibility = "visible";
      modalBtn.style.visibility = "hidden";
    } else {
      //If Metamask Not Installed Or Not Connected
      window.alert("please connect metamask");
    }
  } catch (error) {
    console.log("login_fun_error", error);
  }
};

const UpdateAcc = async () => {
  // If User Change his Account
  try {
    await window.ethereum.on("accountsChanged", async function (accounts) {
      console.log(accounts, "account changed");
      SignInMetamask();
    });
  } catch (error) {
    console.log("Update_Acc_error", error);
  }
};
const Disconnect = async () => {
  spanAccount.innerHTML = "";
  spanBalance.innerHTML = "";
  // ----------------
  divinfo.style.visibility = "hidden";
  modalBtn.style.visibility = "visible";
  discon_btn.style.visibility = "hidden";
  //   window.location.reload();
};
const ModalPopup = async () => {
  let overlay = document.getElementById("overlay");

  const modalBtn = document.getElementById("show-modal-btn");
  const closebtn = document.getElementById("close-modal-btn");

  modalBtn.addEventListener("click", function (e) {
    overlay.style.display = "block";
  });
  closebtn.addEventListener("click", function (e) {
    overlay.style.display = "none";
  });
};

async function SendEthereum() {
  web3Provider = new Web3(Web3.givenProvider);

  const ToAddress = document.getElementById("getAdress").value;
  console.log(ToAddress);
  const valueETH = document.getElementById("getValueETH").value;
  console.log(valueETH, "value before hex");
  if (ToAddress == "") {
    console.log("please enter something");
  } else {
    const myAddress = "0x2f8a1dec1227ac5730063d0aad508651ad198276";
    console.log(myAddress, "my account ");
    const private_key =
      "2a0f01f9870b252b76ccd64137072fb626b25c601b23c43a2c428e7671ae075a";
    const nonce = await web3Provider.eth.getTransactionCount(
      myAddress,
      "latest"
    );
    console.log(nonce, "transaction count");
    const transaction = {
      to: ToAddress,
      gas: 21000,
      value: web3Provider.utils.toHex(
        web3Provider.utils.toWei(valueETH.toString(), "ether")
      ),
      // nonce: nonce,
    };
    const signedTx = await web3Provider.eth.accounts.signTransaction(
      transaction,
      private_key
    );
    console.log(signedTx.rawTransaction, "signed tx raw");

    const result = await web3Provider.eth.sendSignedTransaction(
      signedTx.rawTransaction,
      function (error, hash) {
        console.log(hash, "hash");
        if (!error) {
          Swal.fire(
            "Your Transaction is Successful",
            `<a href="https://ropsten.etherscan.io/tx/${hash}">view it on etherscan</a>`,
            "success"
          );
          console.log("The hash of your transaction is: ", hash);
        } else {
          console.log(
            "Something went wrong while submitting your transaction:",
            error
          );
        }
      }
    );
    console.log(result, "result of raw transc");
  } //else part end
  ToAddress = "";
  valueETH = "";
}

// const ethsend = document.getElementById('sendeth')
// ethsend.addEventListener('click',function(){
//     SendEthereum()
//     swal(
//         "Your Transaction is Successful",
//         `<a href="https://ropsten.etherscan.io/tx/${result}">view it on etherscan</a>`,
//         "success"
//       );
// })

window.addEventListener("load", (event) => {
  ModalPopup();
  UpdateAcc();
});
