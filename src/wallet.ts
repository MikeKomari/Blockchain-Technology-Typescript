import elliptic from "elliptic";
const EC = elliptic.ec;
const ec = new EC("secp256k1");

export function createKeyPair() {
	return ec.genKeyPair();
}

export function getPublicKey(key: elliptic.ec.KeyPair) {
	return key.getPublic("hex");
}
