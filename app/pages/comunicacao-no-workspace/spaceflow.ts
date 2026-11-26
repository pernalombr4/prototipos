/**
 * Fase 4 (rodada 14): o fluxo de exemplo do Spaceflow com os nós de mensagem.
 *
 * O fluxo "Lembrete de vencimento do contrato" começa 15 dias antes do campo Data de
 * vencimento, na categoria Contratos, e avisa o contato por e-mail, SMS e WhatsApp. Os nós
 * Enviar SMS e Enviar WhatsApp são proposta (back C2 e C3 da pesquisa de 2026-11-26): saem pela
 * integração Twilio do workspace, e cada envio fica na central Comunicações com o status de
 * entrega.
 *
 * Tudo em memória (`useState`); o reload volta ao começo.
 */
import { modelosDeWhatsApp } from './mocks'

export type NoDeMensagem = 'sms' | 'whatsapp'
export type AoFalhar = 'seguir' | 'parar'

/** As variáveis do painel Variáveis de Entrada (campos do item que disparou o fluxo; nomes inventados). */
export interface Variavel {
  chave: string
  rotulo: string
  icone: string
  /** O valor de exemplo da prévia. */
  exemplo: string
}

export const VARIAVEIS: Variavel[] = [
  { chave: '{{nodes.trig.reference}}', rotulo: 'Referência', icone: 'i-lucide-hash', exemplo: 'CTR-00223' },
  { chave: '{{nodes.trig.titulo}}', rotulo: 'Título', icone: 'i-lucide-type', exemplo: 'Contrato de link de internet dedicado' },
  { chave: '{{nodes.trig.nome_do_contato}}', rotulo: 'Nome do contato', icone: 'i-lucide-user', exemplo: 'Caio' },
  { chave: '{{nodes.trig.telefone_do_contato}}', rotulo: 'Telefone do contato', icone: 'i-lucide-phone', exemplo: '+55 11 98877-1020' },
  { chave: '{{nodes.trig.email_do_contato}}', rotulo: 'E-mail do contato', icone: 'i-lucide-at-sign', exemplo: 'caio.fernandes@example.com' },
  { chave: '{{nodes.trig.data_de_vencimento}}', rotulo: 'Data de vencimento', icone: 'i-lucide-calendar', exemplo: '20/10/2026' },
]

export function variavelPorChave(chave: string) {
  return VARIAVEIS.find(v => v.chave === chave.trim()) ?? null
}

/** Troca cada variável pelo valor de exemplo, para a prévia e a contagem do SMS. */
export function comExemplos(texto: string) {
  return VARIAVEIS.reduce((s, v) => s.replaceAll(v.chave, v.exemplo), texto)
}

export interface ConfigDoSms {
  /** Vazio: o cartão e o campo mostram o nome padrão do nó, no idioma da tela. */
  nome: string
  para: string
  mensagem: string
  aoFalhar: AoFalhar
  esperarEntrega: boolean
}

export interface ConfigDoWhatsApp {
  nome: string
  para: string
  /** O id do modelo aprovado. */
  modelo: string | null
  /** O valor de cada {{n}} do modelo, na ordem. */
  variaveis: string[]
  aoFalhar: AoFalhar
  esperarEntrega: boolean
}

export function configInicialDoSms(): ConfigDoSms {
  return {
    nome: '',
    para: '{{nodes.trig.telefone_do_contato}}',
    mensagem: 'Olá, {{nodes.trig.nome_do_contato}}. O contrato {{nodes.trig.reference}} vence em 15 dias. Fale com o jurídico para combinar a renovação.',
    aoFalhar: 'seguir',
    esperarEntrega: false,
  }
}

export function configInicialDoWhatsApp(): ConfigDoWhatsApp {
  return {
    nome: '',
    para: '{{nodes.trig.telefone_do_contato}}',
    modelo: modelosDeWhatsApp[0]!.id,
    variaveis: ['{{nodes.trig.nome_do_contato}}', '{{nodes.trig.reference}}', '{{nodes.trig.data_de_vencimento}}'],
    aoFalhar: 'seguir',
    esperarEntrega: false,
  }
}

export function useSpaceflow() {
  const sms = useState<ConfigDoSms>('cnw-sf-sms', configInicialDoSms)
  const whatsapp = useState<ConfigDoWhatsApp>('cnw-sf-whatsapp', configInicialDoWhatsApp)
  /** O nó que o modal está editando. */
  const editando = useState<NoDeMensagem | null>('cnw-sf-editando', () => null)
  /** Os nós salvos nesta sessão (o rodapé do cartão diz OK; antes, MODIFICADO). */
  const salvos = useState<NoDeMensagem[]>('cnw-sf-salvos', () => [])
  return { sms, whatsapp, editando, salvos }
}
