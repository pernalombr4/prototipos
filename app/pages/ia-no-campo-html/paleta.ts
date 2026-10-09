/**
 * As 10 cores do campo HTML, no padrão do Notion (mesmos nomes, mesma ordem;
 * ver PESQUISA-RODADA-2, "Tabela de cores do Notion").
 *
 * O HTML guarda o NOME da cor, numa variável (`var(--cor-texto-vermelho)`),
 * e o tom sai do tema: no claro, o 600 ou 700 da paleta do Tailwind; no
 * escuro, o 400. Assim o texto colorido passa de 4,5:1 nos 2 temas, o que
 * um hex fixo não consegue (achado da revisão de acessibilidade, rodada 2).
 * O fundo é a cor 500 a 22% sobre o transparente, que serve aos 2 temas.
 * Marrom não existe no Tailwind: é o âmbar.
 *
 * As variáveis entram no <html> por `aplicarPaleta`, chamada pelo campo:
 * os menus de cor abrem fora do campo (portal) e também precisam delas.
 */
export type NomeDaCor = 'padrao' | 'cinza' | 'marrom' | 'laranja' | 'amarelo' | 'verde' | 'azul' | 'roxo' | 'rosa' | 'vermelho'

type Tons = Record<Exclude<NomeDaCor, 'padrao'>, string>

const claro: Tons = {
  cinza: 'neutral-500', marrom: 'amber-800', laranja: 'orange-700', amarelo: 'yellow-700', verde: 'green-700',
  azul: 'blue-600', roxo: 'purple-600', rosa: 'pink-700', vermelho: 'red-600',
}
const escuro: Tons = {
  cinza: 'neutral-400', marrom: 'amber-400', laranja: 'orange-400', amarelo: 'yellow-400', verde: 'green-400',
  azul: 'blue-400', roxo: 'purple-400', rosa: 'pink-400', vermelho: 'red-400',
}
const fundo500: Tons = {
  cinza: 'neutral-500', marrom: 'amber-700', laranja: 'orange-500', amarelo: 'yellow-500', verde: 'green-500',
  azul: 'blue-500', roxo: 'purple-500', rosa: 'pink-500', vermelho: 'red-500',
}

export interface Cor { nome: NomeDaCor, texto: string | null, fundo: string | null }

export const cores: Cor[] = (['padrao', 'cinza', 'marrom', 'laranja', 'amarelo', 'verde', 'azul', 'roxo', 'rosa', 'vermelho'] as const).map(nome => ({
  nome,
  texto: nome === 'padrao' ? null : `var(--cor-texto-${nome})`,
  fundo: nome === 'padrao' ? null : `var(--cor-fundo-${nome})`,
}))

/** Põe as variáveis da paleta no <html>, no tom do tema. */
export function aplicarPaleta(temaEscuro: boolean) {
  if (typeof document === 'undefined') return
  const raiz = document.documentElement.style
  const tons = temaEscuro ? escuro : claro
  for (const nome of Object.keys(tons) as (keyof Tons)[]) {
    raiz.setProperty(`--cor-texto-${nome}`, `var(--color-${tons[nome]})`)
    raiz.setProperty(`--cor-fundo-${nome}`, `color-mix(in oklab, var(--color-${fundo500[nome]}) 22%, transparent)`)
  }
}

export type Uso = 'texto' | 'fundo'
export interface CorUsada { uso: Uso, cor: Cor }
