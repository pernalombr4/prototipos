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
 * O de IA que ainda não dá para conectar aparece com "Em breve".
 */
import type { Textos } from './textos'
import type { Modelo } from './mocks'
import { modelos } from './mocks'
import { iaDoModelo, pedirConexao, useIasConectadas } from './ias'
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
const liberado = (id: string) => {
  const ia = iaDoModelo(id)
  return !ia || conectadas.value.includes(ia.id)
}
const atualSemConexao = computed(() => !liberado(atual.value.id))

/* Liberados primeiro; depois os que pedem conexão; por último os "Em breve". */
const peso = (m: Modelo) => liberado(m.id) ? 0 : iaDoModelo(m.id)?.disponivel ? 1 : 2
const ordenados = computed(() => [...modelos].sort((a, b) => peso(a) - peso(b)))
const primeiroSemConexao = computed(() => ordenados.value.find(m => peso(m) > 0)?.id)

function escolher(m: Modelo) {
  aberto.value = false
  const ia = iaDoModelo(m.id)
  if (liberado(m.id) || !ia) {
    modelo.value = m.id
    return
  }
  if (!ia.disponivel) return
  pedirConexao({
    ia: ia.id,
    motivo: props.t.conectar.paraOModelo(m.nome, ia.nome),
    aoVoltar: (conectou) => { if (conectou.includes(ia.id)) modelo.value = m.id },
  })
}
</script>

<template>
  <UPopover v-model:open="aberto" :content="{ align: 'start', side: 'top', sideOffset: 6 }">
    <UButton color="neutral" variant="ghost" size="xs" class="gap-1 px-1.5" :aria-label="`${t.modelo.rotulo}: ${atual.nome}`">
      <UIcon v-if="atualSemConexao" name="i-lucide-unplug" class="size-3.5 text-warning" />
      <UIcon v-else name="i-lucide-cpu" class="size-3.5 text-muted" />
      <span class="max-w-32 truncate text-xs" :class="trocado || atualSemConexao ? 'font-semibold text-warning' : 'text-toned'">{{ atual.nome }}</span>
      <UIcon name="i-lucide-chevron-down" class="size-3.5 text-muted" />
    </UButton>

    <template #content>
      <div class="w-84 p-1.5">
        <p class="px-2 pb-1 pt-1 text-xs font-semibold text-muted">{{ t.modelo.rotulo }}</p>
        <ul class="flex max-h-80 flex-col overflow-y-auto" role="listbox" :aria-label="t.modelo.rotulo">
          <li v-for="m in ordenados" :key="m.id">
            <p v-if="m.id === primeiroSemConexao" class="mt-1 border-t border-default px-2 pb-1 pt-2 text-xs font-semibold text-muted">{{ t.modelo.precisaConectar }}</p>
            <button
              type="button"
              role="option"
              :aria-selected="m.id === modelo"
              :aria-disabled="!liberado(m.id) && !iaDoModelo(m.id)?.disponivel"
              class="group flex w-full items-start gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated focus-visible:bg-elevated focus-visible:outline-none aria-disabled:cursor-not-allowed"
              @click="escolher(m)"
            >
              <UIcon v-if="m.id === 'auto'" name="i-lucide-sparkles" class="mt-0.5 size-4 shrink-0 text-primary" />
              <LogoDaIa v-else-if="iaDoModelo(m.id)" :ia="iaDoModelo(m.id)!.id" class="mt-0.5 size-4 shrink-0 text-muted" />
              <span class="min-w-0 flex-1" :class="liberado(m.id) ? '' : 'opacity-60'">
                <span class="flex items-center gap-1.5">
                  <span class="text-sm font-medium text-highlighted">{{ m.nome }}</span>
                  <span v-if="m.provedor" class="text-xs text-dimmed">{{ m.provedor }}</span>
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
              <UBadge
                v-else-if="!liberado(m.id)"
                :label="iaDoModelo(m.id)?.disponivel ? t.modelo.conectar : t.modelo.emBreve"
                :icon="iaDoModelo(m.id)?.disponivel ? 'i-lucide-plug' : undefined"
                :color="iaDoModelo(m.id)?.disponivel ? 'primary' : 'neutral'"
                variant="subtle"
                size="sm"
                class="shrink-0"
                :aria-label="iaDoModelo(m.id)?.disponivel ? t.modelo.semConexao(iaDoModelo(m.id)!.nome) : t.modelo.emBreve"
              />
            </button>
          </li>
        </ul>
        <p v-if="trocado" class="mx-1 mt-1 flex items-start gap-1.5 rounded-md bg-warning/10 px-2 py-1.5 text-xs text-warning">
          <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />{{ t.modelo.soNestePedido(nomeDoAgente) }}
        </p>
      </div>
    </template>
  </UPopover>
</template>
