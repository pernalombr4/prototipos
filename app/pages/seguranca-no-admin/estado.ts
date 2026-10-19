/**
 * Estado que atravessa telas: a política de tokens limita a credencial da conta
 * de serviço, e a lista de destinos vale para o nó HTTP e para a IA.
 * Chaves com prefixo `sa-`: o "Reiniciar" do andaime limpa todas.
 */
import { regrasIniciais, tokens as tokensIniciais } from './mocks'
import type { RegraDeDestino, TokenDaOrg } from './mocks'
import type { ModoDeDestino } from './apoio'

export interface PoliticaDeTokens {
  validadeMax: number // dias; 0 = sem limite
  proibirSemValidade: boolean
  quemCria: 'todos' | 'ws' | 'org'
  aprovacao: boolean
  avisos: number[]
  /** Tokens que ficaram fora quando a política apertou, e o que se decidiu para eles. */
  tratamento: 'prazo' | 'bloquear' | 'registrar' | null
}

export const usePoliticaDeTokens = () => useState<PoliticaDeTokens>('sa-politica-tokens', () => ({
  validadeMax: 0,
  proibirSemValidade: false,
  quemCria: 'todos',
  aprovacao: false,
  avisos: [],
  tratamento: null,
}))

export const useTokens = () => useState<TokenDaOrg[]>('sa-tokens', () => structuredClone(tokensIniciais))

export const useDestinos = () => useState<{ modo: ModoDeDestino, regras: RegraDeDestino[] }>('sa-destinos', () => ({ modo: 'todos', regras: structuredClone(regrasIniciais) }))
