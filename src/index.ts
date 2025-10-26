import { Blockchain } from "./blockchain";
import { Transaction } from "./transaction";
import { createKeyPair, getPublicKey } from "./wallet";

const myKey = createKeyPair();
const myWalletAddress = getPublicKey(myKey);

const SamKey = createKeyPair();
const SamWalletAddress = getPublicKey(SamKey);

const demoCoin = new Blockchain();

demoCoin.minePendingTransactions(myWalletAddress); //So that I have money lmao

const tx1 = new Transaction(myWalletAddress, SamWalletAddress, 10);
tx1.signTransaction(myKey);
demoCoin.addTransaction(tx1);

console.log("Starting miner...");
demoCoin.minePendingTransactions(SamWalletAddress);

console.log(`Sam's balance: ${demoCoin.getBalanceOfAddress(SamWalletAddress)}`);
console.log(`My balance: ${demoCoin.getBalanceOfAddress(myWalletAddress)}`);
console.log("Is chain valid?", demoCoin.isChainValid());
