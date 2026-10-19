<script setup lang="ts">
/**
 * Segurança no admin: os 10 pedidos de um cliente corporativo, no ENSPACE Admin.
 *
 * A demanda: simular o menu de hoje do admin (control.develop.enspace.io) e
 * acrescentar as telas que respondem aos 10 pontos de segurança da informação,
 * com atalho para cada ponto na barra de andaime.
 *
 * Tudo em memória. Recarregar volta ao começo. A tela atual vai na URL (?tela=)
 * para dar link direto para um ponto.
 */
import type { Component } from 'vue'
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'
import CascaDoAdmin from './_CascaDoAdmin.vue'
import type { Tela } from './_CascaDoAdmin.vue'
import TelaAuditoria from './_TelaAuditoria.vue'
import TelaSiem from './_TelaSiem.vue'
import TelaTokens from './_TelaTokens.vue'
import TelaContas from './_TelaContas.vue'
import TelaDestinos from './_TelaDestinos.vue'
import TelaIA from './_TelaIA.vue'
import TelaScim from './_TelaScim.vue'
import TelaSessoes from './_TelaSessoes.vue'
import TelaDominios from './_TelaDominios.vue'
import TelaConvites from './_TelaConvites.vue'
import TelaExportacao from './_TelaExportacao.vue'
import TelaWebhooks from './_TelaWebhooks.vue'
import TelaContinuidade from './_TelaContinuidade.vue'
import { workspaces } from './mocks'
import { textos } from './textos'

definePageMeta({
  titulo: 'Segurança no admin',
  descricao: 'Os 10 pedidos de segurança de um cliente corporativo dentro do ENSPACE Admin: auditoria com SIEM, tokens, contas de serviço, destinos HTTP, IA, SCIM, domínios, exportação, webhooks assinados e continuidade.',
  status: 'em-revisao',
  atualizado: '2026-10-19',
  tela: 'ENSPACE Admin › menu lateral e telas novas',
})

const t = useTextos(textos)
const route = useRoute()
const router = useRouter()

const telas: Tela[] = ['auditoria', 'siem', 'dominios', 'scim', 'sessoes', 'convites', 'tokens', 'contas', 'webhooks', 'destinos', 'exportacao', 'ia', 'continuidade']
const inicial = telas.includes(route.query.tela as Tela) ? route.query.tela as Tela : 'auditoria'
const tela = useState<Tela>('sa-tela', () => inicial)
const foraAtivo = ref('')
/* No site estático a página é gerada sem query: o link direto (?tela=) só vale no navegador. */
onMounted(() => {
  const q = route.query.tela as Tela
  if (telas.includes(q) && q !== tela.value) tela.value = q
})

function navegar(destino: Tela, rotulo?: string) {
  tela.value = destino
  foraAtivo.value = destino === 'fora' ? rotulo ?? '' : ''
  if (destino !== 'fora') router.replace({ query: { ...route.query, tela: destino } })
}

/* ------------------------------------------------------------------ *
 * ANDAIME: atalhos dos 10 pedidos. Não é proposta.                     *
 * ------------------------------------------------------------------ */
const pontos: { tela: Tela, tambem: Tela[] }[] = [
  { tela: 'auditoria', tambem: ['siem'] },
  { tela: 'tokens', tambem: [] },
  { tela: 'contas', tambem: [] },
  { tela: 'destinos', tambem: [] },
  { tela: 'ia', tambem: [] },
  { tela: 'scim', tambem: ['sessoes'] },
  { tela: 'dominios', tambem: [] },
  { tela: 'exportacao', tambem: ['convites'] },
  { tela: 'webhooks', tambem: [] },
  { tela: 'continuidade', tambem: [] },
]
const marcarNovo = useState('sa-marcar-novo', () => true)
const versao = ref(0)

function reiniciar() {
  clearNuxtState(k => k.startsWith('sa-') && k !== 'sa-tela' && k !== 'sa-marcar-novo')
  versao.value++
}

const componentes: Record<Exclude<Tela, 'fora'>, Component> = {
  auditoria: TelaAuditoria, siem: TelaSiem, tokens: TelaTokens, contas: TelaContas, destinos: TelaDestinos, ia: TelaIA,
  scim: TelaScim, sessoes: TelaSessoes, dominios: TelaDominios, convites: TelaConvites, exportacao: TelaExportacao,
  webhooks: TelaWebhooks, continuidade: TelaContinuidade,
}
</script>

<template>
  <div>
    <CascaDoAdmin :t="t" :tela="tela" :marcar-novo="marcarNovo" :fora-ativo="foraAtivo" :workspaces="workspaces.length" @navegar="navegar">
      <Transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-2" leave-active-class="transition duration-100" leave-to-class="opacity-0">
        <div v-if="tela === 'fora'" key="fora" class="p-6">
          <UEmpty icon="i-lucide-panel-top-dashed" :title="t.casca.foraDoEscopoTitulo" :description="t.casca.foraDoEscopo" variant="naked" class="py-24" />
        </div>
        <component :is="componentes[tela]" v-else :key="`${tela}-${versao}`" :t="t" :marcar-novo="marcarNovo" @navegar="navegar" />
      </Transition>
    </CascaDoAdmin>

    <!-- Andaime -->
    <div data-andaime class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-1.5 px-4 py-2.5">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.pedidos }}</span>
        <UButton
          v-for="(p, i) in pontos"
          :key="p.tela"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="tela === p.tela || p.tambem.includes(tela) ? 'primary' : 'neutral'"
          :variant="tela === p.tela || p.tambem.includes(tela) ? 'solid' : 'outline'"
          @click="navegar(p.tela)"
        >
          <span class="font-mono opacity-70">{{ i + 1 }}</span>
          {{ t.andaime.pontos[i] }}
        </UButton>
        <span class="mx-1 h-5 w-px bg-accented" />
        <USwitch v-model="marcarNovo" :label="t.andaime.marcarNovo" size="sm" :ui="{ label: 'text-xs' }" />
        <UButton :label="t.andaime.reiniciar" icon="i-lucide-rotate-ccw" size="xs" color="neutral" variant="ghost" @click="reiniciar" />
        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/seguranca-no-admin"
          />
        </span>
      </div>
    </div>
  </div>
</template>
