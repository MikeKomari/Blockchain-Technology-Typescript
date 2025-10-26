import { Block } from "./block";
import { Transaction } from "./transaction";

export class Blockchain {
	chain: Block[];
	difficulty: number;
	pendingTransactions: Transaction[];
	miningReward: number;

	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock(): Block {
		return new Block(Date.now(), [], "0");
	}

	getLatestBlock(): Block {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress: string) {
		const rewardTx = new Transaction(
			null,
			miningRewardAddress,
			this.miningReward
		);
		this.pendingTransactions.push(rewardTx);

		const block = new Block(
			Date.now(),
			this.pendingTransactions,
			this.getLatestBlock().hash
		);
		block.mineBlock(this.difficulty);

		console.log("Block successfully mined!");
		this.chain.push(block);
		this.pendingTransactions = [];
	}

	addTransaction(transaction: Transaction) {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error("Transaction must include from and to address");
		}

		const senderBalance = this.getBalanceOfAddress(transaction.fromAddress);
		if (senderBalance < transaction.amount) {
			throw new Error(
				`Insufficient balance: trying to send ${transaction.amount}, but only ${senderBalance} available`
			);
		}

		if (!transaction.isValid()) throw new Error("Invalid transaction");
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address: string): number {
		let balance = 0;

		for (const block of this.chain) {
			for (const tx of block.transactions) {
				if (tx.fromAddress === address) balance -= tx.amount;
				if (tx.toAddress === address) balance += tx.amount;
			}
		}

		return balance;
	}

	isChainValid(): boolean {
		for (let i = 1; i < this.chain.length; i++) {
			const currentBlock = this.chain[i];
			const previousBlock = this.chain[i - 1];

			if (!currentBlock.hasValidTransactions()) return false;
			if (currentBlock.hash !== currentBlock.calculateHash()) return false;
			if (currentBlock.previousHash !== previousBlock.hash) return false;
		}
		return true;
	}
}
