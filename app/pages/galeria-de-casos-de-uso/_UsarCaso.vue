<script setup lang="ts">
import { ICONE_DO_TIPO, TIPOS_EXTRAS, type CasoDeUso } from './mocks'
import type { Textos } from './textos'

/**
 * USAR UM CASO DE USO: o "Migrar Caso de Uso" de hoje.
 *
 * Hoje o produto pergunta só "Tem certeza que deseja migrar o caso de uso
 * selecionado? Podem ser cobrados valores adicionais por exceder produtos"
 * (texto `confirm_migration` do bundle da tela, 2026-10-20). A janela passa a
 * mostrar o que entra no workspace antes do clique e mantém os 2 avisos que o
 * produto já dá: a duplicação (o "Atenção" do topo) e a cobrança.
 *
 * O comportamento da migração não muda: ela soma ao workspace e roda por trás,
 * na tabela de Backup/Migração.
 */
const props = defineProps<{ t: Textos, caso: CasoDeUso | null }>()
const emit = defineEmits<{ fechar: [], usado: [caso: CasoDeUso] }>()

const aberta = computed({
  get: () => props.caso !== null,
  set: (v) => { if (!v) emit('fechar') },
})

const enviando = ref(false)
async function usar() {
  if (!props.caso) return
  enviando.value = true
  await new Promise(r => setTimeout(r, 1100))
  enviando.value = false
  emit('usado', props.caso)
}

/** Separado por tipo: categoria e menu podem ter o mesmo nome. */
const grupos = computed(() => {
  const c = props.caso
  if (!c) return []
  return [
    { titulo: props.t.incluiCategorias, linhas: c.categorias.map(x => ({ icone: x.icone, rotulo: x.nome, detalhe: props.t.nCampos(x.campos.length) })) },
    { titulo: props.t.incluiMenus, linhas: c.menus.map(m => ({ icone: m.icone, rotulo: m.rotulo, detalhe: props.t.nTelas(m.telas.length) })) },
    { titulo: props.t.incluiStatus, linhas: c.status.length ? [{ icone: 'i-lucide-circle-dot', rotulo: c.status.join(', '), detalhe: props.t.nStatus(c.status.length) }] : [] },
    // Rodada 4: os outros tipos de entidade que o caso leva.
    ...TIPOS_EXTRAS.map(tp => ({ titulo: props.t.tipos[tp].rotulo, linhas: (c.extras?.[tp] ?? []).map(nome => ({ icone: ICONE_DO_TIPO[tp], rotulo: nome, detalhe: '' })) })),
  ].filter(g => g.linhas.length)
})
</script>

<template>
  <UModal
    v-model:open="aberta"
    :title="props.caso ? props.t.usarTitulo(props.caso.nome) : ''"
    :description="props.t.usarDescricao"
    :dismissible="!enviando"
  >
    <template #body>
      <div v-if="props.caso" class="space-y-4">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-toned">{{ props.t.entraNoWorkspace }}</p>
          <div class="divide-y divide-default overflow-hidden rounded-lg border border-default">
            <div v-for="g in grupos" :key="g.titulo">
              <p class="bg-elevated/50 px-3 py-1.5 text-xs font-medium text-muted">{{ g.titulo }}</p>
              <ul class="divide-y divide-default">
                <li v-for="l in g.linhas" :key="l.rotulo" class="flex items-center gap-3 px-3 py-2">
                  <UIcon :name="l.icone" class="size-4 shrink-0 text-toned" />
                  <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ l.rotulo }}</span>
                  <span class="shrink-0 text-xs text-muted">{{ l.detalhe }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <UAlert color="warning" variant="subtle" icon="i-lucide-triangle-alert" :title="props.t.avisoTitulo">
          <template #description>
            <ul class="list-disc space-y-1 pl-4">
              <li>{{ props.t.avisoDuplicar }}</li>
              <li>{{ props.t.avisoCobranca }}</li>
            </ul>
          </template>
        </UAlert>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="props.t.cancelar" color="neutral" variant="outline" :disabled="enviando" @click="emit('fechar')" />
        <UButton :label="props.t.usarCaso" icon="i-lucide-check" color="primary" :loading="enviando" @click="usar" />
      </div>
    </template>
  </UModal>
</template>
