<script setup lang="ts">
/**
 * Formulário anônimo: o canal de denúncia que não guarda quem denunciou.
 *
 * Uma porta, 3 jornadas que se navegam por dentro (andaime "Ir para"):
 *   1. quem configura: Formulários (Visibilidade "Anônimo" e a aba Anonimato) e
 *      o Spaceflow do caso (nó "Responder ao denunciante");
 *   2. quem denuncia: a página pública e o acompanhamento com protocolo e senha;
 *   3. o comitê: a lista de denúncias e o painel do item, criado por anonymous.
 * Uma denúncia enviada na página pública aparece na lista do comitê, e a
 * resposta do comitê aparece no acompanhamento. Tudo em memória.
 */
import type { Component } from 'vue'
import type { DropdownMenuItem } from '@nuxt/ui'
import { textos } from './textos'
import { EXEMPLO, categoria, workspace } from './mocks'
import { type Cenario, type Tela, useFormularioAnonimo } from './estado'
import CascaDoEnspace from './_CascaDoEnspace.vue'
import CascaPublica from './_CascaPublica.vue'
import TelaFormularios from './_TelaFormularios.vue'
import TelaSpaceflow from './_TelaSpaceflow.vue'
import TelaItens from './_TelaItens.vue'
import PaginaPublica from './_PaginaPublica.vue'
import Acompanhar from './_Acompanhar.vue'
import Construtor from './_Construtor.vue'
import RevisaoDoCanal from './_RevisaoDoCanal.vue'
import ForaDoEnspace from './_ForaDoEnspace.vue'
import Jornada from './_Jornada.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Formulário anônimo',
  descricao: 'Canal de denúncia sem login, nas 2 jornadas: quem configura (criar, montar com verificação de anonimato, revisar a categoria, publicar e testar) e quem denuncia (cartaz, envio sem login, protocolo e senha, aviso sem conteúdo, resposta). O item nasce com o usuário genérico anonymous.',
  status: 'em-revisao',
  atualizado: '2026-10-15',
  tela: 'Formulários, construtor, revisão do canal, Spaceflow, página pública, acompanhamento e lista de denúncias',
})

const t = useTextos(textos)
useHead({ title: () => t.value.publico.titulo })
const { tela, cenario, destacar, itemAberto, noAberto, passoPublico, sessaoDoDenunciante, ir } = useFormularioAnonimo()

const telasDoEnspace: Partial<Record<Tela, Component>> = {
  formularios: TelaFormularios,
  construtor: Construtor,
  spaceflow: TelaSpaceflow,
  itens: TelaItens,
}
const publica = computed(() => tela.value === 'publico' || tela.value === 'acompanhar')

/** A trilha que o develop mostra em cada tela. */
const trilha = computed(() => {
  const c = t.value.casca
  const ws = workspace.name
  switch (tela.value) {
    case 'formularios': return [ws, c.configuracoes, c.dados, c.itens.estruturaCategorias, categoria.name, t.value.categoria.formulario]
    case 'construtor': return [ws, c.configuracoes, c.dados, c.itens.estruturaCategorias, categoria.name, t.value.categoria.formulario, '<identificação>', 'builder']
    case 'spaceflow': return [ws, c.configuracoes, c.dados, c.itens.spaceflows, '612']
    case 'itens': return [ws, c.itens.categorias, categoria.name]
  }
  return [ws]
})

/* ---------- andaime ---------- */

