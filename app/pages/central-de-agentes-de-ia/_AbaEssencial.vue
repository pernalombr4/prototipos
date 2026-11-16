<script setup lang="ts">
/**
 * Aba Essencial. Continua com os campos de hoje na mesma ordem: nome,
 * descrição, instruções, ferramentas, modelo, tipo e status.
 *
 * PROPOSTA:
 * - Ferramentas vira um resumo com o link para a aba própria (o endereço fica);
 * - "Modelo" vira "Modelo padrão" com o nome do modelo, agrupado por empresa
 *   como no chat, e ganha "Modelos permitidos no chat" (demanda 2);
 * - "Sugestões na conversa nova" (PESQUISA: Notion, GPTs, Copilot Studio).
 */
import type { Textos } from './textos'
import type { Agente } from './mocks'
import { modeloPorId, nomeDoProvedor, iconeDoProvedor, provedoresEmOrdem, ferramentaPorSlug } from './catalogo'
import { conhecimentoDoAgente, fixadosCabemNo, useArquivos, usePoliticas } from './estado'

const props = defineProps<{ t: Textos, a: Agente, erro: boolean }>()
const emit = defineEmits<{ ir: [aba: 'ferramentas' | 'conhecimento'] }>()
const politicas = usePoliticas()
const arquivos = useArquivos()

const e = computed(() => props.t.essencial)
const MAX_INSTRUCOES = 20000

/* Modelos liberados nas Políticas, agrupados por empresa como no seletor do chat. */
/* Modelo que não comporta os documentos fixados do agente. */
const fixados = computed(() => conhecimentoDoAgente(props.a, arquivos.value).fixados)
const naoCabe = (id: string) => !fixadosCabemNo(modeloPorId(id)?.contexto ?? 0, fixados.value)

const itensDeModelo = computed(() => provedoresEmOrdem
  .map(p => politicas.value.modelos.map(modeloPorId).filter(m => m?.provider === p))
  .filter(g => g.length)
  .map(g => [
    { type: 'label' as const, label: nomeDoProvedor[g[0]!.provider] },
    ...g.map(m => ({ value: m!.id, label: m!.name, icon: iconeDoProvedor[m!.provider], naoCabe: naoCabe(m!.id) })),
  ]))

/* O padrão entra sempre entre os permitidos. */
watch(() => props.a.model, (m) => {
  if (m && !props.a.modelosPermitidos.includes(m)) props.a.modelosPermitidos.push(m)
}, { immediate: true })

const permitidos = computed({
  get: () => props.a.modelosPermitidos,
  set: (v: string[]) => { props.a.modelosPermitidos = v.includes(props.a.model) ? v : [props.a.model, ...v] },
})

function soPadrao() { props.a.modelosPermitidos = [props.a.model] }
function recomendados() {
  const prov = modeloPorId(props.a.model)?.provider
  props.a.modelosPermitidos = politicas.value.modelos.filter(id => modeloPorId(id)?.provider === prov && !naoCabe(id))
}

const ligadas = computed(() => Object.keys(props.a.ferramentas))
const pedem = computed(() => Object.values(props.a.ferramentas).filter(x => x === 'confirmar').length)
const grupos = computed(() => [...new Set(ligadas.value.map(s => ferramentaPorSlug(s).grupo))])

const tipos = computed(() => (['chat', 'reviewer'] as const).map(k => ({ value: k, label: e.value.tipos[k], description: e.value.tiposDescricao[k] })))
const statusOpcoes = computed(() => (['active', 'inactive'] as const).map(k => ({ value: k, label: e.value.statusOpcoes[k] })))

const nomeDoModelo = (id: string) => modeloPorId(id)?.name ?? id
</script>

