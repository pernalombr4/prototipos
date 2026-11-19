<script setup lang="ts">
/**
 * Novo envelope.
 *
 * Cópia da prévia: Título, Descrição, Expira em, Documento e Participantes com ordem, nome, e-mail e papel. PROPOSTA:
 * - B5: 1 campo de credencial, agrupado por provedor, no lugar de Provedor e Credencial. Só aparecem as credenciais
 *   prontas (a D4Sign sem cofre fica de fora);
 * - M14: o Documento diz o limite e os formatos do provedor escolhido e recusa o arquivo na hora, com o motivo. Hoje o
 *   texto é "PDF ou DOCX até 25 MB" para todo provedor, e a Adobe recusa acima de 10 MB só depois do envio;
 * - "Enviar para assinatura" direto, ao lado de "Salvar rascunho". Hoje é preciso salvar, abrir o rascunho e enviar;
 * - M16: sem provedor conectado, o envelope pode ser criado e fica como rascunho. O campo da credencial avisa, com o atalho
 *   para conectar (hoje o formulário também avisa: "Nenhuma credencial configurada para <provedor>"). "Salvar rascunho"
 *   vira a ação principal, e "Enviar para assinatura" só aparece com um provedor conectado;
 * - "Expira em" leva a hora e não aceita data passada (C42 ficou fora do escopo; o mínimo vem junto por ser o mesmo campo).
 */
import type { Papel } from './mocks'
import { HOJE, provedores, provedorPorId } from './mocks'
import { credenciaisVisiveis, credencialPronta, criarEnvelope } from './estado'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** Andaime: abre com a credencial e o arquivo de um exemplo, para mostrar a recusa (M14). */
  exemplo?: { credencial: number, arquivo: { nome: string, tamanhoMb: number } } | null
}>()
const aberto = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ criado: [number], conectar: [] }>()
const toast = useToast()
const n = computed(() => props.t.novo)

const titulo = ref('')
const descricao = ref('')
const credencial = ref<number | undefined>()
const expira = ref('')
const arquivo = ref<{ nome: string, tamanhoMb: number } | null>(null)
interface Linha { ordem: number, nome: string, email: string, papel: Papel }
const participantes = ref<Linha[]>([])
const tentou = ref<false | 'rascunho' | 'enviar'>(false)
const salvando = ref<'rascunho' | 'enviar' | null>(null)

function limpar() {
  titulo.value = props.exemplo ? 'Aditivo de prazo obra Vila Verde' : ''
  descricao.value = ''
  credencial.value = props.exemplo?.credencial
  expira.value = ''
  arquivo.value = props.exemplo?.arquivo ?? null
  participantes.value = [{ ordem: 1, nome: props.exemplo ? 'Otávio Lins' : '', email: props.exemplo ? 'otavio.lins@ipe.example' : '', papel: 'signer' }]
  tentou.value = false
}
watch(aberto, (v) => { if (v) limpar() })

const itensCredencial = computed(() => provedores
  .map(p => ({ p, creds: credenciaisVisiveis.value.filter(c => c.provedor === p.id && credencialPronta(c)) }))
  .filter(g => g.creds.length)
  .map(g => [{ type: 'label' as const, label: g.p.nome }, ...g.creds.map(c => ({ label: `${c.nome} · ${props.t.ambientes[c.ambiente]}`, value: c.id }))]))

const semProvedor = computed(() => itensCredencial.value.length === 0)

const provedor = computed(() => {
  const c = credenciaisVisiveis.value.find(x => x.id === credencial.value)
  return c ? provedorPorId.get(c.provedor)! : null
})
const formatos = computed(() => provedor.value?.formatos.join(', ') ?? '')

const erroDoArquivo = computed(() => {
  if (!arquivo.value || !provedor.value) return ''
  const ext = arquivo.value.nome.split('.').pop()?.toLowerCase() ?? ''
  if (!provedor.value.formatos.map(f => f.toLowerCase()).includes(ext)) return n.value.erroFormato(ext, provedor.value.nome, provedor.value.formatos.join(', '))
  if (arquivo.value.tamanhoMb > provedor.value.limiteMb) return n.value.erroTamanho(arquivo.value.tamanhoMb, provedor.value.nome, provedor.value.limiteMb)
  return ''
})

