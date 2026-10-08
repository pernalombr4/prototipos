<script setup lang="ts">
/**
 * PROPOSTA: a configuração do campo Editor de Documentos.
 *
 * A casca é a gaveta "Campo - <nome>" do develop (print develop-01): abas
 * Definição, Visual, Regras e Condições, Eventos de Campo, Ajuda; nome,
 * referência técnica, rótulo e tipo; Salvar largo; pré-visualização embaixo.
 *
 * O que muda são as "Configurações Específicas". No develop são 7 chaves
 * soltas, todas desligadas, inclusive Editar. Aqui elas viram 3 grupos, na
 * ordem em que a pessoa pensa:
 *   1. ONDE o documento abre: ENSPACE (ONLYOFFICE), Word, Word para a web
 *      (fase 2) e o editor padrão. É a peça nova que a demanda pede;
 *   2. COMO o documento nasce: modelos, em branco, .docx, .pdf (o "em branco"
 *      não existia; os uploads já existiam);
 *   3. O QUE se faz no editor: editar (ligado por padrão), comentar,
 *      acompanhar mudanças, revisão e o painel dela, chat.
 * A pré-visualização mostra o campo vazio de verdade, e muda com as chaves.
 *
 * USwitch e URadioGroup (variante card), consultados no MCP `nuxt-ui`.
 */
import type { RadioGroupItem } from '@nuxt/ui'
import type { Textos } from './textos'
import { type ItemDoContrato, campoDoDocumento, itens, modelos } from './mocks'
import { useDocumentos } from './estado'
import CampoDocumento from './_CampoDocumento.vue'

const props = defineProps<{ t: Textos, idioma: string }>()
const aberto = defineModel<boolean>('open', { default: false })

const toast = useToast()
const { config } = useDocumentos()

const aba = ref('0')
const abas = computed(() => props.t.config.abas.map((label, i) => ({ label, value: String(i), disabled: i > 0 })))

const padrao = computed({
  get: () => config.value.padrao ?? 'perguntar',
  set: (v: string) => { config.value.padrao = v === 'perguntar' ? null : (v as 'onlyoffice' | 'word') },
})

const opcoesDePadrao = computed<RadioGroupItem[]>(() => [
  { value: 'perguntar', label: props.t.config.cadaPessoaEscolhe },
  { value: 'onlyoffice', label: props.t.config.onlyoffice, disabled: !config.value.onlyoffice },
  { value: 'word', label: props.t.config.word, disabled: !config.value.word },
])

/* nenhum editor desligado deixa o campo sem saída */
watch(() => [config.value.onlyoffice, config.value.word], ([oo, w]) => {
  if (!oo && !w) config.value.onlyoffice = true
  if (!w) config.value.wordWeb = false
  if (config.value.padrao === 'onlyoffice' && !oo) config.value.padrao = null
  if (config.value.padrao === 'word' && !w) config.value.padrao = null
})

/** Um item sem documento, só para a pré-visualização. */
const itemDePrevia = computed<ItemDoContrato>(() => ({ ...itens[1]!, data: { ...itens[1]!.data, minuta_do_contrato: null } }))

const salvando = ref(false)
async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  toast.add({ title: props.t.config.salvo, icon: 'i-lucide-check', color: 'success' })
  aberto.value = false
}

type Chave = 'onlyoffice' | 'word' | 'wordWeb' | 'modelos' | 'branco' | 'docx' | 'pdf' | 'editar' | 'comentar' | 'acompanhar' | 'revisao' | 'painelRevisao' | 'chat'
</script>

<template>
  <USlideover v-model:open="aberto" side="right" :title="t.config.titulo" :description="t.config.descricao" :ui="{ content: 'max-w-3xl', body: 'space-y-6' }">
    <template #body>
      <UTabs v-model="aba" :items="abas" :content="false" variant="link" size="sm" />

      <div class="grid gap-4 sm:grid-cols-2">
        <UFormField :label="t.config.nome">
          <UInput :model-value="campoDoDocumento.rotulo" class="w-full" disabled />
        </UFormField>
        <UFormField :label="t.config.referencia">
          <UInput :model-value="campoDoDocumento.refId" class="w-full font-mono" disabled />
        </UFormField>
        <UFormField :label="t.config.rotulo">
          <UInput :model-value="campoDoDocumento.rotulo" class="w-full" disabled />
        </UFormField>
        <UFormField :label="t.config.tipo">
          <UInput :model-value="t.config.tipoValor" icon="i-lucide-file-pen" class="w-full" disabled />
        </UFormField>
      </div>

      <!-- 1. onde abre -->
      <section class="rounded-lg border border-default">
        <header class="border-b border-default px-4 py-3">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.secaoEditores }}</h3>
          <p class="text-xs text-muted">{{ t.config.secaoEditoresAjuda }}</p>
        </header>
        <div class="space-y-4 p-4">
          <USwitch v-model="config.onlyoffice" :label="t.config.onlyoffice" :description="t.config.onlyofficeAjuda" />
          <USwitch v-model="config.word" :label="t.config.word" :description="t.config.wordAjuda" />
          <USwitch v-model="config.wordWeb" :label="t.config.wordWeb" :description="t.config.wordWebAjuda" :disabled="!config.word" class="ml-11" />
          <USeparator />
          <UFormField :label="t.config.editorPadrao" :description="t.config.editorPadraoAjuda">
            <URadioGroup v-model="padrao" :items="opcoesDePadrao" orientation="horizontal" variant="card" size="sm" class="mt-2" />
          </UFormField>
        </div>
      </section>

      <!-- 2. como nasce -->
      <section class="rounded-lg border border-default">
        <header class="border-b border-default px-4 py-3">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.secaoCriar }}</h3>
          <p class="text-xs text-muted">{{ t.config.secaoCriarAjuda }}</p>
        </header>
        <div class="grid gap-4 p-4 sm:grid-cols-2">
          <USwitch v-model="config.modelos" :label="t.config.modelos" :description="t.config.modelosAjuda(modelos.length)" />
          <USwitch v-model="config.branco" :label="t.config.branco" />
          <USwitch v-model="config.docx" :label="t.config.enviarDocx" />
          <USwitch v-model="config.pdf" :label="t.config.enviarPdf" />
        </div>
      </section>

      <!-- 3. o que se faz no editor -->
      <section class="rounded-lg border border-default">
        <header class="border-b border-default px-4 py-3">
          <h3 class="text-sm font-semibold text-highlighted">{{ t.config.secaoEditar }}</h3>
          <p class="text-xs text-muted">{{ t.config.secaoEditarAjuda }}</p>
        </header>
        <div class="grid gap-4 p-4 sm:grid-cols-2">
          <USwitch v-for="c in (['editar', 'comentar', 'acompanhar', 'revisao', 'chat'] as Chave[])" :key="c" v-model="config[c]" :label="t.config[c as 'editar']" />
          <USwitch v-model="config.painelRevisao" :label="t.config.painelRevisao" :disabled="!config.revisao" />
        </div>
      </section>

      <UButton block :label="t.config.salvar" icon="i-lucide-save" :loading="salvando" @click="salvar" />

      <section class="rounded-lg border border-default p-4">
        <h3 class="mb-3 text-sm font-semibold text-highlighted">{{ t.config.preVisualizacao }}</h3>
        <CampoDocumento :item="itemDePrevia" :t="t" :idioma="idioma" :rotulo="campoDoDocumento.rotulo" preview />
      </section>
    </template>
  </USlideover>
</template>
