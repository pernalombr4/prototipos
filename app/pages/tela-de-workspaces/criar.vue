<script setup lang="ts">
import { workspaces } from './mocks'

definePageMeta({
  titulo: 'Tela de entrada (Workspaces)',
  tela: 'Criar — com a pergunta que intercepta',
})

const toast = useToast()

/** A tela de criação começa perguntando a intenção, não pedindo o nome. */
type Passo = 'intencao' | 'formulario' | 'desviado'
const passo = ref<Passo>('intencao')

const form = reactive({ nome: '', referencia: '', descricao: '', icone: 'i-lucide-building-2' })

/** A referência se preenche sozinha a partir do nome, como no produto hoje. */
const referenciaAuto = computed(() =>
  form.nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-'))

watch(() => form.nome, () => { form.referencia = referenciaAuto.value })

const icones = [
  'i-lucide-building-2', 'i-lucide-users', 'i-lucide-truck',
  'i-lucide-scale', 'i-lucide-calculator', 'i-lucide-database',
]

/** Parece um chamado, não um nome de empresa/equipe? Avisa antes de deixar criar. */
const pareceChamado = computed(() => {
  const n = form.nome.toLowerCase()
  const pistas = [
    'preciso', 'solicito', 'solicitação', 'solicitacao', 'chamado', 'pedido',
    'favor', 'urgente', 'não consigo', 'nao consigo', 'erro', 'problema',
    'acesso', 'ajuda', 'reembolso', 'férias', 'ferias', 'atestado',
  ]
  return n.length > 12 && pistas.some(p => n.includes(p))
})

const nomeJaExiste = computed(() =>
  workspaces.some(w => w.referencia === form.referencia && form.referencia.length > 2))

const podeCriar = computed(() =>
  form.nome.trim().length >= 3 && !nomeJaExiste.value)

function criar() {
  toast.add({
    title: `Workspace "${form.nome}" criado`,
    description: 'No produto, a pessoa entraria agora num espaço vazio, só com ela dentro.',
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <div class="min-h-screen bg-default pb-20">
    <UContainer class="max-w-2xl py-10 sm:py-14">
      <UButton
        to="/tela-de-workspaces"
        label="Voltar para a escolha de workspace"
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="link"
        class="mb-6 -ml-2"
      />

      <!-- Passo 1 — a pergunta que o produto não faz hoje ---------------- -->
      <template v-if="passo === 'intencao'">
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">
          O que você quer fazer?
        </h1>
        <p class="mt-2 text-muted">
          Criar um workspace é uma coisa rara — quase ninguém precisa. Vamos confirmar antes.
        </p>

        <div class="mt-8 space-y-3">
          <button
            type="button"
            class="w-full rounded-lg border border-default p-5 text-left transition-colors hover:border-primary hover:bg-elevated/50"
            @click="passo = 'desviado'"
          >
            <div class="flex items-start gap-4">
              <UIcon name="i-lucide-life-buoy" class="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <span class="block font-medium text-highlighted">
                  Abrir um chamado, pedir algo ou enviar um documento
                </span>
                <span class="mt-1 block text-sm text-muted">
                  Para o RH, o jurídico, o TI ou qualquer área da minha empresa.
                </span>
              </div>
            </div>
          </button>

          <button
            type="button"
            class="w-full rounded-lg border border-default p-5 text-left transition-colors hover:border-primary hover:bg-elevated/50"
            @click="passo = 'formulario'"
          >
            <div class="flex items-start gap-4">
              <UIcon name="i-lucide-layout-grid" class="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <span class="block font-medium text-highlighted">
                  Criar um espaço novo, vazio, para a minha equipe
                </span>
                <span class="mt-1 block text-sm text-muted">
                  Com membros, processos e configuração próprios, separado dos outros.
                </span>
              </div>
            </div>
          </button>
        </div>
      </template>

      <!-- Passo 1b — quem errou o caminho é devolvido, não bloqueado ------ -->
      <template v-else-if="passo === 'desviado'">
        <UAlert
          icon="i-lucide-map-pin"
          color="secondary"
          variant="subtle"
          title="Então o caminho é outro — e é mais curto"
          description="Chamados, pedidos e documentos acontecem dentro do workspace da sua empresa. Entre nele e procure por Chamados no menu lateral."
        />
        <div class="mt-6 flex flex-wrap gap-3">
          <UButton
            to="/tela-de-workspaces"
            label="Escolher meu workspace"
            icon="i-lucide-log-in"
          />
          <UButton
            label="Não é isso, quero mesmo criar um espaço"
            color="neutral"
            variant="ghost"
            @click="passo = 'formulario'"
          />
        </div>
      </template>

      <!-- Passo 2 — o formulário, com a consequência escrita -------------- -->
      <template v-else>
        <h1 class="text-2xl font-bold tracking-tight text-highlighted">
          Criar um workspace
        </h1>
        <p class="mt-2 text-muted">
          Ele nasce vazio e só com você dentro. Depois você convida as pessoas.
        </p>

        <div class="mt-8 space-y-6">
          <UFormField
            label="Nome do espaço"
            description="Como a equipe vai reconhecer esse espaço na lista. Ex.: Jurídico Aurora, Vértice Log."
            required
          >
            <UInput v-model="form.nome" placeholder="Nome da empresa, área ou equipe" class="w-full" />
          </UFormField>

          <UAlert
            v-if="pareceChamado"
            icon="i-lucide-triangle-alert"
            color="warning"
            variant="subtle"
            title="Isso parece o assunto de um chamado, não o nome de um espaço"
            description="Se a intenção é pedir alguma coisa, o caminho é entrar no workspace da sua empresa."
            :actions="[{ label: 'Me leva pra lá', color: 'warning', variant: 'solid', onClick: () => (passo = 'desviado') }]"
          />

          <UFormField
            label="Referência"
            description="Identificador usado na URL. Preenchido a partir do nome — dá para mudar."
            :error="nomeJaExiste ? 'Já existe um workspace com essa referência.' : undefined"
          >
            <UInput v-model="form.referencia" class="w-full font-mono text-sm" />
          </UFormField>

          <UFormField
            label="Descrição"
            description="Uma frase dizendo para que serve. É o que aparece embaixo do nome na tela de entrada — sem ela, o card fica mudo."
          >
            <UInput v-model="form.descricao" placeholder="Ex.: Chamados, RH e jurídico do Grupo Aurora" class="w-full" />
          </UFormField>

          <UFormField label="Ícone">
            <div class="flex flex-wrap gap-2">
              <UButton
                v-for="ic in icones"
                :key="ic"
                :icon="ic"
                square
                :color="form.icone === ic ? 'primary' : 'neutral'"
                :variant="form.icone === ic ? 'solid' : 'subtle'"
                @click="form.icone = ic"
              />
            </div>
          </UFormField>

          <!-- Prévia: a pessoa vê o que vai aparecer na tela de entrada -->
          <div>
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-dimmed">
              Como vai aparecer na sua lista
            </p>
            <div class="flex items-center gap-4 rounded-lg border border-default px-4 py-3">
              <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated">
                <UIcon :name="form.icone" class="size-4.5 text-muted" />
              </div>
              <div class="min-w-0">
                <p class="truncate font-medium text-highlighted">
                  {{ form.nome || 'Nome do workspace' }}
                </p>
                <p class="truncate text-sm text-muted">
                  {{ form.descricao || 'Sem descrição' }} · Você ainda não entrou aqui
                </p>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <UButton
              label="Criar workspace"
              icon="i-lucide-check"
              :disabled="!podeCriar"
              @click="criar"
            />
            <UButton
              to="/tela-de-workspaces"
              label="Cancelar"
              color="neutral"
              variant="ghost"
            />
          </div>
        </div>
      </template>
    </UContainer>
  </div>
</template>
