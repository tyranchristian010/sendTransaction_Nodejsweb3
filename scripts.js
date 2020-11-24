const Web3 = require('web3');
const MyContract =require('./src/abis/MyContract.json');
const address ='0x35f25898246a6746Eced2a3B903dbF851dA70F75';
const privateKey='2331da89d1380100856e2560132cad15dafef5070a9fc7516de2148fd6207120';

const infuraUrl ='https://rinkeby.infura.io/v3/75c2e9362c744a10bea1c9daafad71ac';

const init1 = async()=>{
    const web3=new Web3(infuraUrl);                          //web3 instance
    const networkId = await web3.eth.net.getId();           //you NEED the NETWORK ID to get the contract instance because it contains the address
    const myContract = new web3.eth.Contract(              //contract instance
      MyContract.abi,
      MyContract.networks[networkId].address  
    );
    const tx = myContract.methods.setData(1);              //transaction object using our contract instance but this is a special case where we dont use send.
    const gas = await tx.estimateGas({from: address});    //instead we estimate the gas limit
    const gasPrice = await web3.eth.getGasPrice();       //use web3 to get the current gas price
    const data = tx.encodeABI();                        //we get the encoded abi of our function call. A hexadecimal string that tells our smart conbtract which function we want to call.
    const nonce = await web3.eth.getTransactionCount(address);  //the nonce is an integer that is increased after each transaction

    const signedTx = await web3.eth.accounts.signTransaction(     //we need to sign our transaction and pass in all the variables we just defined.
        {
            to: myContract.options.address,
            data,
            gas,
            gasPrice,
            nonce,
            chainId: networkId
        },
        privateKey
    );  
    console.log(`Old data value: ${await myContract.methods.data().call()}`); //call the data value before so we can compare it to after
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);  //send the transaction and get the receipt
    console.log(`Transaction hash: ${receipt.transactionHash}`);      //we look at the transaction hash on a blockchain explorer
    console.log(`New data value: ${await myContract.methods.data().call()}`);

}
//Slightly easier (web3#sendTransaction())
const init2 = async () => {
    const web3 = new Web3(infuraUrl);
    const networkId = await web3.eth.net.getId();
    const myContract = new web3.eth.Contract(
      MyContract.abi,
      MyContract.networks[networkId].address
    );
    web3.eth.accounts.wallet.add(privateKey);
  
    const tx = myContract.methods.setData(2);
    const gas = await tx.estimateGas({from: address});
    const gasPrice = await web3.eth.getGasPrice();
    const data = tx.encodeABI();
    const nonce = await web3.eth.getTransactionCount(address);
    const txData = {
      from: address,
      to: myContract.options.address,
      data: data,
      gas,
      gasPrice,
      nonce, 
      chain: 'rinkeby', 
      hardfork: 'istanbul'
    };
  
    console.log(`Old data value: ${await myContract.methods.data().call()}`);
    const receipt = await web3.eth.sendSignedTransaction(txData);
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`New data value: ${await myContract.methods.data().call()}`);
  }
init2();

//from here you need to test your script by deploying your smart contract so go inside truffle-config
//and add your hdwallet provider, address and privateKey (npm install @truffle/hdwallet-provider),(truffle migrate --network rinkeby --reset)