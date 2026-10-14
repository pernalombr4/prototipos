import { relatoriosEmitidos, type FormatoDoRelatorio, type RelatorioEmitido } from './mocks'

/**
 * MEUS RELATÓRIOS (rodada 22).
 *
 * "deve haver no menu uma opçao nativa para 'meus relatorios'. todos os
 *  relatorios extraidos no workspace vao pra lá" (Mikaela, 14/10/2026).
 *
 * Como o Inbox, isto é mecanismo e não maquete: a lista da tela, o número do
 * menu e o "Extrair relatório" da categoria leem o MESMO estado. Extrair põe
 * uma linha "Processando" no topo; 5 s depois ela fica "Completa" e o menu
 * ganha o número; baixar apaga o número. O reload zera tudo.
 *
 * O download é maquete: nenhum arquivo sai do navegador.
 */
export function useMeusRelatorios() {
  const lista = useState<RelatorioEmitido[]>('meus-relatorios', () => relatoriosEmitidos.map(r => ({ ...r })))

  /** Pronto e ainda não baixado. Some no zero, como o do Inbox. */
  const novos = computed(() => lista.value.filter(r => r.status === 'completa' && r.novo).length)

  function hoje() {
    return new Date().toLocaleDateString('pt-BR')
  }

  /**
   * O Relatório padrão, como no develop: sai sem modelo, tabela e entidade. A
   * linha não diz de qual categoria veio, e isso é achado, não proposta.
   */
  function extrair(formato: FormatoDoRelatorio) {
    const id = Math.max(0, ...lista.value.map(r => r.id)) + 1
    lista.value.unshift({
      id,
      status: 'processando',
      modelo: null,
      tabela: null,
      entidade: null,
      criadoEm: hoje(),
      registros: null,
      formato,
      filtros: [
        { campo: 'Form', valor: String(3200 + id) },
        { campo: 'Type', valor: '100' },
        { campo: 'Sort', valor: 'Created_at:DESC' },
      ],
    })
    setTimeout(() => {
      const r = lista.value.find(x => x.id === id)
      if (!r) return
      r.status = 'completa'
      r.novo = true
    }, 5000)
  }

  function baixar(id: number) {
    const r = lista.value.find(x => x.id === id)
    if (r) r.novo = false
  }

  function deletar(id: number) {
    lista.value = lista.value.filter(r => r.id !== id)
  }

  function nomeDoArquivo(r: RelatorioEmitido) {
    const extensao = { Excel: 'xlsx', CSV: 'csv', DBF: 'dbf' }[r.formato]
    return `relatorio-${r.id}.${extensao}`
  }

  return { lista, novos, extrair, baixar, deletar, nomeDoArquivo }
}
