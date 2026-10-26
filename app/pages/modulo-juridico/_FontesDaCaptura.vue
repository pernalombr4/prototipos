<script setup lang="ts">
/**
 * PROPOSTA: Módulo Jurídico › Fontes (rodada 3). De onde a captura vem e se ela está rodando.
 *
 * - as 2 fontes oficiais (DJEN e Domicílio), os robôs ENSPACE que o cliente já contrata (portais, andamentos,
 *   distribuição) e o fornecedor do cliente ficam na mesma tabela;
 * - cada fonte registra cada execução, inclusive a que não achou nada: é a prova de que a captura rodou, que nenhum
 *   produto do mercado mostra (pesquisa, seção "A saúde aparece por credencial");
 * - o detalhe abre no painel à direita, com a configuração própria de cada fonte e o histórico de execuções.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Execucao, Fonte, LoginDeTribunal } from './capturas'
import { execucoesDa, fontes, loginsDeTribunal, saudeAtual } from './capturas'
import { pessoaPorId, processos } from './mocks'
import { estado } from './estado'
import type { Textos } from './textos'
import { textosCapturas } from './textos-capturas'
import { diaHoraCurto } from './formato'

const props = defineProps<{ t: Textos, erroCaptura?: boolean }>()
const leitura = defineModel<'aviso' | 'ciencia'>('leitura', { required: true })
const emit = defineEmits<{ irTermos: [] }>()
const tc = useTextos(textosCapturas)
const toast = useToast()
const idioma = useIdioma()

const saude = (f: Fonte) => saudeAtual(f, !!props.erroCaptura)
const corDaSaude = { ok: 'success', atencao: 'warning', falha: 'error' } as const
const iconeDaSaude = { ok: 'i-lucide-circle-check', atencao: 'i-lucide-triangle-alert', falha: 'i-lucide-circle-x' } as const
const comProblema = computed(() => fontes.filter(f => saude(f) !== 'ok'))

const colunas = computed<EnTableColumn[]>(() => {
  const c = tc.value.fontes.colunas
  return [
    { key: 'fonte', label: c.fonte },
    { key: 'quem', label: c.quem },
    { key: 'frequencia', label: c.frequencia },
    { key: 'ultima', label: c.ultima },
    { key: 'volume', label: c.volume },
    { key: 'saude', label: c.saude },
  ]
})

/* ---------- a fonte aberta ---------- */
const abertaId = ref<Fonte['id'] | undefined>()
const painelAberto = computed({ get: () => abertaId.value !== undefined, set: (v) => { if (!v) abertaId.value = undefined } })
const aberta = computed(() => fontes.find(f => f.id === abertaId.value))
const execucoes = computed(() => (aberta.value ? execucoesDa(aberta.value.id, !!props.erroCaptura) : []))
const colunasDeExecucao = computed<EnTableColumn[]>(() => {
  const c = tc.value.fontes.painel.colunas
  return [{ key: 'quando', label: c.quando }, { key: 'resultado', label: c.resultado }, { key: 'capturas', label: c.capturas }, { key: 'duracao', label: c.duracao }]
})
const corDoResultado = { ok: 'success', vazia: 'neutral', falha: 'error' } as const
const colunasDeLogin = computed<EnTableColumn[]>(() => {
  const c = tc.value.fontes.painel.loginColunas
  return [{ key: 'sistema', label: c.sistema }, { key: 'tribunal', label: c.tribunal }, { key: 'como', label: c.como }, { key: 'saude', label: c.saude }]
})

const termosDo = (tipo: 'oab' | 'nome' | 'cnpj') => estado.termos.filter(x => x.ativo && x.tipo === tipo).length
const opcoesDeLeitura = computed(() => [
  { value: 'aviso', label: tc.value.fontes.painel.leituraAviso },
  { value: 'ciencia', label: tc.value.fontes.painel.leituraCiencia },
])

