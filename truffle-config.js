const Provider =require('@truffle/hdwallet-provider');
const address ='0x35f25898246a6746Eced2a3B903dbF851dA70F75';
const privateKey='2331da89d1380100856e2560132cad15dafef5070a9fc7516de2148fd6207120';
const provider= new Provider(privateKey, 'https://rinkeby.infura.io/v3/75c2e9362c744a10bea1c9daafad71ac');

require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby:{
      provider:()=>provider,
      network_id:4
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
