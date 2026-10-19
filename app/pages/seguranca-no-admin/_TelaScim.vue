<script setup lang="ts">
/**
 * Pedido 6 (parte 1): Identidade › Provisionamento (SCIM). Tela nova.
 *
 * Hoje o ENSPACE entra por SSO (Keycloak com Microsoft), mas criar e desativar
 * pessoa é à mão. Referências: Notion (desativar pelo SCIM desloga todas as
 * sessões), Atlassian (URL base e chave mostradas 1 vez, chave com validade de
 * 1 ano), Linear (com SCIM ligado, gestão de pessoas sai da tela) e a doc do
 * Entra (ciclo de cerca de 40 minutos). A tela diz isso com todas as letras e
 * leva para Sessões, onde o encerramento é na hora.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import SegredoUmaVez from './_SegredoUmaVez.vue'
import { AGORA, DIA, chamadasScim, gruposDoEntra, ha, nomeDoWorkspace, pessoas } from './mocks'
import { data, numero, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const idioma = useIdioma()
const toast = useToast()
const tc = computed(() => props.t.scim)

const estado = useState('sa-scim', () => ({ ativo: true, temToken: true, criado: ha(9 * DIA), desativar: 'suspender' as 'suspender' | 'remover', transferir: pessoas[0]!.nome }))
const url = 'https://api.enspace.io/scim/v2/org_horizonte-bioenergia'
const copiado = ref(false)
async function copiarUrl() {
  try { await navigator.clipboard.writeText(url) }
  catch { /* sem permissão: o estado visual basta */ }
  copiado.value = true
  setTimeout(() => { copiado.value = false }, 1600)
}

const gerar = ref(false)
const segredo = ref(false)
function gerarToken() {
  gerar.value = false
  estado.value.temToken = true
  estado.value.criado = new Date(AGORA)
  segredo.value = true
}
function revogar() {
  estado.value.temToken = false
  toast.add({ title: tc.value.revogado, icon: 'i-lucide-ban', color: 'warning' })
}

const colunasCham = computed<EnTableColumn[]>(() => [
  { key: 'quando', label: tc.value.colCham.quando },
  { key: 'operacao', label: tc.value.colCham.operacao },
  { key: 'pessoa', label: tc.value.colCham.pessoa },
  { key: 'resultado', label: tc.value.colCham.resultado },
  { key: 'detalhe', label: tc.value.colCham.detalhe },
])
const colunasGrupo = computed<EnTableColumn[]>(() => [
  { key: 'grupo', label: tc.value.colGrupo.grupo },
  { key: 'workspace', label: tc.value.colGrupo.workspace },
  { key: 'papel', label: tc.value.colGrupo.papel },
  { key: 'membros', label: tc.value.colGrupo.membros, align: 'right' },
])
const corDaOperacao = { criar: 'success', atualizar: 'info', desativar: 'error', grupo: 'neutral' } as const
</script>

