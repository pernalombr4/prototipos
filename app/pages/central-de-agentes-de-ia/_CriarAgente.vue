<script setup lang="ts">
/**
 * As 3 portas do agente novo, como o mercado faz (PESQUISA): descrever em
 * linguagem natural, partir de um modelo pronto ou começar do zero. As 3
 * terminam no mesmo cadastro, que a pessoa revisa antes de criar.
 *
 * MAQUETE: "Gerar agente" não chama IA. Espera 1,4 s e preenche o cadastro
 * com o texto do modelo "Respostas a ofícios", com o nome tirado da descrição.
 */
import type { Textos } from './textos'
import { EU, modelosDeAgente, type Agente } from './mocks'
import { pedeConfirmacaoPorPadrao, ferramentaPorSlug } from './catalogo'
import { agenteVazio, espera, useAgentes, usePoliticas, useTela } from './estado'

const props = defineProps<{ t: Textos }>()
const tela = useTela()
const agentes = useAgentes()
const politicas = usePoliticas()
const toast = useToast()

const descricao = ref('')
const gerando = ref(false)

const aberto = computed({
  get: () => tela.value.criarAberto,
  set: (v) => { tela.value.criarAberto = v },
})

function criarComo(base: Partial<Agente>, ferramentas: readonly string[] | Agente['ferramentas']) {
  const novo = { ...agenteVazio(EU), ...base }
  novo.slug = `${(base.name ?? 'agente').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now() % 1000}`
  novo.ferramentas = Array.isArray(ferramentas)
    ? Object.fromEntries(ferramentas.map(s => [s, pedeConfirmacaoPorPadrao(ferramentaPorSlug(s)) ? 'confirmar' : 'executar']))
    : { ...ferramentas }
  agentes.value.unshift(novo)
  tela.value.editando = novo.slug
  tela.value.abaDoEditor = 'essencial'
  tela.value.criarAberto = false
  tela.value.editorAberto = true
}

/* O modelo preenche todo o cadastro (mapa em MODELOS-PRONTOS.md). */
function doModelo(id: string) {
  const mod = modelosDeAgente.find(x => x.id === id)!
  const txt = props.t.criar.modelos[id]!
  /* As Políticas mandam: modelo desligado e ferramenta bloqueada ficam fora. */
  const permitidos = mod.essencial.modelosPermitidos.filter(m => politicas.value.modelos.includes(m))
  const ferramentas = Object.fromEntries(Object.entries(mod.ferramentas).filter(([s]) => !politicas.value.bloqueadas.includes(s)))
  criarComo({
    name: txt.nome,
    description: txt.descricao,
    icon: mod.icone,
    cor: mod.cor,
    ...mod.essencial,
    model: permitidos.includes(mod.essencial.model) ? mod.essencial.model : permitidos[0] ?? mod.essencial.model,
    modelosPermitidos: permitidos.length ? permitidos : [mod.essencial.model],
    sugestoes: [...mod.essencial.sugestoes],
    ...mod.personalizacao,
    rules: [...mod.personalizacao.rules],
    usarDoWorkspace: mod.conhecimento.usarDoWorkspace,
    acesso: mod.acesso.acesso,
    acessoAlvos: [...mod.acesso.acessoAlvos],
  }, ferramentas)
  const docs = mod.conhecimento.documentosSugeridos.map(d => `"${d.nome}"${d.fixado ? ` (${props.t.criar.fixar})` : ''}`).join(', ')
  if (docs) toast.add({ title: props.t.criar.documentosSugeridos(docs), icon: 'i-lucide-library', color: 'info' })
}

async function gerar() {
  if (!descricao.value.trim()) return
  gerando.value = true
  await espera(1400)
  const base = agentes.value.find(a => a.slug === 'respostas-a-oficios')!
  criarComo({
    name: props.t.criar.modelos.oficios!.nome,
    description: descricao.value.trim().slice(0, 160),
    role: base.role,
    approach: base.approach,
    instructions: base.instructions,
    rules: [...base.rules],
    icon: base.icon,
    cor: '#7c3aed',
  }, ['readFile', 'getCurrentDateTime', 'sendEmail'])
  gerando.value = false
  descricao.value = ''
  toast.add({ title: props.t.criar.gerado, icon: 'i-lucide-sparkles', color: 'success' })
}

function doZero() {
  tela.value.criarAberto = false
  tela.value.editando = null
  tela.value.abaDoEditor = 'essencial'
  tela.value.editorAberto = true
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.criar.titulo" :description="t.criar.subtitulo" :ui="{ content: 'sm:max-w-4xl' }">
    <template #body>
      <div class="space-y-6">
        <!-- 1. Descrever -->
        <div class="rounded-lg border border-primary/30 bg-primary/5 p-4">
          <div class="mb-2 flex items-center gap-2">
            <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
            <h3 class="text-sm font-semibold text-highlighted">{{ t.criar.descrever }}</h3>
          </div>
          <p class="mb-3 text-xs text-muted">{{ t.criar.descreverAjuda }}</p>
          <UTextarea
            v-model="descricao"
            :placeholder="t.criar.descreverExemplo"
            :rows="3"
            autoresize
            class="w-full"
            :disabled="gerando"
            :aria-label="t.criar.descrever"
          />
          <div class="mt-3 flex flex-wrap items-center justify-end gap-2">
            <UButton :label="t.criar.doZero" icon="i-lucide-file-plus" color="neutral" variant="ghost" :disabled="gerando" @click="doZero" />
            <UButton
              :label="gerando ? t.criar.gerando : t.criar.gerar"
              icon="i-lucide-wand-sparkles"
              :loading="gerando"
              :disabled="!descricao.trim()"
              @click="gerar"
            />
          </div>
        </div>

        <!-- 2. Modelos prontos -->
        <div>
          <h3 class="mb-3 text-sm font-semibold text-highlighted">{{ t.criar.usarModelo }}</h3>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="(mod, i) in modelosDeAgente"
              :key="mod.id"
              type="button"
              class="group flex flex-col rounded-lg border border-default p-3 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:bg-elevated/60 focus-visible:outline-2 focus-visible:outline-primary disabled:opacity-50"
              :style="{ animationDelay: `${i * 40}ms` }"
              :disabled="gerando"
              @click="doModelo(mod.id)"
            >
              <span class="mb-2 flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-inverted">
                <UIcon :name="mod.icone" class="size-4" />
              </span>
              <span class="text-[11px] font-semibold uppercase tracking-wide text-dimmed">{{ t.criar.areas[mod.area] }}</span>
              <span class="text-sm font-medium text-highlighted">{{ t.criar.modelos[mod.id]!.nome }}</span>
              <span class="mt-0.5 flex-1 text-xs text-muted">{{ t.criar.modelos[mod.id]!.descricao }}</span>
              <span class="mt-2 text-xs text-dimmed">{{ t.criar.ferramentasDoModelo(Object.keys(mod.ferramentas).length) }}</span>
            </button>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>
