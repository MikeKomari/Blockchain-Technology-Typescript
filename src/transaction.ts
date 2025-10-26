import * as crypto from "crypto";
import elliptic from "elliptic";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

export class Transaction {
	fromAddress: string | null;
	toAddress: string;
	amount: number;
	timestamp: number;
	signature: string | null;

	constructor(fromAddress: string | null, toAddress: string, amount: number) {
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
		this.timestamp = Date.now();
		this.signature = null;
	}

	calculateHash(): string {
		return crypto
			.createHash("sha256")
			.update(
				(this.fromAddress || "") + this.toAddress + this.amount + this.timestamp
			)
			.digest("hex");
	}

	signTransaction(signingKey: elliptic.ec.KeyPair) {
		if (!this.fromAddress)
			throw new Error("Cannot sign mining reward transactions");

		const publicKey = signingKey.getPublic("hex");
		if (publicKey !== this.fromAddress) {
			throw new Error("You cannot sign transactions for other wallets");
		}

		const hashTx = this.calculateHash();
		const sig = signingKey.sign(hashTx, "base64");
		this.signature = sig.toDER("hex");
	}

	isValid(): boolean {
		if (this.fromAddress === null) return true;
		if (!this.signature || this.signature.length === 0)
			throw new Error("No signature in this transaction");

		const publicKey = ec.keyFromPublic(this.fromAddress, "hex");
		return publicKey.verify(this.calculateHash(), this.signature);
	}
}
