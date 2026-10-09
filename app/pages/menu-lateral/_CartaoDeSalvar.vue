<script setup lang="ts">
import { useMenuDoWorkspace } from './estado'
import type { TextosDaTela } from './textos'

/**
 * O CARTÃO FLUTUANTE DE SALVAR.
 *
 * Nasceu na rodada 12 dentro da barra única. Na rodada 14 virou peça própria
 * porque a trilha passou a arrastar e a ter botão direito, e o que se mexe lá
 * precisa do mesmo Salvar: uma regra de gravação só, nos dois modelos.
 *
 * Flutua sobre o fim da lista, em vez de empurrar a barra: enquanto a pessoa
 * arruma o menu, o que ela quer ver é o menu. "Salvar para todos" só aparece
 * para quem pode configurar; descartar fica em texto, porque é a saída.
 */
const props = defineProps<{
  t: TextosDaTela
  podeConfigurar: boolean
  /** Sem rodapé embaixo (o painel da trilha não tem): encosta no fim. */
  rente?: boolean
}>()

const menu = useMenuDoWorkspace()
const toast = useToast()

function salvarMenu(alcance: 'todos' | 'local') {
  menu.salvar(alcance)
  toast.add({
    title: alcance === 'todos' ? props.t.salvoParaTodos : props.t.salvoSoParaMim,
    icon: alcance === 'todos' ? 'i-lucide-users' : 'i-lucide-user',
    color: 'neutral',
  })
}
</script>

<template>
  <div v-if="menu.alterado.value" class="pointer-events-none absolute inset-x-2 z-30" :class="props.rente ? 'bottom-2' : 'bottom-14'">
    <div class="pointer-events-auto animate-[entrada_0.2s_ease-out_both] rounded-xl border border-default bg-default p-2.5 shadow-lg ring-1 ring-warning/30">
      <p class="mb-0.5 flex items-center gap-1.5 text-xs font-semibold text-highlighted">
        <span class="size-2 shrink-0 rounded-full bg-warning" />
        {{ props.t.naoSalvoTitulo }}
      </p>
      <p class="mb-2 text-xs leading-snug text-muted">{{ props.t.naoSalvoDica }}</p>

      <div class="space-y-1.5">
        <UButton
          v-if="props.podeConfigurar"
          :label="props.t.salvarTodos"
          icon="i-lucide-users"
          size="xs"
          color="primary"
          block
          @click="salvarMenu('todos')"
        />
        <!-- Quebra em vez de cortar: o painel da trilha tem 232 px (rodada 16). -->
        <div class="flex flex-wrap items-center gap-1.5">
          <UButton
            :label="props.t.salvarLocal"
            icon="i-lucide-user"
            size="xs"
            color="neutral"
            :variant="props.podeConfigurar ? 'subtle' : 'solid'"
            class="flex-1 justify-center"
            @click="salvarMenu('local')"
          />
          <UButton
            :label="props.t.descartar"
            size="xs"
            color="neutral"
            variant="ghost"
            @click="menu.descartar()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
