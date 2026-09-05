import rateLimit from 'express-rate-limit';

export const integratedAiRateLimit = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Muitas solicitações de IA, tente novamente mais tarde' },
	validate: { trustProxy: false },
});
