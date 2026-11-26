<script setup lang="ts">
/**
 * O painel da seção do workspace Comercial (rodada 3, as 3 camadas convivendo).
 *
 * CASCA: a seção do workspace do menu novo (menu-lateral, rodada 35) é o menu personalizado de
 * hoje (Interface > Menus): o administrador monta, os grupos escolhidos veem a mesma seção. As
 * telas são as de lá: Painel de vendas (com Metas do trimestre), Triagem de propostas e Minhas
 * requisições. Nada disso é proposta, e as telas avisam que são maquete.
 *
 * PROPOSTA: a seção continua servindo de atalho para o que cruza projetos, e ganha o atalho para
 * categoria de projeto. Esse atalho segue o acesso do projeto: quem não participa não o vê. A
 * seção não muda o acesso a nada; quem decide quem vê o dado é o projeto.
 */
import type { Textos } from './textos'
import { secaoComercial } from './mocks'
import { COR_DO_PROJETO, ICONE_DA_VISIBILIDADE, useMarcaDeProposta, useProjetos } from './estado'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ recolher: [] }>()
const prj = useProjetos()
const { marca } = useMarcaDeProposta()
const toast = useToast()

const maquete = () => toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
const categorias = computed(() => secaoComercial.categorias
  .map(id => prj.categorias.value.find(c => c.id === id))
  .filter((c): c is NonNullable<typeof c> => !!c && prj.veCategoria(c)))
const ativa = computed(() => prj.tela.value.tipo === 'categoria' ? prj.tela.value.id : null)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex h-12 shrink-0 items-center gap-0.5 border-b border-default pl-3 pr-1.5">
      <div class="min-w-0 flex-1">
        <h2 class="truncate text-sm font-bold leading-tight text-highlighted">{{ t.casca.comercial }}</h2>
        <UTooltip :text="t.secao.dica" :content="{ side: 'bottom', align: 'start' }">
          <p class="flex w-fit items-center gap-1 text-[11px] leading-tight text-muted" :class="marca" tabindex="0">
            <UIcon name="i-lucide-building" class="size-3" />{{ t.secao.subtitulo }}
          </p>
        </UTooltip>
      </div>
      <UTooltip :text="t.casca.recolherMenu">
        <UButton icon="i-lucide-chevrons-left" size="xs" color="neutral" variant="ghost" :aria-label="t.casca.recolherMenu" @click="emit('recolher')" />
      </UTooltip>
    </div>
    <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
      <ul class="space-y-px">
        <li v-for="tela in secaoComercial.telas" :key="tela.id">
          <button
            type="button"
            class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
            @click="maquete"
          >
            <UIcon :name="tela.icone" class="size-4 shrink-0 text-muted" />
            <span class="flex-1 truncate">{{ tela.rotulo }}</span>
          </button>
          <ul v-if="tela.filhos.length" class="ml-5 space-y-px border-l border-default pl-2">
            <li v-for="f in tela.filhos" :key="f.id">
              <button
                type="button"
                class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-default transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
                @click="maquete"
              >
                <UIcon :name="f.icone" class="size-4 shrink-0 text-muted" />
                <span class="flex-1 truncate">{{ f.rotulo }}</span>
              </button>
            </li>
          </ul>
        </li>
      </ul>

      <!-- proposta: atalho para categoria de projeto -->
      <div v-if="categorias.length" :class="marca">
        <p class="mt-4 px-2 pb-1 text-xs font-medium text-muted">{{ t.secao.categoriasDeProjeto }}</p>
        <ul class="space-y-px">
          <li v-for="c in categorias" :key="c.id">
            <button
              type="button"
              class="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
              :class="ativa === c.id ? 'bg-primary/10 font-medium text-highlighted' : 'text-default'"
              :aria-current="ativa === c.id ? 'page' : undefined"
              @click="prj.abrirCategoria(c.id)"
            >
              <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-4 shrink-0" :class="ativa === c.id ? 'text-primary' : 'text-muted'" />
              <span class="min-w-0 flex-1 truncate">{{ c.name }}</span>
              <UTooltip v-if="prj.projetoDa(c)" :text="prj.projetoDa(c)!.nome">
                <span class="flex size-5 shrink-0 items-center justify-center rounded" :class="COR_DO_PROJETO[prj.projetoDa(c)!.cor]">
                  <UIcon :name="prj.projetoDa(c)!.icone" class="size-3" :aria-label="prj.projetoDa(c)!.nome" />
                </span>
              </UTooltip>
              <UIcon v-if="prj.projetoDa(c) && prj.projetoDa(c)!.visibilidade !== 'aberto'" :name="ICONE_DA_VISIBILIDADE[prj.projetoDa(c)!.visibilidade]" class="size-3.5 shrink-0 text-muted" />
            </button>
          </li>
        </ul>
        <p class="mt-2 flex items-start gap-1.5 px-2 text-xs text-muted">
          <UIcon name="i-lucide-info" class="mt-px size-3.5 shrink-0" />{{ t.secao.seguemOProjeto }}
        </p>
      </div>
    </div>
  </div>
</template>
