<script setup lang="ts">
import { useMenuDoWorkspace } from './estado'
import { useTrilha } from './trilha'
import { rotuloDoNo } from './rotulos'
import { tiposDeTela, type NoDoMenu } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * CRIAR MENU (rodada 16), pelo "+" do Início.
 *
 *   "na hora de criar menu ja tem que poder vincular uma tela a ele ou criar
 *    essa tela, como o clickup tambem faz" (Mikaela)
 *
 * Um menu do ENSPACE é uma seção da árvore com telas dentro (Interface >
 * Menus). A janela pede o que o ClickUp pede para criar uma lista (ícone e
 * nome) e, na mesma janela, as telas: vincular uma que já existe, pela busca,
 * ou criar uma nova com nome e tipo. Dá para criar vazio e pôr telas depois.
 *
 * "Onde ele fica": no Início, como seção, ou na trilha, com ícone próprio. É
 * o campo `lugar` da rodada 4, sem precisar abrir o editor.
 *
 * Menu é configuração do workspace: entra no rascunho e acende o Salvar, como
 * o editor. Vincular uma tela cria um item novo apontando para a mesma tela
 * (no mock, uma cópia do nome, do ícone e do tipo); a original fica onde está.
 */
const props = defineProps<{ t: TextosDaTela }>()

const menu = useMenuDoWorkspace()
const trilha = useTrilha()
const toast = useToast()

const aberta = computed({
  get: () => trilha.criandoMenu.value !== null,
  set: (v) => { if (!v) trilha.criandoMenu.value = null },
})

const nome = ref('')
const icone = ref('folder-kanban')
const escolhendoIcone = ref(false)
const lugar = ref<'inicio' | 'trilha'>('inicio')

interface TelaEscolhida { id: string, rotulo: string, icone: string, tipoDeTela?: string, nova: boolean, origem?: string }
const telas = ref<TelaEscolhida[]>([])

watch(() => trilha.criandoMenu.value, (v) => {
  if (!v) return
  nome.value = ''
  icone.value = 'folder-kanban'
  lugar.value = v
  telas.value = []
  criandoTela.value = false
})

/* ------------------------------ vincular ------------------------------ */

const vinculando = ref(false)

const gruposDeTelas = computed(() => {
  const ja = new Set(telas.value.map(x => x.origem))
  return menu.secoes.value
    .map(s => ({
      id: s.id,
      label: rotuloDoNo(s, props.t),
      items: (s.filhos ?? [])
        .filter(f => !ja.has(f.id))
        .map(f => ({
          label: rotuloDoNo(f, props.t),
          icon: f.icone,
          suffix: f.tipoDeTela ? props.t.tipos[f.tipoDeTela] : undefined,
          onSelect: () => {
            telas.value.push({ id: `t-${Date.now().toString(36)}`, rotulo: rotuloDoNo(f, props.t), icone: f.icone, tipoDeTela: f.tipoDeTela, nova: false, origem: f.id })
            vinculando.value = false
          },
        })),
    }))
    .filter(g => g.items.length)
})

/* ------------------------------ criar uma tela ------------------------------ */

const criandoTela = ref(false)
const nomeDaTela = ref('')
const tipoDaTela = ref('personalizada')
const opcoesDeTipo = computed(() => tiposDeTela.map(x => ({ label: props.t.tipos[x.id] ?? x.id, value: x.id })))

function adicionarTelaNova() {
  if (!nomeDaTela.value.trim()) return
  telas.value.push({ id: `t-${Date.now().toString(36)}`, rotulo: nomeDaTela.value.trim(), icone: 'i-lucide-monitor', tipoDeTela: tipoDaTela.value, nova: true })
  nomeDaTela.value = ''
  criandoTela.value = false
}

/* ------------------------------ criar ------------------------------ */

function criar() {
  if (!nome.value.trim()) return
  const id = `s-${Date.now().toString(36)}`
  const no: NoDoMenu = {
    id,
    tipo: 'secao',
    origem: 'workspace',
    rotulo: nome.value.trim(),
    icone: `i-lucide-${icone.value}`,
    lugar: lugar.value === 'trilha' ? 'trilha' : 'painel',
    painel: 'trabalho',
    escopo: [],
    filhos: telas.value.map(x => ({ id: x.id, tipo: 'tela' as const, origem: 'workspace' as const, rotulo: x.rotulo, icone: x.icone, tipoDeTela: x.tipoDeTela })),
  }
  menu.adicionarSecao(no)
  // No Início, como seção criada, entra no topo (rodada 15).
  if (lugar.value === 'inicio') {
    menu.aplicarPrefs((p) => { p.ordemDasSecoes = [id, ...p.ordemDasSecoes] })
  }
  toast.add({ title: props.t.menuCriado(no.rotulo!), icon: no.icone, color: 'neutral' })
  trilha.criandoMenu.value = null
}
</script>