const input = ref<HTMLInputElement | null>(null)
function escolher(ev: Event) {
  const f = (ev.target as HTMLInputElement).files?.[0]
  if (f) arquivo.value = { nome: f.name, tamanhoMb: Math.round((f.size / 1048576) * 10) / 10 }
}
function soltar(ev: DragEvent) {
  const f = ev.dataTransfer?.files?.[0]
  if (f) arquivo.value = { nome: f.name, tamanhoMb: Math.round((f.size / 1048576) * 10) / 10 }
}

const itensPapel = computed(() => (['signer', 'approver', 'witness', 'viewer'] as const).map(p => ({ value: p, label: props.t.papeis[p] })))
const minimo = HOJE.slice(0, 16)

async function salvar(enviarAgora: boolean) {
  tentou.value = enviarAgora ? 'enviar' : 'rascunho'
  // A credencial só é obrigatória para enviar: o rascunho pode esperar o provedor.
  const ok = titulo.value.trim() && (credencial.value || !enviarAgora) && arquivo.value && !erroDoArquivo.value && participantes.value.some(p => p.nome.trim() && p.email.trim())
  if (!ok) return toast.add({ title: enviarAgora ? n.value.obrigatorio : n.value.obrigatorioRascunho, icon: 'i-lucide-circle-alert', color: 'warning' })
  salvando.value = enviarAgora ? 'enviar' : 'rascunho'
  await new Promise(r => setTimeout(r, 800))
  salvando.value = null
  const id = criarEnvelope({
    title: titulo.value.trim(), description: descricao.value.trim() || undefined, credential: credencial.value, documento: arquivo.value!,
    participantes: participantes.value.filter(p => p.nome.trim() && p.email.trim()), expires_at: expira.value ? `${expira.value}:00-03:00` : undefined,
  }, enviarAgora)
  aberto.value = false
  toast.add({ title: enviarAgora ? n.value.enviado : n.value.rascunho, icon: enviarAgora ? 'i-lucide-send' : 'i-lucide-save', color: 'success' })
  emit('criado', id)
}
</script>

