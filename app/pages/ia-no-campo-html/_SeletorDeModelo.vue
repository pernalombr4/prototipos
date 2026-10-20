<script setup lang="ts">
/**
 * Seletor de modelo da caixa do BENI. PROPOSTA.
 *
 * No formato do "Auto" do Notion: cada modelo com o perfil, a velocidade e a
 * inteligência de 1 a 5 e o consumo de en-credits. Com o BENI, a pessoa
 * escolhe livre. Com um agente, o modelo do perfil dele vem marcado "do
 * agente"; a pessoa pode trocar só para este pedido, e o seletor avisa que o
 * perfil não muda (pedido da redatora em 09/10/2026).
 *
 * Rodada 9: escolher o modelo já escolhe a empresa (Notion, GitHub Copilot,
 * Raycast). Os modelos vêm agrupados por empresa, com o logo no título e o
 * Auto no topo. A escolha fica para os próximos pedidos da sessão (o agente
 * continua trazendo o modelo dele).
 *
 * Rodada 10: todos os modelos funcionam sem chave, cobrados em en-credits
 * (redatora, 2026-10-20). Nenhum fica apagado. O que muda com a chave de uma
 * conta própria é a cobrança: o grupo daquela empresa ganha o selo "Sua conta"
 * com o ícone de chave (como o Raycast marca os modelos da chave própria), e
 * cada modelo diz "Cobrado na conta OpenAI" no lugar do consumo de
 * en-credits. O rodapé, como o "Manage Models" do Copilot no VS Code, leva ao
 * modal das chaves.
 */
import type { Textos } from './textos'
import type { Modelo } from './mocks'
import type { IaConectavel } from './ias'
import { modelos } from './mocks'
import { iaDoModelo, ias, modelosDa, pedirConexao, useIasConectadas, useSemCreditos } from './ias'
import LogoDaIa from './_LogoDaIa.vue'

const props = defineProps<{
  t: Textos
  /** O modelo do perfil do agente; vazio com o BENI. */
  doAgente?: string | null
}>()
const modelo = defineModel<string>({ required: true })
const aberto = ref(false)

const atual = computed(() => modelos.find(m => m.id === modelo.value) ?? modelos[0]!)
const nomeDoAgente = computed(() => modelos.find(m => m.id === props.doAgente)?.nome ?? '')
const trocado = computed(() => !!props.doAgente && modelo.value !== props.doAgente)

const conectadas = useIasConectadas()
/* Sem en-credits (rodada 11), o modelo sem chave diz isso no lugar do consumo. */
const semCreditos = useSemCreditos()
const naConta = (ia: IaConectavel | null) => !!ia && conectadas.value.includes(ia.id)

/* Auto no topo, sem título; depois um grupo por empresa, na ordem de ias.ts. */
const auto = modelos.find(m => m.id === 'auto')!
const lista = computed(() => [
  { ia: null as IaConectavel | null, modelos: [auto] },
  ...ias.map(ia => ({ ia: ia as IaConectavel | null, modelos: modelosDa(ia.id) })).filter(g => g.modelos.length),
])
const faltaConectar = computed(() => ias.some(i => i.disponivel && !conectadas.value.includes(i.id)))

function escolher(m: Modelo) {
  modelo.value = m.id
  aberto.value = false
}

