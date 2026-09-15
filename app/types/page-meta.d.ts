// Metadados que todo protótipo declara em definePageMeta.
// O índice da raiz lê daqui — página sem isso aparece com o nome da rota.
declare module '#app' {
  interface PageMeta {
    /** Nome do protótipo, igual em todas as telas dele. */
    titulo?: string
    /** Uma frase: que problema essa proposta resolve. */
    descricao?: string
    /** rascunho | em-revisao | aprovado | arquivado */
    status?: 'rascunho' | 'em-revisao' | 'aprovado' | 'arquivado'
    /** AAAA-MM-DD da última iteração. */
    atualizado?: string
    /** Nome desta tela dentro do protótipo. */
    tela?: string
  }
}

export {}
