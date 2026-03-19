const logger = require('./logger');

class UserRateLimit {
    constructor() {
        this.requests = new Map();
        this.config = {
            windowMs: 15 * 60 * 1000,  // 15 minutos
            maxRequests: 100            // máximo por usuário
        };

        // Limpar registros expirados a cada minuto
        setInterval(() => this.limparExpirados(), 60 * 1000);
    }

    middleware() {
        return (req, res, next) => {
            // Só aplicar para usuários autenticados
            if (!req.user) return next();

            const userId = req.user.id;
            const agora = Date.now();

            // Buscar ou criar registro do usuário
            let registro = this.requests.get(userId);

            if (!registro || agora > registro.resetEm) {
                registro = {
                    contador: 0,
                    resetEm: agora + this.config.windowMs
                };
                this.requests.set(userId, registro);
            }

            registro.contador++;

            // Adicionar headers informativos na resposta
            const restantes = Math.max(0, this.config.maxRequests - registro.contador);
            const resetEmSegundos = Math.ceil((registro.resetEm - agora) / 1000);
            res.set('X-RateLimit-Limit', this.config.maxRequests);
            res.set('X-RateLimit-Remaining', restantes);
            res.set('X-RateLimit-Reset', resetEmSegundos);

            // Verificar se excedeu o limite
            if (registro.contador > this.config.maxRequests) {
                logger.warn('Rate limit excedido', {
                    userId,
                    requisicoes: registro.contador,
                    limite: this.config.maxRequests
                });

                return res.status(429).json({
                    success: false,
                    message: 'Muitas requisições. Tente novamente mais tarde.',
                    retryAfter: `${resetEmSegundos} segundos`
                });
            }

            next();
        };
    }

    limparExpirados() {
        const agora = Date.now();
        let removidos = 0;
        for (const [userId, registro] of this.requests.entries()) {
            if (agora > registro.resetEm) {
                this.requests.delete(userId);
                removidos++;
            }
        }
        if (removidos > 0) {
            logger.debug('Rate limit cleanup', { removidos });
        }
    }
}

module.exports = new UserRateLimit();
