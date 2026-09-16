<template>
  <!-- EnApp é o provider raiz do enspace-sdk-ui: abraça o UApp do Nuxt UI por
       dentro e provê locale e mensagens para os componentes En*. -->
  <EnApp locale="pt-BR">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </EnApp>
</template>
