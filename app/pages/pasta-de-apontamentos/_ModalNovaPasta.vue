<script setup lang="ts">
/**
 * O modal "Nova pasta" da tela do item.
 *
 * ⚠️ A parte de cima NÃO É PROPOSTA. Copiada do develop em 11/11/2026: título
 * "Nova pasta", Nome da Pasta, Tipo de Pasta com busca e os 14 tipos, Ícone com
 * "Sem ícone", Cancelar e Criar.
 *
 * A proposta: o tipo Apontamentos no topo da lista, com selo Novo e descrição,
 * e, quando ele é escolhido, a seção de configuração logo abaixo: conferência,
 * responsável padrão, nomes dos estados e a trava de conclusão do item.
 *
 * Rodada 4: sai o modelo do corpo. O apontamento novo começa vazio.
 *
 * Rodada 3: o nome da pasta Apontamentos é fixo. Com o tipo escolhido, o Nome
 * da Pasta mostra "Apontamentos" travado. Cada categoria tem no máximo 1 pasta
 * desse tipo: com `jaExiste`, a opção fica desabilitada e diz onde configurar.
 * Com `editando`, o modal vira o Editar da pasta: tipo e nome travados e a
 * configuração preenchida.
 */
import type { ConfigDaPasta, Estado, Pessoa, TipoDePasta } from './mocks'
import type { Textos } from './textos'
import { tiposDePasta } from './mocks'

const props = defineProps<{
  t: Textos
  pessoas: Pessoa[]
  responsavelPadrao: number
  /** A categoria já tem a pasta Apontamentos. */
  jaExiste?: boolean
  /** Editar da pasta Apontamentos: a configuração atual. */
  editando?: ConfigDaPasta
}>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ criar: [p: { nome: string, icone: string }], salvar: [c: ConfigDaPasta] }>()

const ICONES = ['i-lucide-list-checks', 'i-lucide-clipboard-check', 'i-lucide-scale', 'i-lucide-flag', 'i-lucide-bug', 'i-lucide-search-check']

const nome = ref('')
const tipo = ref<TipoDePasta | undefined>()
const SEM = 'sem-icone'
const icone = ref<string>(SEM)
const exigeConferencia = ref(true)
const conferente = ref<'autor' | 'grupo'>('autor')
const responsavel = ref(props.responsavelPadrao)
const rotulos = reactive<Partial<Record<Estado, string>>>({})
const trava = ref(true)
const tentou = ref(false)
const criando = ref(false)

const nomeFixo = computed(() => props.t.novaPasta.tipos.apontamentos!)

watch(aberto, (v) => {
  if (!v) return
  tentou.value = false
  const e = props.editando
  if (!e) {
    nome.value = ''
    tipo.value = undefined
    icone.value = SEM
    return
  }
  tipo.value = 'apontamentos'
  icone.value = e.icone
  exigeConferencia.value = e.exigeConferencia
  conferente.value = e.conferente
  responsavel.value = e.responsavelPadrao
  for (const k of Object.keys(rotulos) as Estado[]) delete rotulos[k]
  Object.assign(rotulos, e.rotulos)
  trava.value = e.travaConclusao
})
watch(tipo, (v) => { if (v === 'apontamentos' && icone.value === SEM) icone.value = 'i-lucide-list-checks' })