/* ---------- adicionar fonte ---------- */
const modalAberto = ref(false)
const nova = ref<{ nome: string, tipo: 'webhook' | 'api' | 'email' }>({ nome: '', tipo: 'webhook' })
const tiposDeEntrega = computed(() => (['webhook', 'api', 'email'] as const).map(v => ({ value: v, label: tc.value.fontes.modal.tipos[v] })))
const adicionando = ref(false)
function abrirModal() {
  nova.value = { nome: '', tipo: 'webhook' }
  modalAberto.value = true
}
async function adicionar() {
  adicionando.value = true
  await new Promise(r => setTimeout(r, 650))
  adicionando.value = false
  modalAberto.value = false
  toast.add({ title: tc.value.fontes.modal.toast, icon: 'i-lucide-webhook', color: 'success' })
}

function maquete() {
  toast.add({ title: props.t.geral.foraDoEscopo, icon: 'i-lucide-construction', color: 'neutral' })
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-2">
      <p class="min-w-0 flex-1 text-sm text-toned">{{ tc.fontes.descricao }}</p>
      <UButton :label="tc.fontes.adicionar" icon="i-lucide-plus" color="neutral" variant="outline" @click="abrirModal" />
    </div>

    <UAlert
      v-if="comProblema.length"
      :title="tc.fontes.alerta.titulo(comProblema.length)"
      :description="tc.fontes.alerta.desc"
      icon="i-lucide-radio-tower"
      :color="comProblema.some(f => saude(f) === 'falha') ? 'error' : 'warning'"
      variant="subtle"
    />

    <EnTable :columns="colunas" :rows="fontes" :locale="idioma" class="[&_tbody_tr]:cursor-pointer" @row-click="(r) => { abertaId = (r as Fonte).id }">
      <template #cell-fonte="{ row }">
        <span class="flex items-center gap-3 py-1">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-elevated text-toned">
            <UIcon :name="(row as Fonte).icone" class="size-4" />
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="text-sm font-medium text-highlighted">{{ tc.fontes.curtos[(row as Fonte).id] }}</span>
            <span class="line-clamp-2 max-w-80 text-xs text-muted">{{ tc.fontes.descricoes[(row as Fonte).id] }}</span>
          </span>
        </span>
      </template>
      <template #cell-quem="{ row }">
        <UBadge :label="tc.fontes.quem[(row as Fonte).quem]" :color="(row as Fonte).quem === 'oficial' ? 'neutral' : (row as Fonte).quem === 'robo' ? 'primary' : 'info'" variant="subtle" size="sm" />
      </template>
      <template #cell-frequencia="{ row }">
        <span class="text-sm text-toned">{{ tc.fontes.frequencia((row as Fonte).frequencia) }}</span>
      </template>
      <template #cell-ultima="{ row }">
        <span class="flex flex-col">
          <span class="text-sm tabular-nums text-highlighted">{{ tc.fontes.hoje(erroCaptura && (row as Fonte).id === 'domicilio' ? '06:00' : (row as Fonte).ultima) }}</span>
          <span v-if="(row as Fonte).proxima" class="text-xs text-muted">{{ tc.fontes.proxima((row as Fonte).proxima, (row as Fonte).amanha) }}</span>
        </span>
      </template>
      <template #cell-volume="{ row }">
        <span class="text-sm tabular-nums text-toned">{{ tc.fontes.volume(erroCaptura && (row as Fonte).id === 'domicilio' ? 0 : (row as Fonte).hoje, (row as Fonte).seteDias) }}</span>
      </template>
      <template #cell-saude="{ row }">
        <UBadge :label="tc.fontes.saude[saude(row as Fonte)]" :icon="iconeDaSaude[saude(row as Fonte)]" :color="corDaSaude[saude(row as Fonte)]" variant="subtle" size="sm" />
      </template>
      <template #actions="{ row }">
        <UTooltip :text="tc.fontes.verExecucoes">
          <UButton icon="i-lucide-history" size="xs" color="neutral" variant="outline" :aria-label="tc.fontes.verExecucoes" @click.stop="abertaId = (row as Fonte).id" />
        </UTooltip>
      </template>
    </EnTable>

    <!-- A fonte, no painel à direita -->
    <USlideover v-model:open="painelAberto" :title="aberta ? tc.fontes.nomes[aberta.id] : ''" :description="aberta ? tc.fontes.descricoes[aberta.id] : ''" :ui="{ content: 'max-w-2xl' }">
      <template #body>
        <div v-if="aberta" class="flex flex-col gap-5">
          <div class="flex flex-wrap items-center gap-2">
            <UBadge :label="tc.fontes.saude[saude(aberta)]" :icon="iconeDaSaude[saude(aberta)]" :color="corDaSaude[saude(aberta)]" variant="subtle" />
            <UBadge :label="tc.fontes.quem[aberta.quem]" color="neutral" variant="outline" />
            <span class="text-xs text-muted">{{ tc.fontes.frequencia(aberta.frequencia) }}</span>
          </div>

          <!-- A configuração de cada fonte -->
          <section class="flex flex-col gap-3 rounded-lg border border-default p-4">
            <p class="text-xs font-medium text-muted">{{ tc.fontes.painel.configuracao }}</p>

            <template v-if="aberta.id === 'djen'">
              <p class="text-sm text-highlighted">{{ tc.fontes.painel.oabs(termosDo('oab')) }} · {{ tc.fontes.painel.nomes(termosDo('nome')) }}</p>
              <UButton :label="tc.fontes.painel.verTermos" icon="i-lucide-arrow-right" trailing size="xs" color="neutral" variant="outline" class="self-start" @click="painelAberto = false; emit('irTermos')" />
              <p class="text-xs text-muted">{{ tc.fontes.painel.foraDoDjen }}</p>
            </template>

            <template v-else-if="aberta.id === 'domicilio'">
              <dl class="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt class="text-xs text-muted">{{ tc.fontes.painel.credencial }}</dt>
                  <dd class="flex items-center gap-1.5 font-mono text-xs text-highlighted">
                    <UIcon :name="erroCaptura ? 'i-lucide-circle-x' : 'i-lucide-circle-check'" class="size-3.5" :class="erroCaptura ? 'text-error' : 'text-success'" />••••••••3f2a
                  </dd>
                </div>
                <div>
                  <dt class="text-xs text-muted">CNPJ</dt>
                  <dd class="text-highlighted">{{ tc.fontes.painel.cnpjs(termosDo('cnpj')) }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-muted">{{ tc.fontes.painel.leitor }}</dt>
                  <dd class="text-highlighted">{{ pessoaPorId.get(11)?.nome }}</dd>
                </div>
              </dl>
              <p class="text-xs text-muted">{{ tc.fontes.painel.leitorAjuda }}</p>
              <UButton v-if="erroCaptura" :label="tc.fontes.painel.revisarCredencial" icon="i-lucide-key-round" color="error" variant="outline" size="sm" class="self-start" @click="maquete" />
              <UFormField :label="tc.fontes.painel.leitura" :help="tc.fontes.painel.leituraAjuda">
                <URadioGroup v-model="leitura" :items="opcoesDeLeitura" class="mt-1" />
              </UFormField>
            </template>

            <template v-else-if="aberta.id === 'portais'">
              <p class="text-sm font-medium text-highlighted">{{ tc.fontes.painel.logins }}</p>
              <EnTable :columns="colunasDeLogin" :rows="loginsDeTribunal" :locale="idioma">
                <template #cell-como="{ row }">
                  <span class="text-sm text-toned">{{ tc.fontes.painel.como[(row as LoginDeTribunal).como] }}</span>
                </template>
                <template #cell-saude="{ row }">
                  <span class="flex flex-col gap-1">
                    <UBadge :label="tc.fontes.saude[(row as LoginDeTribunal).saude]" :color="corDaSaude[(row as LoginDeTribunal).saude]" variant="subtle" size="sm" class="self-start" />
                    <span v-if="(row as LoginDeTribunal).detalhe" class="text-xs text-error">{{ tc.fontes.painel.detalhes.certificado }}</span>
                  </span>
                </template>
                <template #actions="{ row }">
                  <UTooltip v-if="(row as LoginDeTribunal).saude === 'falha'" :text="tc.fontes.painel.renovar">
                    <UButton icon="i-lucide-upload" size="xs" color="error" variant="outline" :aria-label="tc.fontes.painel.renovar" @click="maquete" />
                  </UTooltip>
                  <span v-else />
                </template>
              </EnTable>
            </template>

            <template v-else-if="aberta.id === 'andamentos'">
              <p class="text-sm text-highlighted">{{ tc.fontes.painel.processos(processos.length) }}</p>
              <p class="text-xs text-muted">{{ tc.fontes.painel.consulta }}</p>
            </template>

            <template v-else-if="aberta.id === 'distribuicao'">
              <p class="text-sm text-highlighted">{{ tc.fontes.painel.cnpjs(termosDo('cnpj')) }}</p>
              <p class="text-xs text-muted">{{ tc.fontes.painel.distribuicaoAjuda }}</p>
            </template>

            <template v-else-if="aberta.id === 'externo'">
              <UFormField :label="tc.fontes.painel.webhook">
                <UInput model-value="https://grupo-aurora.enspace.example/capturas/webhook/7c1e" readonly class="w-full font-mono" />
              </UFormField>
              <UFormField :label="tc.fontes.painel.token">
                <UInput model-value="••••••••••••a91d" readonly class="w-full font-mono" />
              </UFormField>
              <p class="text-xs text-muted">{{ tc.fontes.painel.dedupe }}</p>
            </template>
          </section>

          <!-- Execuções -->
          <section class="flex flex-col gap-2">
            <div class="flex flex-wrap items-center gap-2">
              <p class="min-w-0 flex-1 text-sm font-semibold text-highlighted">{{ tc.fontes.painel.execucoes }}</p>
              <UButton :label="tc.fontes.painel.recibo" icon="i-lucide-file-down" size="xs" color="neutral" variant="outline" @click="maquete" />
            </div>
            <p class="text-xs text-muted">{{ tc.fontes.painel.reciboAjuda }}</p>
            <EnTable :columns="colunasDeExecucao" :rows="execucoes" :locale="idioma">
              <template #cell-quando="{ row }">
                <span class="text-sm tabular-nums text-highlighted">{{ diaHoraCurto((row as Execucao).quando, t.locale) }}</span>
              </template>
              <template #cell-resultado="{ row }">
                <span class="flex flex-col gap-1 py-1">
                  <UBadge :label="tc.fontes.painel.resultados[(row as Execucao).resultado]" :color="corDoResultado[(row as Execucao).resultado]" variant="subtle" size="sm" class="self-start" />
                  <span v-if="(row as Execucao).detalhe" class="max-w-72 text-xs text-muted">{{ tc.fontes.painel.detalhes[(row as Execucao).detalhe!] }}</span>
                </span>
              </template>
              <template #cell-capturas="{ row }">
                <span class="text-sm tabular-nums text-toned">{{ (row as Execucao).capturas }}</span>
              </template>
              <template #cell-duracao="{ row }">
                <span class="text-sm tabular-nums text-muted">{{ (row as Execucao).duracao }}</span>
              </template>
            </EnTable>
          </section>
        </div>
      </template>
    </USlideover>

    <!-- Adicionar fonte -->
    <UModal v-model:open="modalAberto" :title="tc.fontes.modal.titulo">
      <template #body>
        <div class="flex flex-col gap-4">
          <UFormField :label="tc.fontes.modal.nome" required>
            <UInput v-model="nova.nome" :placeholder="tc.fontes.modal.nomePh" class="w-full" />
          </UFormField>
          <UFormField :label="tc.fontes.modal.tipo" :help="tc.fontes.modal.tiposAjuda[nova.tipo]">
            <USelect v-model="nova.tipo" :items="tiposDeEntrega" class="w-full" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="modalAberto = false" />
          <UButton :label="tc.fontes.modal.confirmar" icon="i-lucide-plus" :loading="adicionando" :disabled="!nova.nome.trim()" @click="adicionar" />
        </div>
      </template>
    </UModal>
  </div>
</template>