function verChaves() {
  aberto.value = false
  pedirConexao({})
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'top', sideOffset: 6 }">
    <UButton color="neutral" variant="ghost" size="xs" class="gap-1 px-1.5" :aria-label="`${t.modelo.rotulo}: ${atual.nome}`">
      <UIcon v-if="atual.id === 'auto'" name="i-lucide-sparkles" class="size-3.5 text-muted" />
      <LogoDaIa v-else-if="iaDoModelo(atual.id)" :ia="iaDoModelo(atual.id)!.id" class="size-3.5 text-muted" />
      <span class="max-w-32 truncate text-xs" :class="trocado ? 'font-semibold text-warning' : 'text-toned'">{{ atual.nome }}</span>
      <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
    </UButton>

    <template #content>
      <div class="w-84 p-1.5">
        <p class="px-2 pb-1 pt-1 text-xs font-semibold text-muted">{{ t.modelo.rotulo }}</p>
        <div class="flex max-h-80 flex-col overflow-y-auto" role="listbox" :aria-label="t.modelo.rotulo">
          <template v-for="g in lista" :key="g.ia?.id ?? 'auto'">
            <div
              v-if="g.ia"
              role="presentation"
              class="mt-1 flex items-center gap-1.5 border-t border-default px-2 pb-1 pt-2 text-xs"
            >
              <LogoDaIa :ia="g.ia.id" class="size-3.5 shrink-0 text-highlighted" />
              <span class="font-semibold text-highlighted">{{ g.ia.nome }}</span>
              <span class="text-dimmed">{{ g.ia.empresa }}</span>
              <UBadge v-if="naConta(g.ia)" :label="t.modelo.suaConta" icon="i-lucide-key-round" color="primary" variant="subtle" size="sm" class="ms-auto" />
            </div>
            <!-- O modelo, numa linha: perfil, velocidade, inteligência e quem paga -->
            <button
              v-for="m in g.modelos"
              :key="m.id"
              type="button"
              role="option"
              :aria-selected="m.id === modelo"
              class="group flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none"
              @click="escolher(m)"
            >
              <UIcon v-if="m.id === 'auto'" name="i-lucide-sparkles" class="mt-0.5 size-4 shrink-0 text-primary" />
              <span v-else class="w-4 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5">
                  <span class="text-sm font-medium text-highlighted">{{ m.nome }}</span>
                  <UBadge v-if="m.id === doAgente" :label="t.modelo.doAgente" color="primary" variant="soft" size="sm" />
                </span>
                <span class="block text-xs text-muted">{{ t.modelo.descricoes[m.id] }}</span>
                <span class="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-dimmed">
                  <span class="flex items-center gap-1" :aria-label="`${t.modelo.velocidade} ${m.velocidade}/5`">
                    {{ t.modelo.velocidade }}
                    <span class="flex gap-0.5" aria-hidden="true"><span v-for="i in 5" :key="i" class="size-1.5 rounded-full" :class="i <= m.velocidade ? 'bg-primary' : 'bg-accented'" /></span>
                  </span>
                  <span class="flex items-center gap-1" :aria-label="`${t.modelo.inteligencia} ${m.inteligencia}/5`">
                    {{ t.modelo.inteligencia }}
                    <span class="flex gap-0.5" aria-hidden="true"><span v-for="i in 5" :key="i" class="size-1.5 rounded-full" :class="i <= m.inteligencia ? 'bg-primary' : 'bg-accented'" /></span>
                  </span>
                  <span v-if="naConta(g.ia)" class="flex items-center gap-1 text-primary">
                    <UIcon name="i-lucide-key-round" class="size-3" />{{ t.modelo.cobradoNaConta(g.ia!.empresa) }}
                  </span>
                  <span v-else-if="semCreditos" class="flex items-center gap-1 text-warning">
                    <UIcon name="i-lucide-coins" class="size-3" />{{ t.modelo.semCreditos }}
                  </span>
                  <span v-else>{{ t.modelo.consumo }}: {{ t.modelo.consumos[m.custo] }}</span>
                </span>
              </span>
              <UIcon v-if="m.id === modelo" name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary" />
            </button>
          </template>
        </div>
        <p v-if="trocado" class="mx-1 mt-1 flex items-start gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
          <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.modelo.soNestePedido(nomeDoAgente) }}
        </p>
        <div class="mt-1 border-t border-default pt-1">
          <UButton
            :label="faltaConectar ? t.modelo.usarChave : t.modelo.verChaves"
            icon="i-lucide-key-round"
            color="neutral"
            variant="outline"
            size="xs"
            block
            @click="verChaves"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
