
class MemoryCache {
    constructor() {
        this.cache = new Map();
        this.defaultTTL = 60 * 1000;

        this.cleanupInterval = setInterval(() => {
            this.limparExpirados();
        }, 30 * 1000);

        console.log('🗄️  Cache em memória inicializado (TTL: 60s)');
    }

    get(chave) {
        const entrada = this.cache.get(chave);

        if (!entrada) {
            console.log(`🔴 Cache MISS: ${chave}`);
            return null;
        }

        if (Date.now() > entrada.expiraEm) {
            this.cache.delete(chave);
            console.log(`🟡 Cache EXPIRADO: ${chave}`);
            return null;
        }

        console.log(`🟢 Cache HIT: ${chave}`);
        return entrada.data;
    }

    set(chave, data, ttl = this.defaultTTL) {
        this.cache.set(chave, {
            data,
            expiraEm: Date.now() + ttl
        });
        console.log(`💾 Cache SET: ${chave} (expira em ${ttl / 1000}s)`);
    }

    invalidar(prefixo) {
        let removidos = 0;
        for (const chave of this.cache.keys()) {
            if (chave.startsWith(prefixo)) {
                this.cache.delete(chave);
                removidos++;
            }
        }
        if (removidos > 0) {
            console.log(`🗑️  Cache INVALIDADO: ${removidos} entrada(s) com prefixo "${prefixo}"`);
        }
    }

    limparExpirados() {
        const agora = Date.now();
        let removidos = 0;
        for (const [chave, entrada] of this.cache.entries()) {
            if (agora > entrada.expiraEm) {
                this.cache.delete(chave);
                removidos++;
            }
        }
        if (removidos > 0) {
            console.log(`🧹 Cache LIMPEZA: ${removidos} entrada(s) expirada(s) removida(s)`);
        }
    }

    stats() {
        return {
            totalEntradas: this.cache.size,
            chaves: [...this.cache.keys()]
        };
    }
}

module.exports = new MemoryCache();
