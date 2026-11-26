<script setup lang="ts">
/**
 * PROPOSTA: criar projeto. Modal com seções, na ordem do Notion e do ClickUp:
 * nome, aparência, acesso, conteúdo.
 *
 *  - Visibilidade: USelect com "?" por opção (memória "dropdown em vez de cartões"); padrão Fechado;
 *  - Categorias: só as que ainda não pertencem a outro projeto; a que pertence aparece desabilitada
 *    com o nome do projeto (categoria em 1 lugar só);
 *  - Participantes: pessoa, grupo de membros ou cargo, cada um com o papel; quem cria entra como
 *    administrador;
 *  - "Mostrar no menu de todos os participantes", marcada.
 *
 * Rodada 3: "Começar de", no topo. Projeto em branco ou um modelo (caso de uso do workspace).
 * O modelo cria categorias novas com a estrutura das de origem, os fluxos desligados, os avisos
 * e o painel; não traz itens nem participantes. Ainda dá para somar categorias que já existem.
 */
import type { SelectMenuItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { cargos, grupos, iniciais, pessoas, type Participante, type Projeto, type Visibilidade } from './mocks'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const prj = useProjetos()
const toast = useToast()
const { marca } = useMarcaDeProposta()

const aberto = computed({
  get: () => prj.janelas.criar.value,
  set: (v) => { prj.janelas.criar.value = v },
})

const ICONES = ['i-lucide-folder-kanban', 'i-lucide-landmark', 'i-lucide-scale', 'i-lucide-briefcase', 'i-lucide-hard-hat', 'i-lucide-users-round', 'i-lucide-rocket', 'i-lucide-heart-handshake', 'i-lucide-building-2', 'i-lucide-truck', 'i-lucide-graduation-cap', 'i-lucide-megaphone']
const CORES: Projeto['cor'][] = ['primary', 'success', 'info', 'warning', 'error', 'secondary', 'neutral']

const nome = ref('')
const descricao = ref('')
const icone = ref(ICONES[0]!)
const cor = ref<Projeto['cor']>('primary')
const visibilidade = ref<Visibilidade>('fechado')
const categoriasEscolhidas = ref<number[]>([])
const participantes = ref<Participante[]>([])
const noMenuDeTodos = ref(true)
const tentou = ref(false)
const salvando = ref(false)
/** Rodada 3: 0 = projeto em branco; outro número = o id do modelo. */
const modeloId = ref(0)
const modelo = computed(() => prj.modelos.value.find(m => m.id === modeloId.value) ?? null)
const opcoesDeModelo = computed(() => [
  { value: 0, label: props.t.modelo.emBranco, icon: 'i-lucide-square-dashed', dica: props.t.modelo.emBrancoDica },
  ...prj.modelos.value.map(m => ({ value: m.id, label: m.nome, icon: m.icone, dica: `${m.descricao} ${props.t.modelo.modeloDica(m.categorias.length)}`.trim(), autor: props.t.modelo.criadoPor(pessoas.find(x => x.id === m.criadoPor)?.nome ?? '') })),
])
watch(modelo, (m) => {
  if (!m) return
  icone.value = m.icone
  cor.value = m.cor
  visibilidade.value = m.visibilidade
})

watch(aberto, (v) => {
  if (!v) return
  modeloId.value = 0
  nome.value = ''
  descricao.value = ''
  icone.value = ICONES[0]!
  cor.value = 'primary'
  visibilidade.value = 'fechado'
  categoriasEscolhidas.value = []
  participantes.value = []
  noMenuDeTodos.value = true
  tentou.value = false
})

const erroNome = computed(() => {
  if (!tentou.value) return undefined
  if (!nome.value.trim()) return props.t.criar.nomeObrigatorio
  if (prj.projetos.value.some(p => p.nome.toLowerCase() === nome.value.trim().toLowerCase())) return props.t.criar.nomeRepetido
  return undefined
})

const opcoesDeVisibilidade = computed(() => (['aberto', 'fechado', 'privado'] as const).map(v => ({
  value: v,
  label: props.t.visibilidade[v],
  icon: ICONE_DA_VISIBILIDADE[v],
  dica: props.t.visibilidade[`${v}Dica` as const],
})))

const opcoesDeCategoria = computed(() => prj.categorias.value.map((c) => {
  const dono = prj.projetoDa(c)
  return { value: c.id, label: c.name, icon: c.icon ?? 'i-lucide-folder', disabled: !!dono, dono: dono?.nome }
}))
const livres = computed(() => opcoesDeCategoria.value.filter(o => !o.disabled).length)

/* ---------- participantes ---------- */
const chave = (x: { tipo: string, id: number | string }) => `${x.tipo}:${x.id}`
const escolhidos = computed(() => new Set(participantes.value.map(chave)))
const opcoesDeParticipante = computed<SelectMenuItem[][]>(() => [
  [{ type: 'label', label: props.t.tipoDeParticipante.grupo }, ...grupos.map(g => ({ value: `grupo:${g.id}`, label: g.name, icon: 'i-lucide-users-round', disabled: escolhidos.value.has(`grupo:${g.id}`), contagem: g.members_count }))],
  [{ type: 'label', label: props.t.tipoDeParticipante.cargo }, ...cargos.map(c => ({ value: `cargo:${c.id}`, label: c.name, icon: 'i-lucide-shield-check', disabled: escolhidos.value.has(`cargo:${c.id}`) }))],
  [{ type: 'label', label: props.t.tipoDeParticipante.pessoa }, ...pessoas.filter(p => p.id !== prj.eu.value).map(p => ({ value: `pessoa:${p.id}`, label: p.nome, avatar: { text: iniciais(p.nome), alt: p.nome }, disabled: escolhidos.value.has(`pessoa:${p.id}`), empresa: p.empresa }))],
])
const novo = ref<string | undefined>(undefined)
watch(novo, (v) => {
  if (!v) return
  const [tipo, id] = v.split(':') as [Participante['tipo'], string]
  participantes.value = [...participantes.value, { tipo, id: tipo === 'grupo' ? id : Number(id), papel: 'participante' }]
  nextTick(() => { novo.value = undefined })
})

function nomeDe(x: Participante) {
  if (x.tipo === 'pessoa') return pessoas.find(p => p.id === x.id)?.nome ?? ''
  if (x.tipo === 'grupo') return grupos.find(g => g.id === x.id)?.name ?? ''
  return cargos.find(c => c.id === x.id)?.name ?? ''
}
const iconeDoTipo = { pessoa: 'i-lucide-user-round', grupo: 'i-lucide-users-round', cargo: 'i-lucide-shield-check' } as const
const papeis = computed(() => [
  { value: 'admin', label: props.t.papel.admin },
  { value: 'participante', label: props.t.papel.participante },
])

async function criar() {
  tentou.value = true
  if (erroNome.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 700))
  const p = prj.criarProjeto({
    nome: nome.value.trim(),
    descricao: descricao.value.trim(),
    icone: icone.value,
    cor: cor.value,
    visibilidade: visibilidade.value,
    categorias: categoriasEscolhidas.value,
    participantes: participantes.value,
    noMenuDeTodos: noMenuDeTodos.value,
    modelo: modelo.value?.id,
  })
  salvando.value = false
  aberto.value = false
  const m = modelo.value
  toast.add({
    title: m ? props.t.modelo.criadoComModelo(p.nome, m.categorias.length + categoriasEscolhidas.value.length, prj.fluxosDoProjeto(p.id).length) : props.t.criar.criado(p.nome),
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.criar.titulo" :description="t.criar.descricaoDaJanela" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <form class="space-y-5" @submit.prevent="criar">
        <!-- rodada 3: começar de um modelo -->
        <UFormField v-if="prj.modelos.value.length" :label="t.modelo.comecarDe" :class="marca">
          <USelect v-model="modeloId" :items="opcoesDeModelo" class="w-full" :icon="modelo ? modelo.icone : 'i-lucide-square-dashed'">
            <template #item-trailing="{ item }">
              <span v-if="(item as any).autor" class="text-xs text-muted">{{ (item as any).autor }}</span>
              <UTooltip :text="(item as any).dica" :content="{ side: 'right' }">
                <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="(item as any).dica" />
              </UTooltip>
            </template>
          </USelect>
          <div v-if="modelo" class="mt-2 rounded-md border border-default bg-elevated/40 px-3 py-2.5 animate-[entrada_0.15s_ease-out_both]">
            <p class="text-sm font-medium text-highlighted">{{ t.modelo.traz }}</p>
            <ul class="mt-1.5 space-y-1 text-sm text-toned">
              <li class="flex items-start gap-2"><UIcon name="i-lucide-database" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.categoriasNovas(modelo.categorias.map(c => c.nome).join(', ')) }}</li>
              <li class="flex items-start gap-2"><UIcon name="i-lucide-columns-3" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.estrutura }}</li>
              <li v-if="modelo.fluxos" class="flex items-start gap-2"><UIcon name="i-lucide-workflow" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.fluxos(modelo.fluxos) }}</li>
              <li v-if="modelo.avisos" class="flex items-start gap-2"><UIcon name="i-lucide-bell-ring" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.avisos(modelo.avisos) }}</li>
              <li v-if="modelo.paineis" class="flex items-start gap-2"><UIcon name="i-lucide-chart-column" class="mt-0.5 size-4 shrink-0 text-muted" />{{ t.modelo.paineis }}</li>
            </ul>
            <p class="mt-2 flex items-start gap-1.5 text-xs text-muted"><UIcon name="i-lucide-shield-check" class="mt-px size-3.5 shrink-0" />{{ t.modelo.naoTraz }}</p>
          </div>
        </UFormField>

        <div class="flex items-start gap-3">
          <UFormField :label="t.criar.icone">
            <UPopover :content="{ align: 'start' }">
              <UButton color="neutral" variant="outline" class="size-10 justify-center p-0" :aria-label="t.criar.escolherIcone">
                <span class="flex size-7 items-center justify-center rounded-md" :class="COR_DO_PROJETO[cor]"><UIcon :name="icone" class="size-4" /></span>
              </UButton>
              <template #content>
                <div class="w-64 space-y-3 p-3">
                  <div class="grid grid-cols-6 gap-1">
                    <UButton
                      v-for="i in ICONES"
                      :key="i"
                      :icon="i"
                      size="sm"
                      color="neutral"
                      :variant="icone === i ? 'soft' : 'ghost'"
                      :aria-pressed="icone === i"
                      :aria-label="i.replace('i-lucide-', '')"
                      @click="icone = i"
                    />
                  </div>
                  <div class="flex gap-1.5">
                    <button
                      v-for="c in CORES"
                      :key="c"
                      type="button"
                      class="size-6 rounded-full ring-offset-2 ring-offset-default transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-primary"
                      :class="[COR_DO_PROJETO[c], cor === c ? 'ring-2 ring-primary' : '']"
                      :aria-label="c"
                      :aria-pressed="cor === c"
                      @click="cor = c"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </UFormField>
          <UFormField :label="t.criar.nome" :help="erroNome ? undefined : t.criar.nomeDica" :error="erroNome" required class="flex-1">
            <UInput v-model="nome" class="w-full" autofocus maxlength="60" />
          </UFormField>
        </div>

        <UFormField :label="t.criar.descricao">
          <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
        </UFormField>

        <UFormField :label="t.criar.visibilidade">
          <USelect v-model="visibilidade" :items="opcoesDeVisibilidade" class="w-full" :icon="ICONE_DA_VISIBILIDADE[visibilidade]">
            <template #item-trailing="{ item }">
              <UTooltip :text="(item as any).dica" :content="{ side: 'right' }">
                <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="(item as any).dica" />
              </UTooltip>
            </template>
          </USelect>
          <p class="mt-1.5 text-sm text-muted">{{ t.visibilidade[`${visibilidade}Dica`] }}</p>
        </UFormField>

        <USeparator />

        <UFormField :label="modelo ? t.modelo.outrasCategorias : t.criar.categorias" :help="livres ? t.criar.categoriasDica : t.criar.semCategoriasLivres">
          <USelectMenu
            v-model="categoriasEscolhidas"
            :items="opcoesDeCategoria"
            value-key="value"
            multiple
            class="w-full"
            :placeholder="t.criar.categoriasPlaceholder"
            :search-input="{ placeholder: t.dados.buscar }"
          >
            <template #item-trailing="{ item }">
              <span v-if="(item as any).dono" class="text-xs text-muted">{{ t.criar.pertenceA((item as any).dono) }}</span>
            </template>
          </USelectMenu>
          <p v-if="categoriasEscolhidas.length" class="mt-1.5 flex items-start gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" />{{ t.criar.avisoCategorias }}
          </p>
        </UFormField>

        <UFormField :label="t.criar.participantes" :help="t.criar.participantesDica">
          <ul class="mb-2 divide-y divide-default rounded-md border border-default">
            <li class="flex items-center gap-2.5 px-3 py-2">
              <UAvatar size="xs" :text="iniciais(prj.euPessoa.value.nome)" :alt="prj.euPessoa.value.nome" />
              <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ prj.euPessoa.value.nome }} <span class="text-muted">({{ t.criar.voce }})</span></span>
              <UBadge :label="t.papel.admin" size="sm" color="primary" variant="soft" />
            </li>
            <li v-for="(x, i) in participantes" :key="chave(x)" class="flex items-center gap-2.5 px-3 py-2 animate-[entrada_0.15s_ease-out_both]">
              <UAvatar v-if="x.tipo === 'pessoa'" size="xs" :text="iniciais(nomeDe(x))" :alt="nomeDe(x)" />
              <span v-else class="flex size-6 items-center justify-center rounded-full bg-elevated"><UIcon :name="iconeDoTipo[x.tipo]" class="size-3.5 text-muted" /></span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm text-highlighted">{{ nomeDe(x) }}</span>
                <span class="block truncate text-xs text-muted">{{ t.tipoDeParticipante[x.tipo] }}<template v-if="x.tipo !== 'pessoa'"> · {{ t.diretorio.pessoas(prj.alcance(x)) }}</template></span>
              </span>
              <USelect v-model="participantes[i]!.papel" :items="papeis" size="xs" class="w-48" :aria-label="t.criar.papelDe(nomeDe(x))" />
              <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" :aria-label="t.criar.remover(nomeDe(x))" @click="participantes.splice(i, 1)" />
            </li>
          </ul>
          <USelectMenu
            v-model="novo"
            :items="opcoesDeParticipante"
            value-key="value"
            class="w-full"
            icon="i-lucide-user-plus"
            :placeholder="t.criar.adicionar"
            :search-input="{ placeholder: t.criar.buscarParticipante }"
          >
            <template #item-trailing="{ item }">
              <span v-if="(item as any).contagem" class="text-xs text-muted">{{ t.diretorio.pessoas((item as any).contagem) }}</span>
              <span v-else-if="(item as any).empresa" class="text-xs text-muted">{{ (item as any).empresa }}</span>
            </template>
          </USelectMenu>
        </UFormField>

        <UCheckbox v-model="noMenuDeTodos" :label="t.criar.noMenuDeTodos" :description="t.criar.noMenuDeTodosDica" />
        <button type="submit" class="hidden" />
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.criar.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton :label="t.criar.confirmar" icon="i-lucide-check" color="primary" :loading="salvando" @click="criar" />
      </div>
    </template>
  </UModal>
</template>
