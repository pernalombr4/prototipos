<script setup lang="ts">
/**
 * PROPOSTA (demanda 3, rodada 2): o conhecimento do agente, no jeito do
 * Claude ("conhecimento do projeto" + arquivos): uma barra de capacidade e 2
 * listas, a do workspace (vale para todos os agentes, liga e desliga aqui) e
 * a deste agente.
 *
 * Até a capacidade, tudo é lido inteiro em toda conversa. Acima dela, o agente
 * lê inteiros só os fixados e busca nos outros os trechos de cada pergunta,
 * sem aviso de erro: a pessoa vê o modo mudar. Erro só quando os fixados
 * passam da capacidade do menor modelo permitido.
 *
 * Substitui o seletor "Bases de conhecimento" (`knowledge_base_ids`) da
 * rodada 1: a busca por trechos usa a mesma base vetorial, sem a pessoa
 * precisar saber que ela existe.
 */
import type { Textos } from './textos'
import TabelaDeDocumentos from './_TabelaDeDocumentos.vue'
import NovoDocumento from './_NovoDocumento.vue'
import { arquivoGrande, type Agente, type ArquivoDeReferencia } from './mocks'
import { modeloPorId } from './catalogo'
import { conhecimentoDoAgente, fixadosCabemNo, useArquivos, useTela } from './estado'

const props = defineProps<{ t: Textos, a: Agente }>()
const arquivos = useArquivos()
const tela = useTela()
const toast = useToast()
const k = computed(() => props.t.conhecimento)

const saber = computed(() => conhecimentoDoAgente(props.a, arquivos.value))

function criado(d: ArquivoDeReferencia) {
  arquivos.value.push(d)
  props.a.arquivos.push(d.id)
}
function remover(id: string) {
  const d = arquivos.value.find(x => x.id === id)!
  props.a.arquivos = props.a.arquivos.filter(x => x !== id)
  toast.add({ title: k.value.removido(d.nome), icon: 'i-lucide-trash-2', color: 'neutral' })
}
/* Tira dos permitidos os modelos que não comportam os fixados (o padrão fica). */
function tirarModelos() {
  props.a.modelosPermitidos = props.a.modelosPermitidos.filter(id => id === props.a.model || fixadosCabemNo(modeloPorId(id)?.contexto ?? 0, saber.value.fixados))
}
function abrirDoWorkspace() {
  tela.value.editorAberto = false
  tela.value.aba = 'conhecimento'
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-base font-semibold text-highlighted">{{ k.titulo }}</h3>
      <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ k.texto }}</p>
    </div>

    <!-- Capacidade e modo de leitura -->
    <div class="rounded-lg border border-default p-4">
      <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p class="text-sm font-medium text-highlighted">{{ k.capacidade(saber.pct) }}</p>
        <UBadge
          :label="saber.modo === 'inteiro' ? k.modoInteiro : k.modoTrechos"
          :icon="saber.modo === 'inteiro' ? 'i-lucide-book-open' : 'i-lucide-search'"
          :color="saber.modo === 'inteiro' ? 'success' : 'warning'"
          variant="subtle"
        />
      </div>
      <UProgress :model-value="Math.min(saber.pct, 100)" :color="saber.modo === 'inteiro' ? 'primary' : 'warning'" size="sm" />
      <p class="mt-2 text-sm text-default" aria-live="polite">{{ saber.modo === 'inteiro' ? k.modoInteiroTexto : k.modoTrechosTexto }}</p>
      <p class="mt-1 text-xs text-muted">{{ k.total(saber.todos.length, saber.total) }} · {{ k.capacidadeAjuda(saber.menorModelo, saber.limite) }}</p>
    </div>

    <UAlert
      v-if="!saber.fixadosCabem"
      color="error"
      variant="subtle"
      icon="i-lucide-circle-alert"
      :title="k.fixadosNaoCabemTitulo"
      :description="k.fixadosNaoCabem(saber.menorModelo)"
      :actions="a.modelosPermitidos.length > 1 ? [{ label: k.tirarModelos, color: 'error', variant: 'outline', onClick: tirarModelos }] : []"
    />

    <!-- Do workspace -->
    <section class="space-y-3">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-building-2" class="size-4 text-muted" />{{ k.workspaceTitulo }}</h4>
          <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ k.workspaceTexto }}</p>
        </div>
        <UButton :label="k.gerenciar" icon="i-lucide-external-link" color="neutral" variant="outline" size="sm" @click="abrirDoWorkspace" />
      </div>
      <USwitch v-model="a.usarDoWorkspace" :label="k.usarWorkspace" />
      <TabelaDeDocumentos v-if="a.usarDoWorkspace" :t="t" :docs="saber.doWorkspace" compacta />
      <p v-else class="rounded-lg bg-elevated/50 px-4 py-4 text-center text-sm text-muted">{{ k.workspaceDesligado }}</p>
    </section>

    <USeparator />

    <!-- Deste agente -->
    <section class="space-y-3">
      <div>
        <h4 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-bot" class="size-4 text-muted" />{{ k.agenteTitulo }}</h4>
        <p class="mt-0.5 max-w-2xl text-sm text-muted">{{ k.agenteTexto }}</p>
      </div>
      <NovoDocumento :t="t" escopo="agente" :exemplo="arquivoGrande" @criado="criado" />
      <TabelaDeDocumentos v-if="saber.doAgente.length" :t="t" :docs="saber.doAgente" @remover="remover" />
      <p v-else class="rounded-lg bg-elevated/50 px-4 py-6 text-center text-sm text-muted">{{ k.vazio }}</p>
      <p class="flex items-start gap-1.5 text-xs text-muted"><UIcon name="i-lucide-pin" class="mt-0.5 size-3.5 shrink-0" />{{ k.fixadoAjuda }}</p>
    </section>
  </div>
</template>