<template>
  <div>
    <Cabecalho :titulo="tc.titulo" :intro="tc.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo" />

    <div class="space-y-4 p-6">
      <!-- Situação -->
      <section class="flex flex-wrap items-center gap-4 rounded-lg border border-default bg-default p-4 animate-[entrada_.3s_ease-out_both]">
        <span class="relative flex size-11 items-center justify-center rounded-lg bg-info/10">
          <UIcon name="i-lucide-refresh-cw" class="size-5 text-info" />
          <span v-if="estado.ativo && estado.temToken" class="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-success ring-2 ring-default" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold text-highlighted">{{ estado.temToken ? tc.conectado : tc.desconectado }}</p>
          <p class="text-xs text-muted">{{ tc.ultimaChamada(relativo(chamadasScim[0]!.quando, idioma)) }} · {{ tc.gerenciadas(numero(312, idioma)) }}</p>
        </div>
        <USwitch v-model="estado.ativo" :label="tc.ativo" />
      </section>

      <div class="grid gap-4 xl:grid-cols-2">
        <!-- Conexão -->
        <Regra :titulo="tc.conexao" icone="i-lucide-plug">
          <UFormField :label="tc.url">
            <div class="flex gap-2">
              <UInput :model-value="url" readonly class="min-w-0 flex-1" :ui="{ base: 'font-mono text-xs' }" />
              <UButton :icon="copiado ? 'i-lucide-check' : 'i-lucide-copy'" :label="copiado ? t.comum.copiado : t.comum.copiar" color="neutral" variant="outline" size="sm" @click="copiarUrl" />
            </div>
          </UFormField>
          <UFormField :label="tc.token">
            <div v-if="estado.temToken" class="flex flex-wrap items-center gap-2">
              <code class="rounded-md border border-default bg-elevated px-2 py-1 font-mono text-xs text-toned">scim_••••••••7d1a</code>
              <span class="text-xs text-muted">{{ tc.tokenInfo(data(estado.criado, idioma), data(new Date(new Date(estado.criado).getTime() + 365 * DIA), idioma)) }}</span>
            </div>
            <p v-else class="text-sm text-warning">{{ tc.desconectado }}</p>
          </UFormField>
          <div class="flex gap-2">
            <UButton :label="tc.gerar" icon="i-lucide-key-round" size="sm" color="neutral" variant="outline" @click="gerar = true" />
            <UButton v-if="estado.temToken" :label="tc.revogar" icon="i-lucide-ban" size="sm" color="error" variant="ghost" @click="revogar" />
          </div>
        </Regra>

        <!-- Desativação -->
        <Regra :titulo="tc.desativar" icone="i-lucide-user-x">
          <URadioGroup v-model="estado.desativar" :items="(['suspender', 'remover'] as const).map(v => ({ label: tc.desativarOpcoes[v], value: v }))" />
          <UFormField :label="tc.transferir">
            <USelect v-model="estado.transferir" :items="pessoas.slice(0, 11).map(p => p.nome)" class="w-64" />
          </UFormField>
          <UAlert
            icon="i-lucide-timer"
            color="warning"
            variant="soft"
            :description="tc.janela"
            :actions="[{ label: tc.irSessoes, color: 'warning', variant: 'solid', size: 'xs', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('navegar', 'sessoes') }]"
          />
        </Regra>
      </div>

      <div class="grid gap-4 xl:grid-cols-[20rem_1fr]">
        <!-- Atributos -->
        <Regra :titulo="tc.atributos" icone="i-lucide-arrow-right-left">
          <dl class="divide-y divide-default text-sm">
            <div v-for="[e, n] in tc.attrs" :key="e" class="flex items-center gap-2 py-1.5">
              <dt class="flex-1 font-mono text-xs text-muted">{{ e }}</dt>
              <UIcon name="i-lucide-arrow-right" class="size-3.5 text-dimmed" />
              <dd class="flex-1 text-highlighted">{{ n }}</dd>
            </div>
          </dl>
        </Regra>
        <!-- Grupos -->
        <section class="space-y-2">
          <h3 class="text-sm font-semibold text-highlighted">{{ tc.grupos }}</h3>
          <EnTable :columns="colunasGrupo" :rows="(gruposDoEntra as unknown as Record<string, unknown>[])" :locale="idioma">
            <template #cell-grupo="{ row }"><code class="font-mono text-xs text-highlighted">{{ (row as any).grupo }}</code></template>
            <template #cell-workspace="{ row }"><span class="text-sm text-toned">{{ (row as any).workspace === '*' ? tc.todosWs : nomeDoWorkspace((row as any).workspace) }}</span></template>
            <template #cell-papel="{ row }"><UBadge :label="t.comum.papeis[(row as any).papel as 'leitura' | 'padrao' | 'completo']" color="neutral" variant="outline" size="sm" /></template>
            <template #cell-membros="{ row }"><span class="font-mono text-xs text-toned">{{ (row as any).membros }}</span></template>
          </EnTable>
        </section>
      </div>

      <!-- Chamadas -->
      <section class="space-y-2">
        <h3 class="text-sm font-semibold text-highlighted">{{ tc.chamadas }}</h3>
        <EnTable :columns="colunasCham" :rows="(chamadasScim as unknown as Record<string, unknown>[])" :locale="idioma">
          <template #cell-quando="{ row }"><span class="whitespace-nowrap text-sm text-toned">{{ relativo((row as any).quando, idioma) }}</span></template>
          <template #cell-operacao="{ row }"><UBadge :label="tc.operacoes[(row as any).operacao as 'criar']" :color="corDaOperacao[(row as any).operacao as 'criar']" variant="soft" size="sm" /></template>
          <template #cell-pessoa="{ row }"><span class="text-sm text-highlighted">{{ (row as any).pessoa }}</span></template>
          <template #cell-resultado="{ row }"><UBadge :label="tc.resultados[(row as any).resultado as 'ok' | 'erro']" :color="(row as any).resultado === 'ok' ? 'success' : 'error'" variant="outline" size="sm" /></template>
          <template #cell-detalhe="{ row }"><span class="text-xs text-muted">{{ (row as any).detalhe }}</span></template>
        </EnTable>
      </section>
    </div>

    <UModal v-model:open="gerar" :title="tc.gerar" :description="tc.gerarTexto">
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="gerar = false" />
          <UButton :label="tc.gerarBotao" @click="gerarToken" />
        </div>
      </template>
    </UModal>
    <SegredoUmaVez v-model:open="segredo" :t="t" :titulo="tc.novoToken" :valores="[{ rotulo: tc.url, valor: url }, { rotulo: tc.token, valor: 'scim_K8f2Lq9xWz3Rt6Vb1Nm4Hp7Jd0Gs5Yc2' }]" />
  </div>
</template>
