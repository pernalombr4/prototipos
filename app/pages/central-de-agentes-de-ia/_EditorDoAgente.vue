<script setup lang="ts">
/**
 * O cadastro do agente. Continua na gaveta da direita, com as abas Essencial,
 * Personalização e Testar no lugar de hoje; as abas novas entram entre elas e
 * depois de Testar (regra 20: o que existia continua onde estava).
 *
 * Salvar grava direto, como hoje: sem rascunho e sem versão (pedido da
 * redatora na rodada 2). O agente em edição é uma cópia; nada muda na lista
 * até salvar.
 */
import type { Textos } from './textos'
import AvatarDoAgente from './_AvatarDoAgente.vue'
import AbaEssencial from './_AbaEssencial.vue'
import AbaPersonalizacao from './_AbaPersonalizacao.vue'
import AbaFerramentas from './_AbaFerramentas.vue'
import AbaConhecimento from './_AbaConhecimento.vue'
import AbaRespostas from './_AbaRespostas.vue'
import AbaAcesso from './_AbaAcesso.vue'
import AbaTestar from './_AbaTestar.vue'
import AbaDesempenho from './_AbaDesempenho.vue'
import { EU, type Agente } from './mocks'
import { agenteVazio, espera, useAgentes, useTela, type AbaDoEditor } from './estado'

const props = defineProps<{ t: Textos }>()
const tela = useTela()
const agentes = useAgentes()
const toast = useToast()

const rascunho = ref<Agente>(agenteVazio(EU))
const novo = ref(true)
const publicando = ref(false)
const comparando = ref(false)

/* Abre: copia o agente para o rascunho local. */
watch(() => [tela.value.editorAberto, tela.value.editando], ([aberto]) => {
  if (!aberto) return
  const a = agentes.value.find(x => x.slug === tela.value.editando)
  novo.value = !a
  rascunho.value = JSON.parse(JSON.stringify(a ?? agenteVazio(EU)))
}, { immediate: true })

const aberto = computed({
  get: () => tela.value.editorAberto,
  set: (v) => { tela.value.editorAberto = v },
})

const aba = computed({
  get: () => tela.value.abaDoEditor,
  set: (v: AbaDoEditor) => { tela.value.abaDoEditor = v },
})

/* O que falta para publicar, por aba. */
const faltando = computed(() => {
  const r = rascunho.value
  const e = props.t.essencial
  const p = props.t.personalizacao
  const essencial = [!r.name.trim() && e.nome, !r.description.trim() && e.descricao, !r.instructions?.trim() && e.instrucoes].filter(Boolean) as string[]
  const personalizacao = [!r.role.trim() && p.papel, !r.approach.trim() && p.abordagem, r.rules.some(x => x.length > 255) && p.regras].filter(Boolean) as string[]
  return { essencial, personalizacao }
})
const podePublicar = computed(() => !faltando.value.essencial.length && !faltando.value.personalizacao.length)
const tentouPublicar = ref(false)

const ordem: AbaDoEditor[] = ['essencial', 'personalizacao', 'ferramentas', 'conhecimento', 'respostas', 'acesso', 'testar', 'desempenho']
const itens = computed(() => ordem
  .filter(k => !novo.value || k !== 'desempenho')
  .map(k => ({
    value: k,
    label: props.t.editor.abas[k],
    icon: tentouPublicar.value && (faltando.value as Record<string, string[]>)[k]?.length ? 'i-lucide-circle-alert' : undefined,
    ui: tentouPublicar.value && (faltando.value as Record<string, string[]>)[k]?.length ? { leadingIcon: 'text-error' } : undefined,
  })))

function gravarNaLista() {
  const r = rascunho.value
  r.atualizadoEm = '2026-11-16'
  if (!r.slug) r.slug = (r.name || 'agente').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const i = agentes.value.findIndex(x => x.slug === tela.value.editando)
  const copia = JSON.parse(JSON.stringify(r))
  if (i >= 0) agentes.value[i] = copia
  else agentes.value.unshift(copia)
  tela.value.editando = r.slug
  novo.value = false
}