const irPara = computed<DropdownMenuItem[][]>(() => [
  [{ type: 'label', label: t.value.andaime.quemConfigura }],
  [
    { label: t.value.construtor.titulo, icon: 'i-lucide-blocks', onSelect: () => ir('construtor') },
    { label: t.value.andaime.formulario, icon: 'i-lucide-file-spreadsheet', onSelect: () => ir('formularios', { formulario: 3520, abaDoFormulario: 'anonimato' }) },
    { label: t.value.andaime.fluxo, icon: 'i-lucide-workflow', onSelect: () => ir('spaceflow', { no: 'start' }) },
  ],
  [{ type: 'label', label: t.value.andaime.denunciante }],
  [
    { label: t.value.andaime.paginaPublica, icon: 'i-lucide-globe', onSelect: () => { passoPublico.value = 'formulario'; ir('publico') } },
    { label: t.value.andaime.acompanhar, icon: 'i-lucide-inbox', onSelect: () => { sessaoDoDenunciante.value = null; ir('acompanhar') } },
  ],
  [{ type: 'label', label: t.value.andaime.comite }],
  [
    { label: t.value.andaime.listaDeDenuncias, icon: 'i-lucide-table', onSelect: () => ir('itens', { item: null }) },
    { label: t.value.andaime.umaDenuncia(EXEMPLO.data.protocolo), icon: 'i-lucide-shield-alert', onSelect: () => ir('itens', { item: EXEMPLO.id, aba: 'canal' }) },
  ],
])

const cenarios = computed<{ value: Cenario, label: string }[]>(() => [
  { value: 'normal', label: t.value.andaime.cenarios.normal },
  { value: 'vazio', label: t.value.andaime.cenarios.vazio },
  { value: 'pico', label: t.value.andaime.cenarios.pico },
  { value: 'falha', label: t.value.andaime.cenarios.falha },
])

// Ao trocar de tela pelo menu, fecha o que estava aberto da outra tela.
watch(tela, (nova) => {
  if (nova !== 'itens') itemAberto.value = null
  if (nova !== 'spaceflow') noAberto.value = null
})
</script>

<template>
  <div>
    <Transition
      mode="out-in"
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <!-- O div dá um elemento só ao Transition: o EnLayout não tem raiz única e travava o out-in. -->
      <div v-if="tela === 'fora'" key="fora">
        <ForaDoEnspace :t="t" />
      </div>

      <div v-else-if="publica" key="publica">
      <CascaPublica :t="t">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <PaginaPublica v-if="tela === 'publico'" key="publico" :t="t" />
          <Acompanhar v-else key="acompanhar" :t="t" />
        </Transition>
      </CascaPublica>
      </div>

      <div v-else key="enspace">
      <CascaDoEnspace :t="t" :trilha="trilha">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-100 ease-in"
          leave-to-class="opacity-0"
        >
          <component :is="telasDoEnspace[tela]" :key="tela" :t="t" />
        </Transition>
      </CascaDoEnspace>
      </div>
    </Transition>

    <!-- PROPOSTA: a revisão antes de publicar e o aviso de canal publicado (abrem do construtor e da lista) -->
    <RevisaoDoCanal :t="t" />

    <!-- ANDAIME: o guia das 2 jornadas -->
    <Jornada :t="t" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.prototipo }}</span>
        <UDropdownMenu :items="irPara" :content="{ side: 'top', align: 'start' }" :ui="{ content: 'w-72' }">
          <UButton :label="t.andaime.irPara" icon="i-lucide-map" trailing-icon="i-lucide-chevron-up" size="xs" color="neutral" variant="subtle" />
        </UDropdownMenu>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.cenario }}</span>
        <UButton
          v-for="c in cenarios"
          :key="c.value"
          :label="c.label"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="cenario === c.value ? 'primary' : 'neutral'"
          :variant="cenario === c.value ? 'solid' : 'subtle'"
          @click="cenario = c.value"
        />

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <USwitch v-model="destacar" :label="t.andaime.mostrarOQueMuda" size="sm" :ui="{ label: 'text-xs' }" />

        <span v-if="tela === 'acompanhar' && !sessaoDoDenunciante" class="font-mono text-[11px] text-muted">
          {{ t.andaime.senhaDoExemplo(EXEMPLO.data.protocolo, EXEMPLO.senhaDoPrototipo) }}
        </span>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/formulario-anonimo"
          />
        </span>
      </div>
    </div>
  </div>
</template>
