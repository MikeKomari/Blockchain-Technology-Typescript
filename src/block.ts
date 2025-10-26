import * as crypto from "crypto";
import { Transaction } from "./transaction";

export class Block {
	timestamp: number;
	transactions: Transaction[];
	previousHash: string;
	hash: string;
	nonce: number;

	constructor(
		timestamp: number,
		transactions: Transaction[],
		previousHash = ""
	) {
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.previousHash = previousHash;
		this.nonce = 0;
		this.hash = this.calculateHash();
	}

	calculateHash(): string {
		return crypto
			.createHash("sha256")
			.update(
				this.previousHash +
					this.timestamp +
					JSON.stringify(this.transactions) +
					this.nonce
			)
			.digest("hex");
	}

	mineBlock(difficulty: number) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
		console.log(`Block mined: ${this.hash}`);
	}

	hasValidTransactions(): boolean {
		for (const tx of this.transactions) {
			if (!tx.isValid()) return false;
		}
		return true;
	}
}