/** Confere os obrigatórios; com falta, leva à aba que falta. */
function conferir() {
  tentouPublicar.value = true
  if (podePublicar.value) return true
  aba.value = faltando.value.essencial.length ? 'essencial' : 'personalizacao'
  return false
}

/* Salvar grava direto, como hoje: sem rascunho e sem versão. O chat usa o que foi salvo. */
async function salvar() {
  if (!conferir()) return
  const eraNovo = novo.value
  publicando.value = true
  await espera(700)
  gravarNaLista()
  publicando.value = false
  toast.add({ title: eraNovo ? props.t.editor.criado : props.t.editor.salvo, icon: eraNovo ? 'i-lucide-check' : 'i-lucide-save', color: 'success' })
}

/* Trocar de aba volta ao topo. */
watch(aba, () => { document.querySelector('[role=dialog] [data-slot=body]')?.scrollTo({ top: 0 }) })

const sistema = computed(() => rascunho.value.source === 'system')
const larga = computed(() => aba.value === 'testar' && comparando.value)
</script>

<template>
  <USlideover
    v-model:open="aberto"
    side="right"
    :ui="{ content: [larga ? 'max-w-7xl' : 'max-w-5xl', 'w-[95vw] transition-[max-width] duration-300'].join(' '), body: 'p-0 sm:p-0' }"
  >
    <template #header>
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <AvatarDoAgente :cor="rascunho.cor" tamanho="lg" :estado="publicando ? 'working' : 'idle'" />
        <div class="min-w-0 flex-1">
          <h2 class="truncate text-lg font-semibold text-highlighted">{{ novo ? t.editor.novo : (rascunho.name || t.editor.novo) }}</h2>
          <div class="mt-0.5 flex flex-wrap items-center gap-1.5">
            <UBadge v-if="!novo" :label="t.central.status[rascunho.status]" :color="rascunho.status === 'active' ? 'success' : 'neutral'" variant="soft" size="sm" />
          </div>
        </div>
        <UButton icon="i-lucide-x" color="neutral" variant="ghost" :aria-label="t.editor.cancelar" @click="aberto = false" />
      </div>
    </template>

    <template #body>
      <div class="sticky top-0 z-10 border-b border-default bg-default/95 px-4 backdrop-blur sm:px-6">
        <UTabs v-model="aba" :items="itens" variant="link" :content="false" size="sm" :ui="{ trigger: 'shrink-0' }" class="overflow-x-auto [scrollbar-width:none]" />
      </div>

      <div class="px-4 py-5 sm:px-6">
        <UAlert
          v-if="tentouPublicar && !podePublicar"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :title="t.editor.obrigatorios"
          :description="[...faltando.essencial, ...faltando.personalizacao].join(', ')"
          class="mb-5"
        />
        <Transition
          mode="out-in"
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <AbaEssencial v-if="aba === 'essencial'" :t="t" :a="rascunho" :erro="tentouPublicar" @ir="aba = $event" />
          <AbaPersonalizacao v-else-if="aba === 'personalizacao'" :t="t" :a="rascunho" :erro="tentouPublicar" />
          <AbaFerramentas v-else-if="aba === 'ferramentas'" :t="t" :a="rascunho" />
          <AbaConhecimento v-else-if="aba === 'conhecimento'" :t="t" :a="rascunho" />
          <AbaRespostas v-else-if="aba === 'respostas'" :t="t" :a="rascunho" />
          <AbaAcesso v-else-if="aba === 'acesso'" :t="t" :a="rascunho" />
          <AbaTestar v-else-if="aba === 'testar'" v-model:comparando="comparando" :t="t" :a="rascunho" />
          <AbaDesempenho v-else :t="t" :a="rascunho" />
        </Transition>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full flex-wrap items-center justify-end gap-2">
        <p v-if="sistema" class="mr-auto text-sm text-muted">{{ t.editor.sistema }}</p>
        <UButton :label="t.editor.cancelar" color="neutral" variant="subtle" @click="aberto = false" />
        <UButton v-if="!sistema" :label="novo ? t.editor.criar : t.editor.salvar" :icon="novo ? 'i-lucide-check' : 'i-lucide-save'" :loading="publicando" @click="salvar" />
      </div>
    </template>
  </USlideover>
</template>
