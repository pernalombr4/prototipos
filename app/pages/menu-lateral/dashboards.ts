/**
 * OS DASHBOARDS DE ITENS (rodada 35).
 *
 *   "vamos olhar para os dashboards de itens assim como o clickup olha pros
 *    relatórios de tarefas (que funcionam pra eles como nossos itens). Existe
 *    uma tela central pra eles/menu centralizado, mas o user pode adicionar a
 *    tela de dash em cada menu de categoria ou personalizado se quiser, como
 *    tela separada mesmo." (Mikaela)
 *
 * Duas portas para o mesmo dashboard:
 *   - a tela central, Análise > Dashboards, lista todos os do workspace;
 *   - a categoria (ou um menu que o workspace criou) pode levar o dashboard
 *     como submenu: a tela separada aparece embaixo dela, no 3º nível.
 * Tirar do menu não exclui: o dashboard continua na tela central.
 *
 * Mecanismo, não maquete: o menu e a tela central leem este mesmo estado.
 * Dado fictício; o reload zera.
 */
export interface DashboardDeItens {
  id: string
  nome: string
  /** A categoria de onde vêm os itens. */
  categoriaId: number
  /** Mostra o dashboard como submenu da categoria. */
  noMenuDaCategoria: boolean
  /** Quem criou. Fictício. */
  dono: string
  atualizadoEm: string
}

const iniciais: DashboardDeItens[] = [
  { id: 'd-1', nome: 'Contratos por status', categoriaId: 1, noMenuDaCategoria: true, dono: 'Rita Alcântara', atualizadoEm: '2026-11-21' },
  { id: 'd-2', nome: 'Vencimentos do trimestre', categoriaId: 1, noMenuDaCategoria: false, dono: 'Caio Mendes', atualizadoEm: '2026-11-18' },
  { id: 'd-3', nome: 'Chamados por prioridade', categoriaId: 3, noMenuDaCategoria: true, dono: 'Lúcia Prado', atualizadoEm: '2026-11-12' },
  { id: 'd-4', nome: 'Clientes por região', categoriaId: 2, noMenuDaCategoria: false, dono: 'Tiago Reis', atualizadoEm: '2026-10-30' },
]

export function useDashboards() {
  const lista = useState<DashboardDeItens[]>('dashboards-de-itens', () => iniciais.map(d => ({ ...d })))

  /** Os que a categoria mostra no menu, como submenu. */
  function daCategoria(categoriaId: number) {
    return lista.value.filter(d => d.categoriaId === categoriaId && d.noMenuDaCategoria)
  }

  function achar(id: string) {
    return lista.value.find(d => d.id === id) ?? null
  }

  function mostrarNaCategoria(id: string, mostrar: boolean) {
    const d = achar(id)
    if (d) d.noMenuDaCategoria = mostrar
  }

  /** "Novo dashboard" a partir da categoria: nasce já no menu dela. */
  function criar(nome: string, categoriaId: number, dono: string) {
    const d: DashboardDeItens = {
      id: `d-${Date.now()}`,
      nome,
      categoriaId,
      noMenuDaCategoria: true,
      dono,
      atualizadoEm: new Date().toISOString().slice(0, 10),
    }
    lista.value = [d, ...lista.value]
    return d
  }

  /**
   * O cenário do andaime. Workspace novo não tem dashboard. Sem personalização
   * os dashboards existem na tela central, mas nenhum está no menu: pôr no
   * menu já é mexer no menu.
   */
  function recomecar(cenario: 'emUso' | 'semPersonalizacao' | 'novo') {
    if (cenario === 'novo') lista.value = []
    else lista.value = iniciais.map(d => ({ ...d, noMenuDaCategoria: cenario === 'emUso' && d.noMenuDaCategoria }))
  }

  return { lista, daCategoria, achar, mostrarNaCategoria, criar, recomecar }
}

/** O id de destino de um dashboard aberto no miolo. */
export const destinoDoDashboard = (id: string) => `dash:${id}`
export const dashboardDoDestino = (destino: string) => (destino.startsWith('dash:') ? destino.slice(5) : null)
