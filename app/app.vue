<script setup lang="ts">
// O idioma do andaime manda no locale do EnApp: trocar o idioma na barra
// troca também os textos que vêm do enspace-sdk-ui e do Nuxt UI.
const idioma = useIdioma()
</script>

<template>
  <!-- EnApp é o provider raiz do enspace-sdk-ui: abraça o UApp do Nuxt UI por
       dentro e provê locale e mensagens para os componentes En*. -->
  <EnApp :locale="idioma">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </EnApp>
</template>