<template>
  <UModal v-model:open="aberta" :title="props.t.criarMenuTitulo" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <form id="form-criar-menu" class="space-y-5" @submit.prevent="criar">
        <div class="flex items-center gap-2">
          <UPopover v-model:open="escolhendoIcone" :content="{ side: 'bottom', align: 'start' }">
            <UButton :icon="`i-lucide-${icone}`" color="neutral" variant="outline" square :aria-label="props.t.escolherIcone" />
            <template #content>
              <div class="w-80 p-2">
                <UxSeletorDeIcones v-model="icone" :altura="220" @update:model-value="escolhendoIcone = false" />
              </div>
            </template>
          </UPopover>
          <UInput v-model="nome" class="flex-1" :placeholder="props.t.criarMenuPlaceholder" :aria-label="props.t.criarMenuTitulo" autofocus />
        </div>

        <UFormField :label="props.t.ondeFica">
          <div class="flex gap-2">
            <UButton
              v-for="op in [{ v: 'inicio', r: props.t.noInicio, i: 'i-lucide-house' }, { v: 'trilha', r: props.t.naTrilhaRotulo, i: 'i-lucide-panel-left' }]"
              :key="op.v"
              :label="op.r"
              :icon="op.i"
              size="sm"
              :color="lugar === op.v ? 'primary' : 'neutral'"
              :variant="lugar === op.v ? 'soft' : 'outline'"
              :aria-pressed="lugar === op.v"
              @click="lugar = op.v as 'inicio' | 'trilha'"
            />
          </div>
        </UFormField>

        <UFormField :label="props.t.telasDoMenu">
          <ul v-if="telas.length" class="mb-2 space-y-1">
            <li
              v-for="(x, i) in telas"
              :key="x.id"
              class="flex animate-[entrada_0.2s_ease-out_both] items-center gap-2 rounded-md border border-default px-2.5 py-1.5 text-sm"
            >
              <UIcon :name="x.icone" class="size-4 shrink-0 text-toned" />
              <span class="min-w-0 flex-1 truncate text-default">{{ x.rotulo }}</span>
              <span v-if="x.tipoDeTela" class="shrink-0 text-xs text-muted">{{ props.t.tipos[x.tipoDeTela] }}</span>
              <UBadge v-if="x.nova" :label="props.t.telaNovaSelo" size="sm" color="primary" variant="subtle" class="shrink-0" />
              <UButton
                icon="i-lucide-x"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.removerTela(x.rotulo)"
                @click="telas.splice(i, 1)"
              />
            </li>
          </ul>
          <p v-else class="mb-2 text-xs text-muted">{{ props.t.telasVazio }}</p>

          <!-- Criar tela nova, na mesma janela. -->
          <div v-if="criandoTela" class="mb-2 flex animate-[entrada_0.2s_ease-out_both] flex-wrap items-end gap-2 rounded-md bg-elevated/60 p-2">
            <UFormField :label="props.t.nomeDaTela" class="min-w-40 flex-1">
              <UInput v-model="nomeDaTela" size="sm" class="w-full" autofocus @keydown.enter.prevent="adicionarTelaNova" />
            </UFormField>
            <UFormField :label="props.t.tipoDaTela" class="w-48">
              <USelect v-model="tipoDaTela" :items="opcoesDeTipo" size="sm" class="w-full" />
            </UFormField>
            <UButton :label="props.t.adicionarTela" size="sm" color="primary" variant="soft" :disabled="!nomeDaTela.trim()" @click="adicionarTelaNova" />
          </div>

          <div class="flex flex-wrap gap-2">
            <UPopover v-model:open="vinculando" :content="{ side: 'bottom', align: 'start' }">
              <UButton :label="props.t.vincularTela" icon="i-lucide-link" size="sm" color="neutral" variant="outline" />
              <template #content>
                <UCommandPalette :groups="gruposDeTelas" :placeholder="props.t.buscarTelasExistentes" class="h-72 w-80" />
              </template>
            </UPopover>
            <UButton
              v-if="!criandoTela"
              :label="props.t.criarTelaNova"
              icon="i-lucide-plus"
              size="sm"
              color="neutral"
              variant="outline"
              @click="criandoTela = true"
            />
          </div>
        </UFormField>
      </form>
    </template>
    <template #footer>
      <UButton type="submit" form="form-criar-menu" block color="primary" :label="props.t.criarMenuBotao" :disabled="!nome.trim()" />
    </template>
  </UModal>
</template>
