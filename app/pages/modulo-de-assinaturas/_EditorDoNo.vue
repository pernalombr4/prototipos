<script setup lang="ts">
/**
 * O editor do nó Assinatura eletrônica.
 *
 * Cópia da prévia: Nome, Modo de execução, Título, Mensagem, Documento, Signatários, Lista de signatários e
 * Configurações (Expira em, Aguardar assinatura). PROPOSTA (B7):
 * - 1 campo de credencial, agrupado por provedor e com o nome do provedor. Hoje são 2 campos e o provedor aparece pelo
 *   código ("adobesign", M24);
 * - Documento escolhe entre "De um nó anterior" e "Arquivo fixo"; Signatários entre Fixos, De uma lista ou os dois. Só o
 *   que foi escolhido fica aberto;
 * - C55: o caminho da lista diz onde fica a entrada do disparo, `workflow_input.input`;
 * - a ordem diz se assinam ao mesmo tempo ou em sequência (M24);
 * - "Se o envelope for recusado, cancelado ou expirar" deixa escolher entre dar erro (o padrão) e seguir.
 */
import { provedores } from './mocks'
import { credenciaisVisiveis, credencialPronta } from './estado'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ fechar: [] }>()
const ed = computed(() => props.t.fluxo.editor)

const nome = ref(props.t.fluxo.assinatura)
const modo = ref('auto')
const credencial = ref<number>(58)
const titulo = ref('Contrato {{ trigger.item.title }}')
const doc = ref<'variavel' | 'fixo'>('variavel')
const sig = ref<'fixos' | 'lista' | 'ambos'>('lista')
const caminho = ref('{{ input.signatarios }}')
const expira = ref(7)
const aguardar = ref(true)
const seNao = ref<'erro' | 'seguir'>('erro')
const fixos = ref([{ ordem: 1, nome: 'Juliana Costa', email: 'juliana.costa@vertice.example' }])

const itensCredencial = computed(() => provedores
  .map(p => ({ p, creds: credenciaisVisiveis.value.filter(c => c.provedor === p.id && credencialPronta(c)) }))
  .filter(g => g.creds.length)
  .map(g => [{ type: 'label' as const, label: g.p.nome }, ...g.creds.map(c => ({ label: c.nome, value: c.id }))]))

const caminhoErrado = computed(() => !caminho.value.includes('workflow_input.input'))
const ordemTexto = computed(() => (new Set(fixos.value.map(f => f.ordem)).size > 1 ? ed.value.emSequencia : ed.value.emParalelo))
</script>