<template>
  <UModal v-model:open="aberto" :title="n.titulo" :description="n.descricao" :ui="{ content: 'max-w-3xl' }">
    <template #body>
      <div class="space-y-5">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField :label="n.campoTitulo" required :error="tentou && !titulo.trim() ? true : undefined" class="sm:col-span-2">
            <UInput v-model="titulo" class="w-full" />
          </UFormField>
          <UFormField :label="n.campoDescricao" class="sm:col-span-2">
            <UTextarea v-model="descricao" :rows="2" autoresize class="w-full" />
          </UFormField>
          <UFormField :label="n.credencial" :help="semProvedor ? undefined : n.credencialAjuda" :required="!semProvedor" :error="tentou === 'enviar' && !credencial ? true : undefined">
            <USelect v-model="credencial" :items="itensCredencial" value-key="value" :placeholder="semProvedor ? n.credencialPhVazio : n.credencialPh" :disabled="semProvedor" class="w-full" />
          </UFormField>
          <UFormField :label="n.expira" :help="n.expiraAjuda">
            <UInput v-model="expira" type="datetime-local" :min="minimo" class="w-full" />
          </UFormField>
          <!-- M16: sem provedor, o rascunho continua possível -->
          <UAlert
            v-if="semProvedor"
            color="warning"
            variant="subtle"
            icon="i-lucide-plug-zap"
            :title="n.semProvedor.titulo"
            :description="n.semProvedor.texto"
            class="animate-[entrada_.3s_ease-out_both] sm:col-span-2"
            :actions="[{ label: n.semProvedor.botao, icon: 'i-lucide-plug', color: 'warning', variant: 'outline', onClick: () => { aberto = false; emit('conectar') } }]"
          />
        </div>

        <!-- M14: o limite do provedor escolhido e a recusa na hora -->
        <UFormField :label="n.documento" required :error="erroDoArquivo || (tentou && !arquivo ? true : undefined)">
          <template #hint>
            <span class="text-xs">{{ provedor ? n.limite(provedor.nome, provedor.limiteMb, formatos) : '' }}</span>
          </template>
          <div
            v-if="!arquivo"
            role="button"
            tabindex="0"
            class="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-accented px-4 py-6 text-center transition-colors hover:border-primary hover:bg-primary/5"
            @click="input?.click()"
            @keydown.enter="input?.click()"
            @dragover.prevent
            @drop.prevent="soltar"
          >
            <UIcon name="i-lucide-upload" class="size-5 text-muted" />
            <span class="text-sm text-toned">{{ n.soltar }}</span>
            <span class="text-xs text-muted">{{ provedor ? n.limite(provedor.nome, provedor.limiteMb, formatos) : semProvedor ? n.limiteGeral : n.limiteSemProvedor }}</span>
          </div>
          <div v-else class="flex items-center gap-3 rounded-lg border px-3 py-2.5" :class="erroDoArquivo ? 'border-error bg-error/5' : 'border-default'">
            <UIcon :name="erroDoArquivo ? 'i-lucide-file-x' : 'i-lucide-file-text'" class="size-5 shrink-0" :class="erroDoArquivo ? 'text-error' : 'text-muted'" />
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-medium text-highlighted">{{ arquivo.nome }}</span>
              <span class="text-xs tabular-nums text-muted">{{ arquivo.tamanhoMb }} MB</span>
            </span>
            <UButton :label="n.trocar" icon="i-lucide-replace" color="neutral" variant="outline" size="xs" @click="input?.click()" />
          </div>
          <input ref="input" type="file" class="hidden" accept=".pdf,.docx" @change="escolher">
        </UFormField>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-highlighted">{{ n.participantes }}</p>
            <UButton :label="n.adicionar" icon="i-lucide-plus" color="neutral" variant="ghost" size="xs" @click="participantes.push({ ordem: participantes.length + 1, nome: '', email: '', papel: 'signer' })" />
          </div>
          <TransitionGroup tag="div" class="space-y-2" enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
            <div v-for="(pa, i) in participantes" :key="i" class="grid grid-cols-[4.5rem_1fr_1fr_9rem_auto] items-center gap-2">
              <UInputNumber v-model="pa.ordem" :min="1" size="sm" :aria-label="n.ordem" />
              <UInput v-model="pa.nome" :placeholder="n.nome" size="sm" :aria-label="n.nome" />
              <UInput v-model="pa.email" type="email" :placeholder="n.email" size="sm" :aria-label="n.email" />
              <USelect v-model="pa.papel" :items="itensPapel" value-key="value" size="sm" :aria-label="n.papel" />
              <UButton icon="i-lucide-trash-2" color="neutral" variant="ghost" size="sm" :aria-label="n.remover" :disabled="participantes.length === 1" @click="participantes.splice(i, 1)" />
            </div>
          </TransitionGroup>
          <p class="text-xs text-muted">{{ n.ordemAjuda }}</p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-wrap justify-end gap-2">
        <UButton :label="t.geral.cancelar" color="neutral" variant="ghost" @click="aberto = false" />
        <!-- M16: sem provedor, Salvar rascunho é a ação principal; enviar volta depois da conexão -->
        <UButton :label="n.salvarRascunho" icon="i-lucide-save" :color="semProvedor ? 'primary' : 'neutral'" :variant="semProvedor ? 'solid' : 'outline'" :loading="salvando === 'rascunho'" @click="salvar(false)" />
        <UButton v-if="!semProvedor" :label="n.enviar" icon="i-lucide-send" :loading="salvando === 'enviar'" @click="salvar(true)" />
      </div>
    </template>
  </UModal>
</template>
