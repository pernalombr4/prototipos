<script setup lang="ts">
/**
 * O modal "Nova pasta" da tela do item.
 *
 * ⚠️ A parte de cima NÃO É PROPOSTA. Copiada do develop em 11/11/2026: título
 * "Nova pasta", Nome da Pasta, Tipo de Pasta com busca e os 14 tipos, Ícone com
 * "Sem ícone", Cancelar e Criar.
 *
 * A proposta: o tipo Apontamentos no topo da lista, com selo Novo e descrição,
 * e, quando ele é escolhido, a seção de configuração logo abaixo: nomes
 * sugeridos, conferência, responsável padrão, modelo do corpo, nomes dos
 * estados e a trava de conclusão do item.
 */
import type { ConfigDaPasta, Estado, Pessoa, TipoDePasta } from './mocks'
import type { Textos } from './textos'
import { tiposDePasta } from './mocks'

const props = defineProps<{ t: Textos, pessoas: Pessoa[], responsavelPadrao: number }>()
const aberto = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ criar: [c: ConfigDaPasta] }>()

const MODELOS: Record<string, string> = {
  nenhum: '',
  bug: '<p><strong>Onde:</strong> </p><p><strong>Problema:</strong> </p><p><strong>Correção sugerida:</strong> </p>',
  clausula: '<p><strong>Cláusula:</strong> </p><p><strong>Como está:</strong> </p><p><strong>Como deve ficar:</strong> </p>',
}
const ICONES = ['i-lucide-list-checks', 'i-lucide-clipboard-check', 'i-lucide-scale', 'i-lucide-flag', 'i-lucide-bug', 'i-lucide-search-check']

const nome = ref('')
const tipo = ref<TipoDePasta | undefined>()
const SEM = 'sem-icone'
const icone = ref<string>(SEM)
const exigeConferencia = ref(true)
const conferente = ref<'autor' | 'grupo'>('autor')
const responsavel = ref(props.responsavelPadrao)
const modelo = ref<'nenhum' | 'bug' | 'clausula'>('bug')
const rotulos = reactive<Partial<Record<Estado, string>>>({})
const trava = ref(true)
const tentou = ref(false)
const criando = ref(false)

watch(aberto, (v) => {
  if (!v) return
  nome.value = ''
  tipo.value = undefined
  icone.value = SEM
  tentou.value = false
})
watch(tipo, (v) => { if (v === 'apontamentos' && icone.value === SEM) icone.value = 'i-lucide-list-checks' })

const itensDeTipo = computed(() => tiposDePasta.map(v => ({
  value: v,
  label: props.t.novaPasta.tipos[v],
  description: v === 'apontamentos' ? props.t.novaPasta.descricaoApontamentos : undefined,
  icon: v === 'apontamentos' ? 'i-lucide-list-checks' : undefined,
})))
const itensDeIcone = computed(() => [{ value: SEM, label: props.t.novaPasta.semIcone }, ...ICONES.map(i => ({ value: i, label: i.replace('i-lucide-', ''), icon: i }))])
const opcoesDePessoa = computed(() => props.pessoas.map(p => ({ label: p.nome, value: p.id, avatar: { text: p.iniciais, alt: p.nome } })))
const opcoesDeConferente = computed(() => (['autor', 'grupo'] as const).map(v => ({ value: v, label: props.t.novaPasta.conferentes[v] })))
const opcoesDeModelo = computed(() => (['nenhum', 'bug', 'clausula'] as const).map(v => ({ value: v, label: props.t.novaPasta.modelos[v] })))
const estadosRenomeaveis: Estado[] = ['aberto', 'resolvido', 'conferido', 'descartado']

const erros = computed(() => ({ nome: tentou.value && !nome.value.trim(), tipo: tentou.value && !tipo.value }))

async function criar() {
  tentou.value = true
  if (!nome.value.trim() || !tipo.value) return
  criando.value = true
  await new Promise(r => setTimeout(r, 500))
  emit('criar', {
    nome: nome.value.trim(),
    icone: icone.value === SEM ? 'i-lucide-folder' : icone.value,
    exigeConferencia: exigeConferencia.value,
    conferente: conferente.value,
    modelo: MODELOS[modelo.value]!,
    responsavelPadrao: responsavel.value,
    travaConclusao: trava.value,
    rotulos: Object.fromEntries(Object.entries(rotulos).filter(([, v]) => v?.trim())),
  })
  criando.value = false
  aberto.value = false
}
</script>

<template>
  <UModal v-model:open="aberto" :title="t.novaPasta.titulo" :ui="{ content: 'max-w-2xl' }">
    <template #body>
      <form id="form-nova-pasta" class="flex flex-col gap-5" @submit.prevent="criar">
        <!-- Copiado -->
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="t.novaPasta.nome" required :error="erros.nome">
            <UInput v-model="nome" class="w-full" autofocus />
          </UFormField>
          <UFormField :label="t.novaPasta.tipo" required :error="erros.tipo">
            <USelectMenu
              v-model="tipo"
              :items="itensDeTipo"
              value-key="value"
              :placeholder="t.novaPasta.selecione"
              class="w-full"
              :ui="{ content: 'min-w-80' }"
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
            <div class="flex flex-col gap-2">
              <p class="text-xs font-medium text-muted">{{ t.novaPasta.sugestoes }}</p>
              <div class="flex flex-wrap gap-1.5">
                <UButton
                  v-for="s in t.novaPasta.nomesSugeridos"
                  :key="s"
                  :label="s"
                  size="xs"
                  :color="nome === s ? 'primary' : 'neutral'"
                  :variant="nome === s ? 'soft' : 'outline'"
                  @click="nome = s"
                />
              </div>
            </div>

            <USeparator :label="t.novaPasta.secaoConferencia" :ui="{ label: 'text-xs font-semibold uppercase tracking-wider text-muted' }" />
            <USwitch v-model="exigeConferencia" :label="t.novaPasta.exigeConferencia" :description="t.novaPasta.exigeConferenciaAjuda" />
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField v-if="exigeConferencia" :label="t.novaPasta.conferente">
                <USelect v-model="conferente" :items="opcoesDeConferente" class="w-full" />
              </UFormField>
              <UFormField :label="t.novaPasta.responsavelPadrao">
                <USelectMenu v-model="responsavel" :items="opcoesDePessoa" value-key="value" :search-input="false" :avatar="opcoesDePessoa.find(o => o.value === responsavel)?.avatar" class="w-full" />
              </UFormField>
              <UFormField :label="t.novaPasta.modelo" :help="t.novaPasta.modeloAjuda" class="sm:col-span-2">
                <USelect v-model="modelo" :items="opcoesDeModelo" class="w-full" />
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
        <UButton type="submit" form="form-nova-pasta" :label="t.novaPasta.criar" :loading="criando" />
      </div>
    </template>
  </UModal>
</template>
