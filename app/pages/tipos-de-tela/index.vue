<script setup lang="ts">
import type { Component } from 'vue'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import TelaListaDeItens from './_TelaListaDeItens.vue'
import TelaFilaDeTarefas from './_TelaFilaDeTarefas.vue'
import TelaPainel from './_TelaPainel.vue'
import TelaDocumentos from './_TelaDocumentos.vue'
import TelaPaginaExterna from './_TelaPaginaExterna.vue'
import TelaAbrirRequisicao from './_TelaAbrirRequisicao.vue'
import TelaMinhasRequisicoes from './_TelaMinhasRequisicoes.vue'
import TelaTriagem from './_TelaTriagem.vue'
import { textos } from './textos'
import { workspace } from './mocks'
import { esperar, useTiposDeTela, type Cenario, type ModoDaPaginaExterna, type Tela } from './estado'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Tipos de tela',
  descricao: 'Os 13 tipos de Interface > Telas viram 5 tipos de menu (Lista de itens, Fila de tarefas, Painel, Documentos e Página externa) e o módulo Requisições, fixo no menu, com Abrir requisição, Minhas requisições e Triagem. O tipo Customizado sai.',
  status: 'em-revisao',
  atualizado: '2026-10-21',
  tela: 'Menu lateral › Tipos de menu e módulo Requisições',
})

const t = useTextos(textos)
const { tela, cenario, perfil, semGrupo, modoExterna, envioFalha, contadores } = useTiposDeTela()

const componentes: Record<Tela, Component> = {
  lista: TelaListaDeItens,
  fila: TelaFilaDeTarefas,
  painel: TelaPainel,
  documentos: TelaDocumentos,
  externa: TelaPaginaExterna,
  abrir: TelaAbrirRequisicao,
  minhas: TelaMinhasRequisicoes,
  triagem: TelaTriagem,
}

/* "Tentar de novo" no erro: carrega e volta para o cheio. */
async function tentarDeNovo() {
  cenario.value = 'carregando'
  await esperar(900)
  cenario.value = 'cheio'
}

/* Trocar de tela mostra o carregando curto, como no produto. */
async function abrir(nova: Tela) {
  if (nova === tela.value) return
  tela.value = nova
  if (cenario.value === 'cheio') {
    cenario.value = 'carregando'
    await esperar(350)
    cenario.value = 'cheio'
  }
}

/* ------------------------------------------------------------------ *
 * Andaime
 * ------------------------------------------------------------------ */

const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'cheio', rotulo: 'Cheio' },
  { valor: 'vazio', rotulo: 'Vazio' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'erro', rotulo: 'Erro' },
  { valor: 'sem-permissao', rotulo: 'Sem permissão' },
]

const telas: { valor: Tela, rotulo: string }[] = [
  { valor: 'lista', rotulo: 'Lista de itens' },
  { valor: 'fila', rotulo: 'Fila de tarefas' },
  { valor: 'painel', rotulo: 'Painel' },
  { valor: 'documentos', rotulo: 'Documentos' },
  { valor: 'externa', rotulo: 'Página externa' },
  { valor: 'abrir', rotulo: 'Abrir requisição' },
  { valor: 'minhas', rotulo: 'Minhas requisições' },
  { valor: 'triagem', rotulo: 'Triagem' },
]

const modosExterna: { valor: ModoDaPaginaExterna, rotulo: string }[] = [
  { valor: 'embutida', rotulo: 'Embutida' },
  { valor: 'recusa', rotulo: 'Site recusa' },
  { valor: 'nova-aba', rotulo: 'Abre em nova aba' },
]

/** O mapa que o dev mais pergunta: para onde foi cada tipo legado. */
const mapa: { legado: string, destino: string, tela: Tela | null, nativo?: boolean }[] = [
  { legado: 'Arquivos', destino: 'Documentos (funde com a nativa Documents)', tela: 'documentos' },
  { legado: 'Consultas', destino: 'Lista de itens, recorte Todos', tela: 'lista' },
  { legado: 'Consultas (Grupo de Membros)', destino: 'Lista de itens, recorte Do meu grupo', tela: 'lista' },
  { legado: 'Conteúdo Embutido', destino: 'Página externa', tela: 'externa' },
  { legado: 'Customizado', destino: 'Deixa de existir. O atalho externo vai para Página externa', tela: null },
  { legado: 'Meus Itens', destino: 'Lista de itens, recorte Só os meus', tela: 'lista' },
  { legado: 'Minhas Requisições', destino: 'Módulo Requisições, Minhas requisições', tela: 'minhas', nativo: true },
  { legado: 'Painéis', destino: 'Painel', tela: 'painel' },
  { legado: 'Requisições', destino: 'Módulo Requisições, Abrir requisição', tela: 'abrir', nativo: true },
  { legado: 'Tarefas', destino: 'Fila de tarefas', tela: 'fila' },
  { legado: 'Tarefas Geral', destino: 'Fila de tarefas, recorte Todas', tela: 'fila' },
  { legado: 'Telas Personalizadas', destino: 'Lista de itens (visualização salva e coluna de expressão)', tela: 'lista' },
  { legado: 'Triagem', destino: 'Módulo Requisições, Triagem', tela: 'triagem', nativo: true },
]
const mapaAberto = ref(false)
</script>