<template>
  <aside class="flex w-[26rem] shrink-0 animate-[entrada_.25s_ease-out_both] flex-col border-l border-default bg-default" :aria-label="t.fluxo.assinatura">
    <header class="flex items-center gap-2 border-b border-default px-4 py-3">
      <UIcon name="i-lucide-signature" class="size-4 text-muted" />
      <h2 class="flex-1 font-semibold text-highlighted">{{ t.fluxo.assinatura }}</h2>
      <UButton icon="i-lucide-x" color="neutral" variant="ghost" size="xs" :aria-label="t.geral.fechar" @click="emit('fechar')" />
    </header>
    <div class="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-4">
      <p class="text-sm text-muted">{{ t.fluxo.assinaturaDesc }}</p>
      <UFormField :label="ed.nome"><UInput v-model="nome" class="w-full" /></UFormField>
      <UFormField :label="ed.modo">
        <USelect v-model="modo" :items="[{ value: 'auto', label: t.fluxo.automatico }, { value: 'manual', label: t.fluxo.manual }]" value-key="value" class="w-full" />
      </UFormField>
      <UFormField :label="ed.credencial" :help="ed.credencialAjuda">
        <USelect v-model="credencial" :items="itensCredencial" value-key="value" class="w-full" />
      </UFormField>

      <USeparator :label="ed.envelope" />
      <UFormField :label="ed.titulo" :help="ed.tituloAjuda"><UInput v-model="titulo" class="w-full font-mono" /></UFormField>
      <UFormField :label="ed.mensagem"><UTextarea :rows="2" autoresize class="w-full" /></UFormField>

      <UFormField :label="ed.documento">
        <URadioGroup v-model="doc" :items="[{ value: 'variavel', label: ed.docVariavel }, { value: 'fixo', label: ed.docFixo }]" orientation="horizontal" variant="table" size="sm" />
      </UFormField>
      <UInput v-if="doc === 'variavel'" model-value="{{ gerar_arquivo.file }}" :placeholder="ed.docVariavelPh" class="w-full font-mono" />
      <div v-else class="rounded-md border border-dashed border-accented px-3 py-4 text-center text-sm text-muted">{{ t.novo.soltar }}</div>

      <UFormField :label="ed.signatarios">
        <URadioGroup v-model="sig" :items="[{ value: 'fixos', label: ed.sigFixos }, { value: 'lista', label: ed.sigLista }, { value: 'ambos', label: ed.sigAmbos }]" orientation="horizontal" variant="table" size="sm" />
      </UFormField>
      <div v-if="sig !== 'lista'" class="space-y-2">
        <div v-for="(s, i) in fixos" :key="i" class="grid grid-cols-[4rem_1fr] gap-2">
          <UInputNumber v-model="s.ordem" :min="1" size="sm" :aria-label="t.novo.ordem" />
          <div class="space-y-1"><UInput v-model="s.nome" size="sm" class="w-full" :aria-label="t.novo.nome" /><UInput v-model="s.email" size="sm" class="w-full" :aria-label="t.novo.email" /></div>
        </div>
        <p class="text-xs text-muted">{{ t.envelope.ordem(1) }} · {{ ordemTexto }}</p>
        <UButton :label="ed.adicionar" icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" @click="fixos.push({ ordem: fixos.length + 1, nome: '', email: '' })" />
      </div>
      <div v-if="sig !== 'fixos'" class="space-y-3 rounded-md border border-default p-3">
        <!-- C55: a dica do caminho da entrada do disparo -->
        <UFormField :label="ed.caminho" :error="caminhoErrado ? ed.caminhoAjuda : undefined" :help="caminhoErrado ? undefined : ed.caminhoAjuda">
          <UInput v-model="caminho" :placeholder="ed.caminhoPh" class="w-full font-mono" />
        </UFormField>
        <p class="text-xs font-medium text-muted">{{ ed.chaves }}</p>
        <div class="grid grid-cols-2 gap-2">
          <UFormField :label="ed.chaveNome" size="sm"><UInput model-value="nome" size="sm" class="w-full font-mono" /></UFormField>
          <UFormField :label="ed.chaveEmail" size="sm"><UInput model-value="email" size="sm" class="w-full font-mono" /></UFormField>
          <UFormField :label="ed.chavePapel" size="sm"><UInput model-value="papel" size="sm" class="w-full font-mono" /></UFormField>
          <UFormField :label="ed.chaveOrdem" size="sm"><UInput model-value="ordem" size="sm" class="w-full font-mono" /></UFormField>
        </div>
        <UFormField :label="ed.papelPadrao" size="sm">
          <USelect model-value="signer" :items="[{ value: 'signer', label: t.papeis.signer }, { value: 'approver', label: t.papeis.approver }]" value-key="value" size="sm" class="w-full" />
        </UFormField>
      </div>

      <USeparator :label="ed.configuracoes" />
      <UFormField :label="ed.expira" :help="ed.expiraAjuda"><UInputNumber v-model="expira" :min="1" class="w-32" /></UFormField>
      <USwitch v-model="aguardar" :label="ed.aguardar" :description="ed.aguardarAjuda" />
      <UFormField v-if="aguardar" :label="ed.seNao" :help="ed.cancelamentoSempreErro">
        <URadioGroup v-model="seNao" :items="[{ value: 'erro', label: ed.seNaoErro }, { value: 'seguir', label: ed.seNaoSeguir }]" size="sm" />
      </UFormField>
    </div>
    <footer class="flex justify-end gap-2 border-t border-default px-4 py-3">
      <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="emit('fechar')" />
      <UButton :label="t.geral.salvar" @click="emit('fechar')" />
    </footer>
  </aside>
</template>
