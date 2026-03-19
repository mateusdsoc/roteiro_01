const LOG_LEVELS = {
    DEBUG: { valor: 0, cor: '\x1b[36m', emoji: '🔍' },
    INFO:  { valor: 1, cor: '\x1b[32m', emoji: '✅' },
    WARN:  { valor: 2, cor: '\x1b[33m', emoji: '⚠️' },
    ERROR: { valor: 3, cor: '\x1b[31m', emoji: '❌' },
    FATAL: { valor: 4, cor: '\x1b[35m', emoji: '💀' }
};

const RESET = '\x1b[0m';

class Logger {
    constructor() {
        this.nivelMinimo = LOG_LEVELS.DEBUG.valor;
        this.logs = [];
        this.maxLogs = 1000;
    }

    formatarTimestamp() {
        const agora = new Date();
        return agora.toISOString();
    }

    log(nivel, mensagem, contexto = {}) {
        const config = LOG_LEVELS[nivel];
        if (!config || config.valor < this.nivelMinimo) return;

        const entrada = {
            timestamp: this.formatarTimestamp(),
            nivel,
            mensagem,
            ...contexto
        };

        // Armazenar log na memória (últimos 1000)
        this.logs.push(entrada);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Exibir no console com cores
        const prefixo = `${config.cor}[${entrada.timestamp}] ${config.emoji} ${nivel}${RESET}`;
        const ctx = Object.keys(contexto).length > 0
            ? ` | ${JSON.stringify(contexto)}`
            : '';
        console.log(`${prefixo}: ${mensagem}${ctx}`);

        return entrada;
    }

    debug(mensagem, contexto = {}) {
        return this.log('DEBUG', mensagem, contexto);
    }

    info(mensagem, contexto = {}) {
        return this.log('INFO', mensagem, contexto);
    }

    warn(mensagem, contexto = {}) {
        return this.log('WARN', mensagem, contexto);
    }

    error(mensagem, contexto = {}) {
        return this.log('ERROR', mensagem, contexto);
    }

    fatal(mensagem, contexto = {}) {
        return this.log('FATAL', mensagem, contexto);
    }

    // Middleware para Express: loga cada requisição automaticamente
    middlewareHTTP() {
        return (req, res, next) => {
            const inicio = Date.now();

            // Quando a resposta terminar, logar os detalhes
            res.on('finish', () => {
                const duracao = Date.now() - inicio;
                const nivel = res.statusCode >= 500 ? 'ERROR'
                            : res.statusCode >= 400 ? 'WARN'
                            : 'INFO';

                this.log(nivel, `${req.method} ${req.originalUrl}`, {
                    status: res.statusCode,
                    duracao: `${duracao}ms`,
                    ip: req.ip
                });
            });

            next();
        };
    }

    // Retorna os últimos N logs (útil para um endpoint de debug)
    getUltimosLogs(quantidade = 50) {
        return this.logs.slice(-quantidade);
    }
}

module.exports = new Logger();
