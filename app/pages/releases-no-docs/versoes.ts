/**
 * PROPOSTA. As versões montadas a partir dos itens do mock: 1 versão por número (3.4.0, 3.4.2),
 * com o título e os rótulos que a trilha da aba Releases usa.
 *
 * Rodada 4: o texto de cada versão é lido na própria trilha (o `_Changelog.vue` monta a prosa).
 *
 * Rodada 3: o tamanho da versão (grande, média, pequena) vem do número, como no versionamento
 * semântico (major, minor, patch). O tipo de cada item (novidade, melhoria, correção) fica dentro
 * da página da versão.
 */
import type { Idioma } from '~/composables/useIdioma'
import { entradas, mudancaDe, postsDaProposta, postsDeHoje, type ChaveDeModulo, type Entrada } from './mocks'
import { formatarData, type Textos } from './textos'

export type Tamanho = 'major' | 'minor' | 'patch'

export const tamanhoDaVersao = (v: string): Tamanho => (v.endsWith('.0.0') ? 'major' : v.endsWith('.0') ? 'minor' : 'patch')

/** O id da versão na trilha e no endereço: 3.4.2 vira "v3-4-2". */
export const ancoraDaVersao = (v: string) => `v${v.replaceAll('.', '-')}`

const ordemDoTipo = { novidade: 0, melhoria: 1, correcao: 2 } as const

export function montarVersoes(t: Textos, idioma: Idioma) {
  const mapa = new Map<string, Entrada[]>()
  for (const e of entradas) {
    if (!mapa.has(e.versao)) mapa.set(e.versao, [])
    mapa.get(e.versao)!.push(e)
  }
  return [...mapa.entries()].map(([versao, todos]) => {
    const itens = todos.toSorted((a, b) => ordemDoTipo[a.tipo] - ordemDoTipo[b.tipo] || (a.tier ?? 9) - (b.tier ?? 9))
    const post = postsDeHoje.find(p => p.versao === versao)
    const emBreve = itens.every(e => e.estado === 'em-breve')
    const data = post?.data ?? itens.map(e => e.data).sort().at(emBreve ? 0 : -1)!
    const contagem = (['novidade', 'melhoria', 'correcao'] as const)
      .map(tp => ({ tp, n: itens.filter(e => e.tipo === tp).length }))
      .filter(x => x.n)
    const prazos = itens.map(e => mudancaDe(e.mudanca)).filter(m => !!m).map(m => m!.fases.obrigatoria).sort()
    const tamanho = tamanhoDaVersao(versao)
    return {
      versao,
      id: ancoraDaVersao(versao),
      tamanho,
      emBreve,
      data,
      mes: data.slice(0, 7),
      cor: post?.cor ?? (tamanho === 'patch' ? 'purple' : 'orange'),
      itens,
      titulo: emBreve ? t.releases.emBreveTitulo(versao) : t.releases.noAr(versao),
      /** Rodada 5: com o texto fechado, o resumo curto diz o que a versão traz. Em breve diz a data prevista. */
      descricao: emBreve
        ? t.releases.emBreveDescricao(formatarData(data, idioma, { day: 'numeric', month: 'long', year: 'numeric' }))
        : t.releases.resumoDaVersao(itens.length, contagem.map(x => t.releases.partes[x.tp](x.n))),
      prazo: prazos[0],
      mudanca: itens.find(e => e.mudanca)?.mudanca,
      liberando: itens.some(e => e.estado === 'liberando'),
      acessos: [...new Set(itens.map(e => e.acesso).filter(a => !!a))] as NonNullable<Entrada['acesso']>[],
      alguns: itens.some(e => e.publico === 'alguns'),
      modulos: [...new Set(itens.map(e => e.modulo))] as ChaveDeModulo[],
      temDestaque: itens.some(e => e.tier === 1 || e.tier === 2),
      /** A versão entra no post do mês quando tem item Tier 1 ou 2 e o mês tem post. */
      emPostDoMes: !emBreve && itens.some(e => e.tier === 1 || e.tier === 2) && postsDaProposta.some(p => p.mes === data.slice(0, 7)),
    }
  })
}

export type Versao = ReturnType<typeof montarVersoes>[number]
