<script setup lang="ts">
/**
 * PROPOSTA, só a interface. Assinar as releases por e-mail (3 opções) ou por feed RSS (2 feeds).
 *
 * Maquete: "Inscrever" confere o e-mail, mostra o carregamento e o estado de sucesso, e não envia
 * nada. Os endereços de feed são os propostos; "Copiar endereço" copia para a área de transferência.
 */
import type { Textos } from './textos'

const props = defineProps<{ t: Textos }>()
const aberto = defineModel<boolean>('open', { default: false })

const idioma = useIdioma()
const toast = useToast()

const email = ref('')
const opcoes = ref<string[]>(['mensal', 'acao'])
const tentou = ref(false)
const enviando = ref(false)
const inscrito = ref(false)

const emailValido = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim()))
const erroEmail = computed(() => (tentou.value && !emailValido.value ? props.t.assinar.emailInvalido : undefined))
const erroOpcoes = computed(() => (tentou.value && !opcoes.value.length ? props.t.assinar.escolhaUm : undefined))

const itens = computed(() => [
  { value: 'mensal', label: props.t.assinar.opcoes.mensal },
  { value: 'semanal', label: props.t.assinar.opcoes.semanal },
  { value: 'acao', label: props.t.assinar.opcoes.acao },
])

const prefixo = computed(() => (idioma.value === 'pt-BR' ? 'pt' : idioma.value))
const feeds = computed(() => [
  { nome: props.t.assinar.feedChangelog, url: `https://docs.enspace.io/${prefixo.value}/releases/docs/rss.xml`, icone: 'i-lucide-rss' },
  { nome: props.t.assinar.feedAcao, url: `https://docs.enspace.io/${prefixo.value}/releases/docs/exige-acao/rss.xml`, icone: 'i-lucide-triangle-alert' },
])

function inscrever() {
  tentou.value = true
  if (!emailValido.value || !opcoes.value.length) return
  enviando.value = true
  setTimeout(() => {
    enviando.value = false
    inscrito.value = true
  }, 900)
}

async function copiar(url: string) {
  try { await navigator.clipboard.writeText(url) }
  catch { /* sem permissão de área de transferência: o toast ainda mostra o endereço */ }
  toast.add({ title: props.t.assinar.copiado, description: url, icon: 'i-lucide-check', color: 'success', duration: 2500 })
}

watch(aberto, (v) => {
  if (v) return
  setTimeout(() => {
    tentou.value = false
    inscrito.value = false
    email.value = ''
  }, 300)
})
</script>

<template>
  <UModal v-model:open="aberto" :title="t.assinar.titulo" :description="t.assinar.descricao" :ui="{ content: 'max-w-lg' }">
    <template #body>
      <div class="flex flex-col gap-6">
        <!-- Por e-mail -->
        <section class="flex flex-col gap-3">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon name="i-lucide-mail" class="text-primary" />{{ t.assinar.porEmail }}
          </h3>

          <div v-if="inscrito" class="flex animate-[entrada_.3s_ease-out_both] items-start gap-3 rounded-lg bg-success/10 p-4" role="status">
            <UIcon name="i-lucide-mail-check" class="mt-0.5 size-5 shrink-0 text-success" />
            <div>
              <p class="font-semibold text-highlighted">
                {{ t.assinar.inscritoTitulo }}
              </p>
              <p class="text-sm text-muted">
                {{ t.assinar.inscritoTexto(email.trim()) }}
              </p>
            </div>
          </div>

          <form v-else class="flex flex-col gap-3" novalidate @submit.prevent="inscrever">
            <UFormField :label="t.assinar.email" :error="erroEmail" required>
              <UInput v-model="email" type="email" autocomplete="email" :placeholder="t.assinar.emailPlaceholder" icon="i-lucide-at-sign" class="w-full" />
            </UFormField>
            <UFormField :label="t.assinar.oQueReceber" :error="erroOpcoes">
              <UCheckboxGroup v-model="opcoes" :items="itens" />
            </UFormField>
            <div class="flex justify-end">
              <UButton type="submit" :loading="enviando" icon="i-lucide-send" :label="t.assinar.inscrever" class="cursor-pointer" />
            </div>
          </form>
        </section>

        <USeparator />

        <!-- Por feed RSS -->
        <section class="flex flex-col gap-3">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon name="i-lucide-rss" class="text-primary" />{{ t.assinar.porFeed }}
          </h3>
          <div v-for="f in feeds" :key="f.url" class="flex items-center gap-3 rounded-lg border border-default p-3">
            <UIcon :name="f.icone" class="size-4 shrink-0 text-muted" />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-highlighted">
                {{ f.nome }}
              </p>
              <p class="truncate font-mono text-xs text-dimmed">
                {{ f.url }}
              </p>
            </div>
            <UTooltip :text="t.assinar.copiar">
              <UButton icon="i-lucide-copy" color="neutral" variant="ghost" size="sm" :aria-label="t.assinar.copiar" class="cursor-pointer" @click="copiar(f.url)" />
            </UTooltip>
          </div>
        </section>
      </div>
    </template>
  </UModal>
</template>
