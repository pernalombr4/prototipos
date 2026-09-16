<script setup lang="ts">
import {
  workspaces,
  workspaceUnico,
  usuario,
  exemplosDoQueSeFazDentro,
  tempoRelativo,
  corDoPapel,
  type Workspace,
} from './mocks'

definePageMeta({
  titulo: 'Tela de entrada (Workspaces)',
  descricao: 'Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado.',
  status: 'em-revisao',
  atualizado: '2026-09-16',
  tela: 'Proposta',
})

const toast = useToast()

/* ------------------------------------------------------------------
   Andaime de protótipo: o seletor de estados abaixo NÃO é parte da
   proposta de produto. Existe para revisar os cinco estados sem
   precisar de back-end. Está declarado no DECISOES.md.
------------------------------------------------------------------ */
type Estado = 'normal' | 'unico' | 'carregando' | 'vazio' | 'erro'
const estado = ref<Estado>('normal')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Vários workspaces' },
  { valor: 'unico', rotulo: 'Só um (caso do chamado)' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Nenhum' },
  { valor: 'erro', rotulo: 'Erro' },
]

const base = computed<Workspace[]>(() => {
  if (estado.value === 'unico') return workspaceUnico
  if (estado.value === 'vazio') return []
  return workspaces
})

/* ---------------------------- estado local ---------------------------- */
const busca = ref('')
const aba = ref('todos')
const convitesRecusados = ref<string[]>([])
const convitesAceitos = ref<string[]>([])

const visiveis = computed(() => base.value.filter(w => !convitesRecusados.value.includes(w.id)))

const pendentes = computed(() =>
  visiveis.value.filter(w => w.convitePendente && !convitesAceitos.value.includes(w.id)))

const disponiveis = computed(() =>
  visiveis.value.filter(w => !w.convitePendente || convitesAceitos.value.includes(w.id)))

/** O que a pessoa usou por último — o atalho que resolve 90% das entradas. */
const ultimo = computed(() =>
  [...disponiveis.value]
    .filter(w => w.ultimoAcessoMin !== null)
    .sort((a, b) => (a.ultimoAcessoMin ?? 0) - (b.ultimoAcessoMin ?? 0))[0])

const listados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  let lista = disponiveis.value.filter(w => w.id !== ultimo.value?.id)

  if (aba.value === 'favoritos') lista = lista.filter(w => w.favorito)
  if (aba.value === 'recentes') lista = lista.filter(w => w.ultimoAcessoMin !== null)
  if (termo) {
    lista = lista.filter(w =>
      w.nome.toLowerCase().includes(termo) || w.referencia.includes(termo))
  }
  return lista.sort((a, b) => (a.ultimoAcessoMin ?? 9e9) - (b.ultimoAcessoMin ?? 9e9))
})

const abas = computed(() => [
  { label: `Todos (${disponiveis.value.length})`, value: 'todos' },
  { label: `Favoritos (${disponiveis.value.filter(w => w.favorito).length})`, value: 'favoritos' },
  { label: `Recentes (${disponiveis.value.filter(w => w.ultimoAcessoMin !== null).length})`, value: 'recentes' },
])

/* ---------------------------- ações (maquete) ---------------------------- */
function entrar(w: Workspace) {
  toast.add({
    title: `Entrando em ${w.nome}`,
    description: 'No produto, aqui a pessoa já estaria dentro do workspace.',
    icon: 'i-lucide-log-in',
    color: 'primary',
  })
}

function aceitar(w: Workspace) {
  convitesAceitos.value.push(w.id)
  toast.add({ title: `Convite de ${w.nome} aceito`, icon: 'i-lucide-check', color: 'success' })
}

function recusar(w: Workspace) {
  convitesRecusados.value.push(w.id)
  toast.add({ title: `Convite de ${w.nome} recusado`, icon: 'i-lucide-x', color: 'neutral' })
}

function tentarDeNovo() {
  estado.value = 'carregando'
  setTimeout(() => (estado.value = 'normal'), 900)
}
</script>

