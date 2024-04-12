const Web3 = require('web3');
const quorumjs = require('quorum-js');
const dotenv = require('dotenv');

dotenv.config();
const node1 = {
    NETWORK_ID: process.env.NETWORK_ID1,
    RPC: process.env.RPC1,
    TM_PK: process.env.TM_PUBLIC_KEY1,
    TM_URL: process.env.TM1,
    WALLET_ADDRESS: process.env.WALLET_ADDRESS1,
    WALLET_KEY: process.env.WALLET_KEY1,
};

const mountWeb3 = (RPC) => new Web3(
    new Web3.providers.HttpProvider(RPC),
    null, { transactionConfirmationBlocks: 1 },
);

const mountTransactionManager = (web3, privateUrl) => quorumjs.RawTransactionManager(
    web3, { privateUrl },
);

node1.web3 = mountWeb3(node1.RPC);
node1.txManager = mountTransactionManager(node1.web3, node1.TM_URL);

module.exports = {
    node1,
};