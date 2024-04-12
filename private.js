const { compileContract } = require('./utils/compiler.js');
const {
    node1,
    node2,
    node3,
} = require('./utils/environment.js');

let temperatureMonitor = {};

const main = async() => {
    const { interface, bytecode } = compileContract('temperatureMonitor.sol');
    temperatureMonitor = {
        interface,
        bytecode,
    };

    const contractAddress = await deployContract({
        node: node1,
        privateFor: [node2.TM_PK],
    });
    console.log(`Contract address after deployment: ${contractAddress}`);
}

function getContract(web3, contractAddress) {
    return new web3.eth.Contract(temperatureMonitor.interface, contractAddress);
}

async function deployContract({ node, privateFor }) {
    await node.web3.eth.personal.unlockAccount(node.WALLET_ADDRESS, '', 1000);
    const contract = new node.web3.eth.Contract(temperatureMonitor.interface);

    return contract.deploy({
            data: temperatureMonitor.bytecode,
        })
        .send({
            from: node.WALLET_ADDRESS,
            gasPrice: 0,
            gasLimit: 4300000,
            privateFor,
            value: 0,
        })
        .on('error', console.error)
        .then((newContractInstance) => {
            return newContractInstance.options.address;
        });
}

async function setTemperature({ node, contractAddress, privateFor, temp }) {
    await node.web3.eth.personal.unlockAccount(node.WALLET_ADDRESS, '', 1000);

    const myContract = getContract(node.web3, contractAddress);

    return myContract.methods.set(temp).send({
            from: node.WALLET_ADDRESS,
            privateFor,
        })
        .on('error', console.error)
        .then((receipt) => {
            return receipt.status;
        });
}

async function getTemperature({ node, contractAddress }) {
    const myContract = getContract(node.web3, contractAddress);

    return myContract.methods.get().call().then(result => result);
}

main()