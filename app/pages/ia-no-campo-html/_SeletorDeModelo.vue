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
 * Rodada 7: cada modelo depende de uma IA conectada no workspace (ias.ts). O
 * de IA não conectada aparece apagado, com "Conectar": o clique abre o modal
 * "Conectar uma IA" no passo da chave e, conectada, o modelo fica escolhido.
 *
 * Rodada 9: com mais de uma IA, ninguém escolhe "a integração": escolher o
 * modelo já escolhe a IA (Notion, GitHub Copilot, Raycast). Os modelos vêm
 * agrupados por IA, com o logo no título: Auto no topo, as conectadas, as que
 * pedem conexão e as "Em breve". Quem administra tem "Conectar outra IA" no
 * rodapé, como o "Manage Models" do Copilot no VS Code. A escolha fica para os
 * próximos pedidos da sessão (o agente continua trazendo o modelo dele).
 */
import type { Textos } from './textos'
import type { Modelo } from './mocks'
import type { IaConectavel } from './ias'
import { modelos } from './mocks'
import { iaDoModelo, ias, modelosDa, pedirConexao, useIasConectadas } from './ias'
import LogoDaIa from './_LogoDaIa.vue'

const props = defineProps<{
  t: Textos
  /** O modelo do perfil do agente; vazio com o BENI. */
  doAgente?: string | null
  /** quem administra vê "Conectar outra IA" no rodapé */
  podeConectar?: boolean
}>()
const modelo = defineModel<string>({ required: true })
const aberto = ref(false)

const atual = computed(() => modelos.find(m => m.id === modelo.value) ?? modelos[0]!)
const nomeDoAgente = computed(() => modelos.find(m => m.id === props.doAgente)?.nome ?? '')
const trocado = computed(() => !!props.doAgente && modelo.value !== props.doAgente)

const conectadas = useIasConectadas()
const liberado = (id: string) => {
  const ia = iaDoModelo(id)
  return !ia || conectadas.value.includes(ia.id)
}
const atualSemConexao = computed(() => !liberado(atual.value.id))

type Estado = 'conectada' | 'conectar' | 'breve'
const ordem: Record<Estado, number> = { conectada: 0, conectar: 1, breve: 2 }
const grupos = computed(() => ias
  .map(ia => ({
    ia,
    estado: (conectadas.value.includes(ia.id) ? 'conectada' : ia.disponivel ? 'conectar' : 'breve') as Estado,
    modelos: modelosDa(ia.id),
  }))
  .filter(g => g.modelos.length)
  .sort((a, b) => ordem[a.estado] - ordem[b.estado]))
/* Auto no topo, sem título; depois um grupo por IA. */
const auto = modelos.find(m => m.id === 'auto')!
const lista = computed(() => [{ ia: null as IaConectavel | null, estado: 'conectada' as Estado, modelos: [auto] }, ...grupos.value])
const faltaConectar = computed(() => ias.some(i => i.disponivel && !conectadas.value.includes(i.id)))

function conectar(ia: IaConectavel, m?: Modelo) {
  aberto.value = false
  pedirConexao({
    ia: ia.id,
    motivo: m ? props.t.conectar.paraOModelo(m.nome, ia.nome) : undefined,
    aoVoltar: (conectou) => { if (m && conectou.includes(ia.id)) modelo.value = m.id },
  })
}

function escolher(m: Modelo) {
  const ia = iaDoModelo(m.id)
  if (liberado(m.id) || !ia) {
    modelo.value = m.id
    aberto.value = false
    return
  }
  if (ia.disponivel) conectar(ia, m)
}

function verIas() {
  aberto.value = false
  pedirConexao({})
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'top', sideOffset: 6 }">
    <UButton color="neutral" variant="ghost" size="xs" class="gap-1 px-1.5" :aria-label="`${t.modelo.rotulo}: ${atual.nome}`">
      <UIcon v-if="atualSemConexao" name="i-lucide-unplug" class="size-3.5 text-warning" />
      <UIcon v-else-if="atual.id === 'auto'" name="i-lucide-sparkles" class="size-3.5 text-muted" />
      <LogoDaIa v-else-if="iaDoModelo(atual.id)" :ia="iaDoModelo(atual.id)!.id" class="size-3.5 text-muted" />
      <span class="max-w-32 truncate text-xs" :class="trocado || atualSemConexao ? 'font-semibold text-warning' : 'text-toned'">{{ atual.nome }}</span>
      <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
    </UButton>

    <template #content>
      <div class="w-84 p-1.5">
        <p class="px-2 pb-1 pt-1 text-xs font-semibold text-muted">{{ t.modelo.rotulo }}</p>
        <div class="flex max-h-80 flex-col overflow-y-auto" role="listbox" :aria-label="t.modelo.rotulo">
          <!-- O modelo, numa linha: perfil, velocidade, inteligência e consumo -->
          <template v-for="g in lista" :key="g.ia?.id ?? 'auto'">
            <div
              v-if="g.ia"
              role="presentation"
              class="mt-1 flex items-center gap-1.5 border-t border-default px-2 pb-1 pt-2 text-xs"
            >
              <LogoDaIa :ia="g.ia.id" class="size-3.5 shrink-0" :class="g.estado === 'conectada' ? 'text-highlighted' : 'text-dimmed'" />
              <span class="font-semibold" :class="g.estado === 'conectada' ? 'text-highlighted' : 'text-muted'">{{ g.ia.nome }}</span>
              <span class="text-dimmed">{{ g.ia.empresa }}</span>
              <UButton
                v-if="g.estado === 'conectar'"
                :label="t.modelo.conectar"
                icon="i-lucide-plug"
                color="primary"
                variant="soft"
                size="xs"
                class="ms-auto"
                :aria-label="t.modelo.semConexao(g.ia.nome)"
                @click="conectar(g.ia)"
              />
              <UBadge v-else-if="g.estado === 'breve'" :label="t.modelo.emBreve" color="neutral" variant="subtle" size="sm" class="ms-auto" />
            </div>
            <button
              v-for="m in g.modelos"
              :key="m.id"
              type="button"
              role="option"
              :aria-selected="m.id === modelo"
              :aria-disabled="g.estado === 'breve'"
              class="group flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none aria-disabled:cursor-not-allowed"
              @click="escolher(m)"
            >
              <UIcon v-if="m.id === 'auto'" name="i-lucide-sparkles" class="mt-0.5 size-4 shrink-0 text-primary" />
              <span v-else class="w-4 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1" :class="g.estado === 'conectada' ? '' : 'opacity-60'">
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
                  <span>{{ t.modelo.consumo }}: {{ t.modelo.consumos[m.custo] }}</span>
                </span>
              </span>
              <UIcon v-if="m.id === modelo && liberado(m.id)" name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary" />
            </button>
          </template>
        </div>
        <p v-if="trocado" class="mx-1 mt-1 flex items-start gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
          <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.modelo.soNestePedido(nomeDoAgente) }}
        </p>
        <div v-if="podeConectar" class="mt-1 border-t border-default pt-1">
          <UButton
            :label="faltaConectar ? t.modelo.conectarOutra : t.modelo.verConectadas"
            :icon="faltaConectar ? 'i-lucide-plus' : 'i-lucide-plug'"
            color="neutral"
            variant="ghost"
            size="xs"
            block
            class="justify-start text-muted"
            @click="verIas"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
