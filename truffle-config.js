const HDWalletProvider = require('truffle-hdwallet-provider')
const MNEMONIC = "that toe legend earn tunnel electric boost multiply join blast quantum cause"
// "clown chest math pause tortoise drip pass pyramid giant steel response unusual"


module.exports = {
    networks:{
        development:{
            host:"127.0.0.1",
            port:7545,
            network_id:"*",
        },
        ropsten: {
            provider: function() {
              return new HDWalletProvider(MNEMONIC,"https://ropsten.infura.io/v3/0c3cfe9ddceb4cc79ab3578bc7e9b6d6");
            },
            network_id:3,
            // gas:9000000,
            timeoutBlocks:200,
            skipDryrun:true,
          }
     },
    solc:{
         optimizer:{
              enable:true,
              runs:200
            }
        },
       
    }