<template>
  <div class="min-h-screen bg-default pb-28">
    <!-- Barra da aplicação, reproduzida só para dar contexto à tela -->
    <header class="border-b border-default bg-elevated/50">
      <UContainer class="flex h-14 items-center justify-between">
        <span class="text-sm font-medium text-muted">ENSPACE</span>
        <div class="flex items-center gap-3">
          <UButton
            icon="i-lucide-life-buoy"
            label="Suporte"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UAvatar :text="usuario.iniciais" size="sm" />
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-4xl py-10 sm:py-14">
      <!-- 1. A tela diz o que ela é ------------------------------------- -->
      <div class="mb-8">
        <p class="text-sm text-muted">
          Olá, {{ usuario.nome.split(' ')[0] }}
        </p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
          Escolha um workspace para entrar
        </h1>
        <p class="mt-2 max-w-2xl text-muted">
          Workspace é o espaço da sua empresa dentro do ENSPACE. Seu trabalho acontece
          <strong class="text-highlighted">dentro</strong> de um deles — esta tela só escolhe por
          qual porta entrar.
        </p>

        <ul class="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          <li
            v-for="exemplo in exemplosDoQueSeFazDentro"
            :key="exemplo.texto"
            class="flex items-center gap-2 text-sm text-muted"
          >
            <UIcon :name="exemplo.icone" class="size-4 text-primary" />
            {{ exemplo.texto }}
          </li>
        </ul>
      </div>

      <!-- Estado: erro ---------------------------------------------------- -->
      <UAlert
        v-if="estado === 'erro'"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="subtle"
        title="Não foi possível carregar seus workspaces"
        description="A conexão falhou. Seus workspaces continuam lá — é só tentar de novo."
        :actions="[{ label: 'Tentar de novo', color: 'error', variant: 'solid', onClick: tentarDeNovo }]"
      />

      <!-- Estado: carregando ---------------------------------------------- -->
      <div v-else-if="estado === 'carregando'" class="space-y-3">
        <USkeleton class="h-28 w-full rounded-lg" />
        <USkeleton class="h-14 w-full rounded-lg" />
        <USkeleton class="h-14 w-full rounded-lg" />
        <USkeleton class="h-14 w-full rounded-lg" />
      </div>

      <template v-else>
        <!-- 2. Convite pendente vira ação, não card apagado --------------- -->
        <UAlert
          v-for="convite in pendentes"
          :key="convite.id"
          class="mb-4"
          icon="i-lucide-mail-open"
          color="secondary"
          variant="subtle"
          :title="`${convite.convidadoPor} convidou você para ${convite.nome}`"
          description="Aceite para poder entrar neste workspace."
          :actions="[
            { label: 'Aceitar convite', color: 'secondary', variant: 'solid', onClick: () => aceitar(convite) },
            { label: 'Recusar', color: 'neutral', variant: 'ghost', onClick: () => recusar(convite) },
          ]"
        />

        <!-- 3. Continuar de onde parou: a entrada de um clique ------------ -->
        <section
          v-if="ultimo"
          class="mb-8 rounded-xl border border-default bg-elevated/40 p-5 sm:p-6"
        >
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-dimmed">
            {{ estado === 'unico' ? 'Seu workspace' : 'Continue de onde você parou' }}
          </p>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <UIcon :name="ultimo.icone" class="size-6 text-primary" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-lg font-semibold text-highlighted">
                  {{ ultimo.nome }}
                </h2>
                <p class="truncate text-sm text-muted">
                  {{ ultimo.descricao || tempoRelativo(ultimo.ultimoAcessoMin) }}
                </p>
              </div>
            </div>
            <UButton
              :label="`Entrar em ${ultimo.nome}`"
              icon="i-lucide-log-in"
              size="lg"
              class="shrink-0 justify-center"
              @click="entrar(ultimo)"
            />
          </div>
        </section>

        <!-- 4. A lista: densa, ordenada por uso, sem 'Sem descrição' ------ -->
        <section v-if="listados.length || busca || estado === 'vazio'">
          <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <UTabs
              v-model="aba"
              :items="abas"
              :content="false"
              color="primary"
              variant="link"
              size="sm"
            />
            <UInput
              v-model="busca"
              icon="i-lucide-search"
              placeholder="Buscar workspace"
              size="sm"
              class="sm:w-64"
            />
          </div>

          <ul v-if="listados.length" class="divide-y divide-default rounded-lg border border-default">
            <li
              v-for="w in listados"
              :key="w.id"
              class="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-elevated/60"
            >
              <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated">
                <UIcon :name="w.icone" class="size-4.5 text-muted" />
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="truncate font-medium text-highlighted">{{ w.nome }}</span>
                  <UIcon v-if="w.favorito" name="i-lucide-star" class="size-3.5 shrink-0 text-warning" />
                </div>
                <p class="truncate text-sm text-muted">
                  {{ w.descricao || `${w.membros} pessoas` }} · {{ tempoRelativo(w.ultimoAcessoMin) }}
                </p>
              </div>

              <UBadge
                :label="w.papel"
                :color="corDoPapel[w.papel]"
                variant="subtle"
                size="sm"
                class="hidden shrink-0 sm:inline-flex"
              />
              <UButton
                label="Entrar"
                color="neutral"
                variant="subtle"
                size="sm"
                class="shrink-0"
                @click="entrar(w)"
              />
            </li>
          </ul>

          <UEmpty
            v-else-if="busca"
            icon="i-lucide-search-x"
            :title="`Nenhum workspace com &quot;${busca}&quot;`"
            description="Confira o nome, ou peça acesso a quem administra o workspace na sua empresa."
          />
        </section>

        <!-- Estado: nenhum workspace -------------------------------------- -->
        <UEmpty
          v-if="estado === 'vazio' && !pendentes.length"
          icon="i-lucide-door-closed"
          title="Você ainda não faz parte de nenhum workspace"
          description="Quem administra o ENSPACE na sua empresa precisa convidar você. Se recebeu um convite por e-mail, abra o link de lá."
        />

        <!-- 5. Criar: última coisa da tela, e explicada -------------------- -->
        <USeparator class="my-10" />

        <div class="rounded-lg border border-dashed border-default p-5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-medium text-highlighted">
                Precisa de um espaço novo para a sua equipe?
              </h3>
              <p class="mt-1 max-w-xl text-sm text-muted">
                Criar um workspace abre um espaço <strong class="text-highlighted">vazio</strong>,
                com membros e configuração próprios.
                <strong class="text-highlighted">Não é aqui que se abre chamado</strong> —
                para isso, entre no workspace da sua empresa.
              </p>
            </div>
            <UButton
              to="/tela-de-workspaces/criar"
              label="Criar workspace"
              icon="i-lucide-plus"
              color="neutral"
              variant="outline"
              class="shrink-0 justify-center"
            />
          </div>
        </div>
      </template>
    </UContainer>

    <!-- ANDAIME DE PROTÓTIPO — não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 border-t border-default bg-elevated/95 backdrop-blur">
      <UContainer class="flex flex-wrap items-center gap-2 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-dimmed">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />
      </UContainer>
    </div>
  </div>
</template>
