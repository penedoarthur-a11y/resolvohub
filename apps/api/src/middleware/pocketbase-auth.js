import Pocketbase from 'pocketbase';

function unauthorizedError(message) {
	const error = new Error(message);
	error.status = 401;
	return error;
}

function forbiddenError(message) {
	const error = new Error(message);
	error.status = 403;
	return error;
}

export async function pocketbaseAuth(req, res, next) {
	const token = req.headers.authorization?.split(' ')?.[1];

	// Auth is enforced by default. To allow public (anonymous) access, remove this
	// middleware from the route (apps/api/src/routes/integrated-ai.js).
	if (!token) {
		return next(unauthorizedError('Faça login ou crie uma conta para usar o chat.'));
	}

	try {
		// The frontend sends pocketbaseClient.authStore.token as-is (see
		// apps/web/src/lib/integratedAiClient.js) — a plain PocketBase JWT, not an
		// encoded wrapper. Match adminMiddleware's expectation here.
		const pocketbaseClient = new Pocketbase(process.env.POCKETBASE_URL || 'http://localhost:8090');
		pocketbaseClient.authStore.save(token, null);
		const newToken = await pocketbaseClient.collection('users').authRefresh();

		if (!newToken.record.verified) {
			return next(forbiddenError('Verifique seu e-mail para usar o chat. Confira sua caixa de entrada para o link de verificação.'));
		}

		req.pocketbaseUserId = newToken.record.id;

		return next();
	} catch {
		return next(unauthorizedError('Sua sessão expirou. Faça login novamente.'));
	}
}
