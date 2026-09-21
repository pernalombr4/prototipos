<script setup lang="ts">
/**
 * Andaime de protótipo, não é produto.
 *
 * Tema e idioma, lado a lado, na barra de andaime de toda tela. Existem para
 * o dev conferir a referência nos dois temas e nos três idiomas antes de
 * implementar: é onde aparece o contraste que não passa no escuro e o texto
 * que estoura o botão em espanhol.
 *
 * O ENSPACE tem os dois controles na própria barra superior. Aqui eles ficam
 * no andaime de propósito, para não se confundirem com a proposta da tela.
 */
const tema = useColorMode()
const idioma = useIdioma()

/**
 * O tema vive em duas variáveis no color-mode: `value` é o tema em uso e
 * `preference` é a escolha guardada. Ler de uma e escrever na outra é o que
 * faz a chave continuar certa depois de recarregar a página.
 */
const escuro = computed({
  get: () => tema.value === 'dark',
  set: (v) => { tema.preference = v ? 'dark' : 'light' },
})
</script>

<template>
  <span class="flex flex-wrap items-center gap-2">
    <span class="text-xs font-semibold uppercase tracking-wider text-toned">
      Tema
    </span>
    <!--
      ClientOnly porque o tema só é conhecido no navegador: renderizar a chave
      no servidor a mostraria sempre desligada e ela pularia ao hidratar.
    -->
    <ClientOnly>
      <USwitch
        v-model="escuro"
        unchecked-icon="i-lucide-sun"
        checked-icon="i-lucide-moon"
        :label="escuro ? 'Escuro' : 'Claro'"
        :aria-label="`Tema escuro: ${escuro ? 'ligado' : 'desligado'}`"
        :ui="{ label: 'text-xs' }"
      />
      <!--
        O espelho invisível do controle: guarda o lugar antes da hidratação
        sem afirmar um tema. Mostrar "Claro" aqui faria a chave piscar errada
        toda vez que uma tela em escuro abrisse.
      -->
      <template #fallback>
        <USwitch
          :model-value="true"
          unchecked-icon="i-lucide-sun"
          checked-icon="i-lucide-moon"
          label="Escuro"
          aria-hidden="true"
          tabindex="-1"
          class="invisible"
          :ui="{ label: 'text-xs' }"
        />
      </template>
    </ClientOnly>

    <span class="ml-1 text-xs font-semibold uppercase tracking-wider text-toned">
      Idioma
    </span>
    <div class="flex rounded-md border border-default p-0.5">
      <UButton
        v-for="i in idiomas"
        :key="i.id"
        :label="i.rotulo"
        :title="i.nome"
        size="xs"
        :color="idioma === i.id ? 'primary' : 'neutral'"
        :variant="idioma === i.id ? 'soft' : 'ghost'"
        @click="idioma = i.id"
      />
    </div>
  </span>
</template>