const itensDeTipo = computed(() => tiposDePasta.map(v => ({
  value: v,
  label: props.t.novaPasta.tipos[v],
  description: v !== 'apontamentos' ? undefined : props.jaExiste ? props.t.novaPasta.jaExiste : props.t.novaPasta.descricaoApontamentos,
  icon: v === 'apontamentos' ? 'i-lucide-list-checks' : undefined,
  disabled: v === 'apontamentos' && props.jaExiste && !props.editando,
})))
const eApontamentos = computed(() => tipo.value === 'apontamentos')
const itensDeIcone = computed(() => [{ value: SEM, label: props.t.novaPasta.semIcone }, ...ICONES.map(i => ({ value: i, label: i.replace('i-lucide-', ''), icon: i }))])
const opcoesDePessoa = computed(() => props.pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const opcoesDeConferente = computed(() => (['autor', 'grupo'] as const).map(v => ({ value: v, label: props.t.novaPasta.conferentes[v] })))
const estadosRenomeaveis: Estado[] = ['aberto', 'resolvido', 'conferido', 'descartado']

const erros = computed(() => ({ nome: tentou.value && !eApontamentos.value && !nome.value.trim(), tipo: tentou.value && !tipo.value }))
const iconeFinal = () => icone.value === SEM ? 'i-lucide-folder' : icone.value

async function criar() {
  tentou.value = true
  if (!tipo.value || (!eApontamentos.value && !nome.value.trim())) return
  criando.value = true
  await new Promise(r => setTimeout(r, 500))
  if (eApontamentos.value) {
    emit('salvar', {
      icone: iconeFinal(),
      exigeConferencia: exigeConferencia.value,
      conferente: conferente.value,
      responsavelPadrao: responsavel.value,
      travaConclusao: trava.value,
      rotulos: Object.fromEntries(Object.entries(rotulos).filter(([, v]) => v?.trim())),
    })
  }
  else {
    emit('criar', { nome: nome.value.trim(), icone: iconeFinal() })
  }
  criando.value = false
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="editando ? t.novaPasta.tituloEditar : t.novaPasta.titulo" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <form id="form-nova-pasta" class="flex flex-col gap-5" @submit.prevent="criar">
        <!-- Copiado -->
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novaPasta.nome" required :error="erros.nome" :help="eApontamentos ? t.novaPasta.nomeFixo : undefined">
            <!-- Proposta: com o tipo Apontamentos, o nome é fixo -->
            <UInput v-if="eApontamentos" :model-value="nomeFixo" disabled trailing-icon="i-lucide-lock" class="w-full" />
            <UInput v-else v-model="nome" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="t.novaPasta.tipo" required :error="erros.tipo">
            <USelectMenu
              v-model="tipo"
              :items="itensDeTipo"
              value-key="value"
              :placeholder="t.novaPasta.selecione"
              :disabled="!!editando"
              class="w-full"
              :ui="{ content: 'min-w-80', itemDescription: 'whitespace-normal' }"
            >
              <template #item-label="{ item }">
                <span class="flex items-center gap-2">
                  {{ item.label }}
                  <UBadge v-if="item.value === 'apontamentos'" :label="t.novaPasta.novo" size="sm" color="primary" variant="soft" />
                </span>
              </template>
            </USelectMenu>
          </UFormField>
          <UFormField :label="t.novaPasta.icone" required>
            <USelectMenu v-model="icone" :items="itensDeIcone" value-key="value" :search-input="false" :icon="icone === SEM ? undefined : icone" class="w-full" />
          </UFormField>
        </div>

        <!-- Proposta: a configuração do tipo Apontamentos -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="tipo === 'apontamentos'" class="flex flex-col gap-5 rounded-lg border border-default bg-elevated/40 p-4">
            <USeparator :label="t.novaPasta.secaoConferencia" :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-muted' }" />
            <USwitch v-model="exigeConferencia" :label="t.novaPasta.exigeConferencia" :description="t.novaPasta.exigeConferenciaAjuda" />
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField v-if="exigeConferencia" :label="t.novaPasta.conferente">
                <USelect v-model="conferente" :items="opcoesDeConferente" class="w-full" />
              </UFormField>
              <UFormField :label="t.novaPasta.responsavelPadrao">
                <USelectMenu v-model="responsavel" :items="opcoesDePessoa" value-key="value" :search-input="false" :avatar="opcoesDePessoa.find(o => o.value === responsavel)?.avatar" class="w-full" />
              </UFormField>
            </div>

            <UFormField :label="t.novaPasta.rotulos" :help="t.novaPasta.rotulosAjuda">
              <div class="grid gap-2 sm:grid-cols-4">
                <UInput v-for="e in estadosRenomeaveis" :key="e" v-model="rotulos[e]" :placeholder="t.estados[e]" size="sm" :aria-label="t.estados[e]" />
              </div>
            </UFormField>

            <UCheckbox v-model="trava" :label="t.novaPasta.trava" :description="t.novaPasta.travaAjuda" />
          </div>
        </Transition>
      </form>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.novaPasta.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <UButton type="submit" form="form-nova-pasta" :label="editando ? t.novaPasta.salvar : t.novaPasta.criar" :loading="criando" />
      </div>
    </template>
  </UModal>
</template>
