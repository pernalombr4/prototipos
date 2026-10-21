/**
 * O estado que mais de uma tela lê. Tudo em memória: o reload zera.
 *
 * - `tela`: qual item do menu está aberto;
 * - `cenario` e `perfil`: o andaime (cheio, vazio, carregando, erro, sem
 *   permissão; membro ou quem gerencia);
 * - as variações de cada tela (sem grupo, site que recusa, envio que falha);
 * - as listas que mudam com o gesto: tarefas executadas, requisições abertas
 *   pelo "Abrir requisição" e decididas na Triagem. Abrir uma requisição
 *   numa tela faz ela aparecer em Minhas requisições; é por isso que moram
 *   aqui e não dentro de cada tela.
 */
import {
  EU, gruposDe, minhasRequisicoesIniciais, tarefas as tarefasIniciais, triagemInicial,
  type Requisicao, type TarefaDoPrototipo,
} from './mocks'

export type Tela =
  | 'lista' | 'fila' | 'painel' | 'documentos' | 'externa'
  | 'abrir' | 'minhas' | 'triagem'

export type Cenario = 'cheio' | 'vazio' | 'carregando' | 'erro' | 'sem-permissao'
export type Perfil = 'membro' | 'gestor'
export type ModoDaPaginaExterna = 'embutida' | 'recusa' | 'nova-aba'

export function useTiposDeTela() {
  const tela = useState<Tela>('tdt-tela', () => 'lista')
  const cenario = useState<Cenario>('tdt-cenario', () => 'cheio')
  const perfil = useState<Perfil>('tdt-perfil', () => 'membro')
  const semGrupo = useState<boolean>('tdt-sem-grupo', () => false)
  const modoExterna = useState<ModoDaPaginaExterna>('tdt-externa', () => 'embutida')
  const envioFalha = useState<boolean>('tdt-envio-falha', () => false)

  const tarefas = useState<TarefaDoPrototipo[]>('tdt-tarefas', () => structuredClone(tarefasIniciais))
  const minhas = useState<Requisicao[]>('tdt-minhas', () => structuredClone(minhasRequisicoesIniciais))
  const triagem = useState<Requisicao[]>('tdt-triagem', () => structuredClone(triagemInicial))

  /** Os grupos de quem usa, já com a variação "sem grupo" do andaime. */
  const meusGrupos = computed(() => (semGrupo.value ? [] : gruposDe(EU.id)))

  /** O que aguarda a pessoa: o número que vai no item do menu. */
  const contadores = computed(() => ({
    fila: tarefas.value.filter(x => x.status === 'pending' && (x.assigned_to === EU.id || (x.grupo !== null && meusGrupos.value.some(g => g.id === x.grupo)))).length,
    minhas: minhas.value.filter(r => r.etapa === 'revisao_pedida').length,
    triagem: triagem.value.filter(r => r.etapa === 'em_triagem').length,
  }))

  return { tela, cenario, perfil, semGrupo, modoExterna, envioFalha, tarefas, minhas, triagem, meusGrupos, contadores }
}

/** Uma espera curta para o botão mostrar o carregando. */
export function esperar(ms = 900) {
  return new Promise(r => setTimeout(r, ms))
}
