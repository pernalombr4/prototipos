<script setup lang="ts">
import { useMenuDoWorkspace } from './estado'
import { notificacoes, type Notificacao } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O INBOX.
 *
 * Rodada 9: "teremos tambem outros menus nativos: inbox sera um deles. com
 * notificaçoes pra abrir".
 *
 * Como a tela de Módulos, esta não é maquete: o contador da barra e esta lista
 * leem o MESMO estado. Abrir uma notificação apaga o ponto e baixa o número lá
 * na esquerda, que é a parte que precisava ser vista funcionando. O conteúdo
 * das notificações é fictício, como o nome das categorias.
 *
 * O que é proposta aqui, e não maquete:
 *
 * 1. O Inbox é DESTINO, não sino no canto. Sino guarda a notificação num
 *    popover que some ao clicar fora; destino deixa a pessoa voltar, filtrar e
 *    terminar depois. É o que o Linear, o ClickUp e o Notion fazem.
 * 2. O contador só conta o não lido, e some no zero. Número que nunca zera
 *    vira decoração e para de ser lido.
 */
const props = defineProps<{ t: TextosDaTela }>()

const menu = useMenuDoWorkspace()

function quando(n: Notificacao) {
  if (n.quando.unidade === 'min') return props.t.haMinutos(n.quando.valor)
  if (n.quando.unidade === 'h') return props.t.haHoras(n.quando.valor)
  return props.t.haDias(n.quando.valor)
}
</script>

<template>
  <div class="animate-[entrada_0.25s_ease-out_both]">
    <div class="mb-4 flex flex-wrap items-center gap-3">
      <div class="min-w-0 flex-1">
        <h1 class="flex items-center gap-2 text-xl font-bold text-highlighted">
          {{ props.t.inbox }}
          <UBadge
            v-if="menu.naoLidas.value"
            :label="props.t.inboxNaoLidas(menu.naoLidas.value)"
            size="sm"
            color="warning"
            variant="subtle"
          />
        </h1>
        <p class="mt-0.5 max-w-2xl text-sm leading-relaxed text-muted">{{ props.t.inboxDescricao }}</p>
      </div>

      <UButton
        v-if="menu.naoLidas.value"
        :label="props.t.inboxMarcarTodas"
        icon="i-lucide-check-check"
        size="sm"
        color="neutral"
        variant="subtle"
        @click="menu.marcarTodasLidas()"
      />
    </div>

    <!--
      Tudo lido não é lista vazia: o que já foi lido continua aqui, porque
      "eu vi isso ontem, onde foi mesmo?" é metade do uso de um inbox. Então o
      aviso é uma linha, não um estado vazio ocupando a tela acima da lista.
    -->
    <p v-if="!menu.naoLidas.value" class="mb-3 flex items-center gap-2 text-sm text-muted">
      <UIcon name="i-lucide-check-check" class="size-4 shrink-0 text-success" />
      {{ props.t.inboxTudoLido }}
    </p>

    <ul class="max-w-3xl divide-y divide-default overflow-hidden rounded-xl border border-default">
      <li v-for="(n, i) in notificacoes" :key="n.id">
        <button
          type="button"
          class="flex w-full animate-[entrada_0.25s_ease-out_both] items-start gap-3 p-3 text-left transition-colors hover:bg-elevated"
          :class="menu.lida(n.id) ? '' : 'bg-primary/5'"
          :style="{ animationDelay: `${i * 30}ms` }"
          @click="menu.marcarLida(n.id)"
        >
          <!--
            O não lido é dito por PONTO mais fundo mais peso da fonte, nunca só
            por cor: a fricção S3-P2 do enspace-ux-research pegou o menu de hoje
            dizendo estado só com cor, e abaixo do mínimo AA.
          -->
          <span class="mt-1.5 flex size-2 shrink-0 items-center justify-center">
            <span
              v-if="!menu.lida(n.id)"
              class="size-2 rounded-full bg-primary"
              :aria-label="props.t.inboxNaoLida"
              role="img"
            />
          </span>

          <UIcon :name="n.icone" class="mt-0.5 size-4 shrink-0 text-toned" />

          <span class="min-w-0 flex-1">
            <span
              class="block truncate text-sm text-default"
              :class="menu.lida(n.id) ? '' : 'font-semibold text-highlighted'"
            >{{ n.texto }}</span>
            <span class="mt-0.5 block truncate text-xs text-muted">{{ n.onde }}</span>
          </span>

          <span class="shrink-0 whitespace-nowrap text-xs text-muted">{{ quando(n) }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>