<template>
  <CascaDoEnspace
    :t="t"
    :workspace="workspace.name"
    :slug="workspace.reference"
    :ativo="tela"
    :contadores="contadores"
    @abrir="abrir"
  >
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <component
        :is="componentes[tela]"
        :key="tela"
        :t="t"
        @tentar-de-novo="tentarDeNovo"
        @acompanhar="abrir('minhas')"
        @abrir-requisicao="abrir('abrir')"
        @abrir-lista="abrir('lista')"
      />
    </div>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Protótipo · tela</span>
        <USelect
          :model-value="tela"
          :items="telas.map(x => ({ label: x.rotulo, value: x.valor }))"
          size="xs"
          class="w-44"
          aria-label="Tela"
          @update:model-value="(v) => abrir(v as Tela)"
        />
        <UPopover v-model:open="mapaAberto" :content="{ side: 'top', align: 'start' }">
          <UButton label="De onde veio cada tela" icon="i-lucide-map" size="xs" color="neutral" variant="subtle" />
          <template #content>
            <div class="w-[40rem] max-w-[90vw] p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">Os 13 tipos legados de Interface &gt; Telas</p>
              <ul class="divide-y divide-default text-sm">
                <li v-for="m in mapa" :key="m.legado" class="flex items-center gap-3 py-1.5">
                  <span class="w-52 shrink-0 text-toned">{{ m.legado }}</span>
                  <UIcon name="i-lucide-arrow-right" class="size-3.5 shrink-0 text-dimmed" />
                  <UButton
                    v-if="m.tela"
                    :label="m.destino"
                    color="primary"
                    variant="link"
                    size="xs"
                    class="px-0 text-left"
                    @click="abrir(m.tela!); mapaAberto = false"
                  />
                  <span v-else class="text-xs text-error">{{ m.destino }}</span>
                  <UBadge v-if="m.nativo" label="Nativo" icon="i-lucide-pin" color="primary" variant="solid" size="xs" class="ml-auto shrink-0" />
                  <UBadge v-else-if="m.tela" label="Criado pelo admin" color="neutral" variant="outline" size="xs" class="ml-auto shrink-0" />
                </li>
              </ul>
            </div>
          </template>
        </UPopover>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Cenário</span>
        <UButton
          v-for="c in cenarios"
          :key="c.valor"
          :label="c.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="cenario === c.valor ? 'primary' : 'neutral'"
          :variant="cenario === c.valor ? 'solid' : 'subtle'"
          @click="cenario = c.valor"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Quem usa</span>
        <UButton
          v-for="p in [{ valor: 'membro', rotulo: 'Membro' }, { valor: 'gestor', rotulo: 'Gerencia a categoria' }] as const"
          :key="p.valor"
          :label="p.rotulo"
          size="xs"
          :color="perfil === p.valor ? 'primary' : 'neutral'"
          :variant="perfil === p.valor ? 'solid' : 'subtle'"
          @click="perfil = p.valor"
        />

        <!-- As variações que só fazem sentido na tela aberta -->
        <template v-if="tela === 'lista' || tela === 'fila' || tela === 'abrir'">
          <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
          <USwitch v-model="semGrupo" size="xs" label="Sem grupo" />
        </template>
        <template v-if="tela === 'externa'">
          <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
          <UButton
            v-for="m in modosExterna"
            :key="m.valor"
            :label="m.rotulo"
            size="xs"
            :color="modoExterna === m.valor ? 'primary' : 'neutral'"
            :variant="modoExterna === m.valor ? 'solid' : 'subtle'"
            @click="modoExterna = m.valor"
          />
        </template>
        <template v-if="tela === 'abrir'">
          <USwitch v-model="envioFalha" size="xs" label="Envio falha" />
        </template>

        <ControlesDePrototipo class="ml-auto" />
        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/tipos-de-tela"
          />
        </span>
      </div>
    </div>
  </CascaDoEnspace>
</template>
