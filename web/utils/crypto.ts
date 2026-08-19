export async function encrypt(key: CryptoKey, data: string)
{
	const encoder = new TextEncoder();

	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoder.encode(data));
	const encryptedArray = new Uint8Array(encrypted);

	const result = new Uint8Array(iv.length + encryptedArray.length);
	result.set(iv);
	result.set(encryptedArray, iv.length);

	return result;
}

export async function decrypt(key: CryptoKey, data: Uint8Array<ArrayBuffer>)
{
	const iv = data.slice(0, 12);
	const encryptedData = data.slice(12);

	const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);

	return new Uint8Array(decrypted);
}

export async function importKEK(salt: Uint8Array<ArrayBuffer>, password: string)
{
	const encoder = new TextEncoder();

	const keyPassword = await crypto.subtle.importKey(
		'raw',
		encoder.encode(password),
		{ name: 'PBKDF2' },
		true,
		[ 'deriveBits' ],
	);

	const keyEncryptionKey = await crypto.subtle.deriveBits(
		{
			name: 'PBKDF2',
			hash: 'SHA-256',
			salt: salt,
			iterations: 1e6,
		},
		keyPassword,
		256,
	);

	const kek = await crypto.subtle.importKey(
		'raw',
		keyEncryptionKey,
		{ name: 'AES-GCM' },
		false,
		[ 'encrypt', 'decrypt' ],
	);

	return kek;
}

export async function importDEK(key: Uint8Array<ArrayBuffer>)
{
	const dek = await crypto.subtle.importKey(
		'raw',
		key,
		{ name: 'AES-GCM' },
		false,
		[ 'encrypt', 'decrypt' ],
	);

	return dek;
}