<template>
  <div class="grid gap-x-8 gap-y-6 lg:grid-cols-[1fr_20rem]">
    <div class="space-y-5">
      <UFormField :label="e.nome" required :error="erro && !a.name.trim() ? ' ' : false">
        <UInput v-model="a.name" :placeholder="e.nomePlaceholder" class="w-full" :maxlength="80" />
      </UFormField>

      <UFormField :label="e.descricao" :help="e.descricaoAjuda" required :error="erro && !a.description.trim() ? ' ' : false">
        <UTextarea v-model="a.description" :placeholder="e.descricaoPlaceholder" :rows="2" autoresize class="w-full" :maxlength="300" />
      </UFormField>

      <UFormField :label="e.instrucoes" :help="e.instrucoesAjuda" required :error="erro && !a.instructions?.trim() ? ' ' : false">
        <template #hint>
          <span class="text-xs tabular-nums text-dimmed">{{ e.caracteres(a.instructions?.length ?? 0, MAX_INSTRUCOES) }}</span>
        </template>
        <UTextarea v-model="a.instructions!" :placeholder="e.instrucoesPlaceholder" :rows="12" autoresize :maxrows="24" class="w-full font-mono text-[13px]" :maxlength="MAX_INSTRUCOES" />
      </UFormField>

      <UFormField :label="e.sugestoes" :help="e.sugestoesAjuda">
        <UInputTags v-model="a.sugestoes" :placeholder="e.sugestoesPlaceholder" class="w-full" :max-length="60" />
      </UFormField>
    </div>

    <div class="space-y-5">
      <UFormField :label="e.modeloPadrao" :help="e.modeloPadraoAjuda">
        <USelectMenu v-model="a.model" :items="itensDeModelo" value-key="value" class="w-full" :search-input="{ placeholder: t.seletorDeModelo.buscar }">
          <template #leading>
            <UIcon v-if="modeloPorId(a.model)" :name="iconeDoProvedor[modeloPorId(a.model)!.provider]" class="size-4" />
          </template>
          <template #default>{{ nomeDoModelo(a.model) }}</template>
          <template #item-trailing="{ item }">
            <span v-if="(item as any).naoCabe" class="text-xs text-error">{{ t.seletorDeModelo.naoCabe }}</span>
          </template>
        </USelectMenu>
      </UFormField>

      <UFormField :label="e.modelosPermitidos" :help="e.modelosPermitidosAjuda">
        <USelectMenu
          v-model="permitidos"
          :items="itensDeModelo"
          value-key="value"
          multiple
          class="w-full"
          :placeholder="e.modelosPermitidosPlaceholder"
          :search-input="{ placeholder: t.seletorDeModelo.buscar }"
        >
          <template #default>
            <span class="flex flex-wrap gap-1 py-0.5">
              <UBadge
                v-for="id in permitidos"
                :key="id"
                :label="nomeDoModelo(id)"
                :icon="id === a.model ? 'i-lucide-star' : undefined"
                :color="id === a.model ? 'primary' : 'neutral'"
                variant="soft"
                size="sm"
              />
            </span>
          </template>
          <template #item-trailing="{ item }">
            <span v-if="(item as any).value === a.model" class="text-xs text-primary">{{ t.seletorDeModelo.padraoCurto }}</span>
            <span v-else-if="(item as any).naoCabe" class="text-xs text-error">{{ t.seletorDeModelo.naoCabe }}</span>
          </template>
        </USelectMenu>
        <div class="mt-1.5 flex flex-wrap gap-x-3">
          <UButton :label="e.atalhoSoPadrao" color="neutral" variant="link" size="xs" class="px-0" @click="soPadrao" />
          <UButton :label="e.atalhoRecomendados" color="neutral" variant="link" size="xs" class="px-0" @click="recomendados" />
        </div>
        <p v-if="permitidos.length === 1" class="mt-1 flex items-center gap-1 text-xs text-muted">
          <UIcon name="i-lucide-lock" class="size-3" />{{ t.seletorDeModelo.fixo }}
        </p>
      </UFormField>

      <!-- Ferramentas: o resumo fica aqui, a escolha vai para a aba própria -->
      <div class="rounded-lg border border-default p-3">
        <div class="mb-1 flex items-center gap-2">
          <UIcon name="i-lucide-wrench" class="size-4 text-muted" />
          <span class="text-sm font-medium text-highlighted">{{ e.ferramentas }}</span>
        </div>
        <p class="text-sm text-muted">{{ ligadas.length ? e.ferramentasResumo(ligadas.length, pedem) : e.ferramentasNenhuma }}</p>
        <div v-if="grupos.length" class="mt-2 flex flex-wrap gap-1">
          <UBadge v-for="g in grupos" :key="g" :label="t.ferramentas.grupos[g]" color="neutral" variant="outline" size="sm" />
        </div>
        <UButton :label="e.configurarFerramentas" trailing-icon="i-lucide-arrow-right" color="neutral" variant="outline" size="sm" class="mt-3" @click="emit('ir', 'ferramentas')" />
      </div>

      <UFormField :label="e.tipo">
        <USelect v-model="a.type" :items="tipos" value-key="value" class="w-full">
          <template #item-label="{ item }">
            <span class="flex flex-col">
              <span>{{ item.label }}</span>
              <span class="text-xs text-muted">{{ item.description }}</span>
            </span>
          </template>
        </USelect>
      </UFormField>

      <UFormField :label="e.status" :help="e.statusAjuda">
        <USelect v-model="a.status" :items="statusOpcoes" value-key="value" class="w-full" />
      </UFormField>
    </div>
  </div>
</template>
