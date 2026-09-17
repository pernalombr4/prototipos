<script setup lang="ts">
import { useMenuDoWorkspace } from './estado'
import { modulos, secoesDeModulo } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * A tela de Módulos, em `Configurações > Workspace > Módulos`.
 *
 * Rodada 8. Ela pediu: "o enspace tem módulos (que sao ativados dentro de
 * sistema > informaçoes gerais), mas eles precisam passar a ter mais destaque no
 * menu, ser uma opçao pra fora dali".
 *
 * Duas coisas acontecem aqui:
 *
 * 1. A tela SAIU de dentro de Informações Básicas e virou item próprio das
 *    configurações. Ligar um módulo muda o menu de todo o workspace, e isso é
 *    grande demais para viver como uma seção no fim de outra tela.
 *
 * 2. Cada módulo diz O QUE ELE ACRESCENTA ao menu, antes de ser ligado. Hoje a
 *    pessoa liga e vai procurar; aqui ela lê a lista e decide.
 *
 * A chave funciona de verdade: ligar acrescenta a seção do módulo ao menu
 * lateral na hora, desligar tira. É o único lugar do miolo da direita que não é
 * maquete, porque é exatamente o mecanismo que ela mandou mostrar.
 */
const props = defineProps<{ t: TextosDaTela }>()

const menu = useMenuDoWorkspace()

const descricoes: Record<string, { nome: string, desc: string }> = {
  'comparacoes': { nome: props.t.moduloComparacoes, desc: props.t.moduloComparacoesDesc },
  'correcao-monetaria': { nome: props.t.moduloCorrecao, desc: props.t.moduloCorrecaoDesc },
}

/** O que cada módulo acrescenta ao menu, lido da própria árvore. */
function oQueTraz(moduloId: string) {
  const secao = secoesDeModulo.find(s => s.moduloId === moduloId)
  if (!secao) return []
  return [secao.rotulo ?? '', ...(secao.filhos ?? []).map(f => f.rotulo ?? '')]
}

function ligado(id: string) {
  return menu.modulosAtivos.value.includes(id)
}
</script>

<template>
  <div class="animate-[entrada_0.25s_ease-out_both]">
    <h1 class="mb-1 text-xl font-bold text-highlighted">{{ props.t.modulosTitulo }}</h1>
    <p class="mb-3 max-w-2xl text-sm leading-relaxed text-muted">{{ props.t.modulosDescricao }}</p>

    <UAlert
      icon="i-lucide-arrow-up-right"
      color="neutral"
      variant="subtle"
      :description="props.t.modulosOndeFica"
      class="mb-4 max-w-2xl"
    />

    <div class="max-w-2xl space-y-3">
      <div
        v-for="m in modulos"
        :key="m.id"
        class="rounded-xl border p-4 transition-colors"
        :class="ligado(m.id) ? 'border-primary/40 bg-primary/5' : 'border-default'"
      >
        <div class="flex items-start gap-3">
          <UIcon
            :name="m.icone"
            class="mt-0.5 size-5 shrink-0"
            :class="ligado(m.id) ? 'text-primary' : 'text-toned'"
          />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-highlighted">{{ descricoes[m.id]?.nome }}</p>
            <p class="mt-0.5 text-sm leading-relaxed text-muted">{{ descricoes[m.id]?.desc }}</p>
          </div>
          <USwitch
            :model-value="ligado(m.id)"
            :aria-label="descricoes[m.id]?.nome"
            @update:model-value="menu.alternarModulo(m.id)"
          />
        </div>

        <!-- O que ele põe no menu, dito antes de ligar. -->
        <div class="mt-3 border-t border-default pt-3">
          <p class="mb-1.5 text-xs font-semibold uppercase tracking-wider text-toned">
            {{ props.t.modulosTraz }}
          </p>
          <div class="flex flex-wrap gap-1.5">
            <UBadge
              v-for="(entrada, i) in oQueTraz(m.id)"
              :key="entrada"
              :label="entrada"
              size="sm"
              :color="ligado(m.id) ? 'primary' : 'neutral'"
              :variant="i === 0 ? 'solid' : 'subtle'"
            />
          </div>
        </div>
      </div>
    </div>

    <p class="mt-4 text-sm text-muted">
      {{ menu.modulosAtivos.value.length
        ? props.t.modulosAtivos(menu.modulosAtivos.value.length)
        : props.t.modulosNadaAtivo }}
    </p>
  </div>
</template>
