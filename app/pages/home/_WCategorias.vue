<script setup lang="ts">
/**
 * Widget "Categorias": o atalho para as categorias do workspace.
 *
 * A Home de develop já tem cartões de categoria (`WorkspaceCategories.vue`,
 * 4 por vez, botão "Acessar", ligados por `show_types_on_initial_screen`). O
 * widget continua o mesmo atalho e soma:
 * - "Criar <singular>" em cada cartão, pelo `singular_name` da categoria.
 *   Com 2 ou mais formulários, o botão pergunta qual; com 1 ou nenhum, abre
 *   o modal direto. É a mesma regra do botão Criar do topo.
 *
 * Rodada 5, a pedido da redatora ("todos os cards ali dentro deveriam ter o
 * mesmo tamanho. O user deveria poder definir a ordem"):
 * - grade de colunas iguais e cartão de altura fixa, com o nome truncado;
 * - a ordem é a da escolha do widget (catálogo ou Configurar), que já chega
 *   ordenada em `categorias`;
 * - workspace sem categoria: o administrador vê "Criar categoria"; o membro,
 *   o aviso de que o administrador ainda não criou.
 *
 * Rodada 7: o cartão mostra o nome, a descrição da categoria (`description`,
 * a mesma que o cartão de develop mostra) e o botão de criar. Sai a contagem
 * "em aberto": o ENSPACE não tem esse conceito para item.
 *
 * Rodada 9: ícone de 56 px e o texto dentro da altura dele (detalhe no
 * comentário do cartão).
 *
 * O cartão inteiro é "Acessar"; o "+" é um botão à parte, ao lado, e não
 * dentro do cartão (dois controles irmãos, sem clique dentro de clique).
 *
 * Componentes: `UButton`, `UDropdownMenu`, `UTooltip`, `UIcon`
 * (MCP nuxt-ui).
 */
import type { DropdownMenuItem } from '@nuxt/ui'
import type { Categoria } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** As categorias do widget, já na ordem escolhida. */
  categorias: Categoria[]
  admin: boolean
}>()
const emit = defineEmits<{
  acessar: [categoria: Categoria]
  criar: [categoria: string, formulario?: string]
  criarCategoria: []
}>()

/** Cor do ícone pela cor da categoria, só com as cores semânticas do tema. */
const COR: Record<string, string> = {
  primary: 'bg-primary/10 text-primary ring-primary/25',
  info: 'bg-info/10 text-info ring-info/25',
  success: 'bg-success/10 text-success ring-success/25',
  warning: 'bg-warning/10 text-warning ring-warning/25',
  error: 'bg-error/10 text-error ring-error/25',
  neutral: 'bg-elevated text-toned ring-default',
}

function formularios(c: Categoria): DropdownMenuItem[][] {
  return [
    [{ label: props.t.categoriasW.escolhaFormulario, type: 'label' }],
    c.formularios.map(f => ({ label: f.nome, icon: 'i-lucide-clipboard-pen', onSelect: () => emit('criar', c.slug, f.id) })),
  ]
}
</script>

<template>
  <div class="h-full overflow-y-auto px-4 pb-4 pt-1">
    <!-- Vazio em linha: o widget tem 3 linhas de altura, e o UEmpty empilhado pedia rolagem. -->
    <div v-if="!categorias.length" class="flex h-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:text-left">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-elevated ring ring-inset ring-default">
        <UIcon name="i-lucide-layout-grid" class="size-4 text-muted" />
      </span>
      <span class="min-w-0">
        <span class="block text-sm font-medium text-highlighted">{{ t.vazios.categoriasTitulo }}</span>
        <span class="block text-xs text-muted">{{ admin ? t.vazios.categoriasAdmin : t.vazios.categoriasMembro }}</span>
      </span>
      <UButton v-if="admin" :label="t.vazios.criarCategoria" icon="i-lucide-plus" color="neutral" variant="outline" size="sm" @click="emit('criarCategoria')" />
    </div>
    <ul v-else class="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-3">
      <li
        v-for="(c, i) in categorias"
        :key="c.slug"
        class="flex h-20 min-w-0 animate-[entrada_0.3s_ease-out_both] items-center gap-2 rounded-lg border border-default bg-default pl-1.5 pr-3 transition-colors duration-150 hover:border-accented hover:bg-elevated/40 motion-reduce:animate-none"
        :style="{ animationDelay: `${i * 40}ms` }"
      >
        <!--
          Rodada 9, a pedido da redatora: o título não passa do topo do ícone e a
          descrição não desce além da base dele. Ícone de 56 px (size-14); o texto
          ocupa no máximo os mesmos 56 px: título 20 px + 4 px + 2 linhas de 16 px.
          Com 1 linha de descrição, o bloco centraliza na altura do ícone.
        -->
        <button
          type="button"
          class="flex h-full min-w-0 flex-1 items-center gap-3 rounded-md px-2.5 py-3 text-left focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="t.categoriasW.acessar(c.name)"
          :title="c.description ? `${c.name}: ${c.description}` : c.name"
          @click="emit('acessar', c)"
        >
          <span class="flex size-14 shrink-0 items-center justify-center rounded-xl ring ring-inset" :class="COR[c.color ?? 'neutral'] ?? COR.neutral">
            <UIcon :name="c.icon ?? 'i-lucide-folder'" class="size-6" />
          </span>
          <span class="flex max-h-14 min-w-0 flex-col justify-center">
            <span class="block truncate text-sm font-medium leading-5 text-highlighted">{{ c.name }}</span>
            <span v-if="c.description" class="mt-1 line-clamp-2 text-xs leading-4 text-muted">{{ c.description }}</span>
          </span>
        </button>

        <UDropdownMenu v-if="c.formularios.length > 1" :items="formularios(c)" :content="{ align: 'end' }">
          <UTooltip :text="t.criar.criarNa(c.singular, c.name)">
            <UButton icon="i-lucide-plus" color="neutral" variant="outline" size="sm" square :aria-label="t.criar.criarNa(c.singular, c.name)" />
          </UTooltip>
        </UDropdownMenu>
        <UTooltip v-else :text="t.criar.criarNa(c.singular, c.name)">
          <UButton
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            size="sm"
            square
            :aria-label="t.criar.criarNa(c.singular, c.name)"
            @click="emit('criar', c.slug, c.formularios[0]?.id)"
          />
        </UTooltip>
      </li>
    </ul>
  </div>
</template>
