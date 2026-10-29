# Requisitos: tela de workspaces, parte 3, recentes e favoritos

**Objetivo:** a pessoa volta ao workspace de sempre sem procurar: o bloco do topo mostra o último acessado, e as abas
"Favoritos" e "Recentes" e a ordem por acesso levam ao que ela usa.

**Onde vale:** a tela `/workspaces`.

**Referência visual:** https://pernalombr4.github.io/prototipos/tela-de-workspaces, aprovado em 14/10/2026 e
revisado até 20/10/2026.

**Convenção:** "deve" é obrigatório. Cada requisito tem um critério de aceite que se confere na tela. Os textos
entre aspas são os da interface em português; os de inglês e espanhol estão no `textos.ts` da pasta do protótipo.
{chaves} são valores variáveis.

**Relevância:** Obrigatório, o dev faz. Desejável, o dev faz; se achar melhor não fazer, conversa com produtos antes.
Opcional, o dev pode não fazer quando o esforço é grande para o ganho.

**Épico:** [epico.md](epico.md). Depende da parte 1.

**Fora do escopo:** o workspace padrão no bloco do topo (parte 4).

## Resumo

| Grupo | O que muda em relação ao develop de 16/09/2026 | Requisitos |
|---|---|---|
| Abas e favoritos | Abas "Favoritos" e "Recentes" com contagem; estrela no card e na lista | RF201 a RF206 |
| Ordem e último acesso | Ordem por acesso, que vira a padrão; rodapé "Acessado há…"; coluna "Último acesso" | RF207 a RF212 |
| Bloco do topo | Hoje não existe. Mostra o último acessado com o botão "Entrar em {nome}" | RF213 a RF219 |
| Dados | A API passa a guardar o último acesso e os favoritos de cada pessoa | RI201, RI202 |

## Abas e favoritos (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF201 | A barra deve ter a aba "Favoritos ({n})", com os favoritos da pessoa, sem convites (RN903). | A contagem bate com os cards que a aba mostra. | Essencial | Obrigatório |
| RF202 | A barra deve ter a aba "Recentes ({n})", com os workspaces que a pessoa já acessou, sem convites (RN903). | A contagem bate com os cards que a aba mostra. | Essencial | Obrigatório |
| RF203 | Ao digitar a primeira letra na busca, a aba deve voltar para "Todos". | Na aba "Favoritos", digitar "rh" mostra RH Aurora, que não é favorito. | Importante | Obrigatório |
| RF204 | O card deve mostrar a estrela, visível sem passar o mouse: amarela no favorito; cinza-fraca nos outros, amarela no hover. O nome acessível é "Adicionar aos favoritos" ou "Remover dos favoritos". | A estrela aparece em cada card que não é convite. | Essencial | Obrigatório |
| RF205 | Clicar na estrela deve favoritar ou desfavoritar o workspace e atualizar a aba "Favoritos" na hora. | Favoritar soma 1 na aba "Favoritos" sem recarregar a página. | Essencial | Obrigatório |
| RF206 | Na lista, a coluna Workspace deve mostrar a estrela depois do nome quando o workspace é favorito. | Um favorito mostra a estrela na 1ª linha da coluna. | Importante | Obrigatório |

## Ordem e último acesso (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF207 | O menu Ordenar deve ganhar, em 1º lugar, o bloco de acesso da tabela abaixo, e "Acessados por último" passa a ser o critério padrão. | A tela abre com "Ordenar: Último acesso". | Essencial | Obrigatório |
| RF208 | Nas 2 ordens de acesso, os workspaces "Nunca acessado" devem ir para o fim. | Em "Acessados há mais tempo", os nunca acessados ficam no fim. | Importante | Obrigatório |
| RF209 | À esquerda do rodapé, o card deve ter uma informação só: ícone de relógio de 14px e o tempo do último acesso (RF210). As partes 4 e 5 trocam essa informação no padrão e no oculto. | Nenhum card mostra o número de pessoas. | Importante | Obrigatório |
| RF210 | O tempo do último acesso deve seguir a escala da tabela abaixo. | Acesso de 2 dias atrás mostra "Acessado há 2 dias". | Importante | Obrigatório |
| RF211 | A lista deve ganhar a coluna "Último acesso", com o tempo de RF210, ordenável pelo cabeçalho. | A coluna "Último acesso" ordena ao clicar no cabeçalho. | Importante | Obrigatório |
| RF212 | Na linha de convite, a coluna "Último acesso" deve mostrar "Aceite para entrar". | A linha de Lumen Contábil mostra "Aceite para entrar". | Importante | Obrigatório |

**Bloco de acesso do menu Ordenar (RF207)**

| Opção no menu | No botão | Regra |
|---|---|---|
| Acessados por último (padrão) | Último acesso | último acesso mais recente primeiro |
| Acessados há mais tempo | Acesso mais antigo | último acesso mais antigo primeiro |

**Tempo do último acesso (RF210)**

| Tempo | Texto |
|---|---|
| menos de 60 minutos | "Acessado há {n} min" |
| menos de 24 horas | "Acessado há 1 hora" / "Acessado há {n} horas" |
| menos de 30 dias | "Acessado há 1 dia" / "Acessado há {n} dias" |
| 30 dias ou mais (dias ÷ 30, arredondado) | "Acessado há 1 mês" / "Acessado há {n} meses" |
| sem acesso | "Nunca acessado" |

## Bloco do topo (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF213 | O bloco do topo deve mostrar o último workspace acessado que está na lista (RN903). Sem acesso registrado, ou com texto na busca, o bloco fica de fora. | O bloco mostra o workspace de acesso mais recente; digitar na busca esconde o bloco. | Essencial | Obrigatório |
| RF214 | O rótulo do bloco deve ser "Continue de onde você parou"; com 1 workspace só, "Seu workspace". | Com 1 workspace só, o rótulo diz "Seu workspace". | Importante | Obrigatório |
| RF215 | O bloco deve mostrar o ícone num quadrado de 48px com fundo primário suave, o nome e a descrição; sem descrição, o tempo do último acesso (RF210). | Um workspace sem descrição mostra "Acessado há…" no lugar. | Importante | Obrigatório |
| RF216 | O botão "Entrar em {nome}" deve ser o principal da tela: cor cheia, tamanho grande, ícone de entrar e carregamento ao clicar. | É o único botão de cor cheia da tela fora dos estados vazio e de erro (P903 do épico). | Essencial | Obrigatório |
| RF217 | O workspace do bloco deve continuar na lista. | Grupo Aurora aparece no bloco e na grade; buscar "grupo aurora" o encontra. | Importante | Obrigatório |
| RF218 | Com 1 workspace só, a tela deve mostrar só o bloco do topo, sem busca, sem barra e sem lista. | O workspace aparece 1 vez. | Essencial | Obrigatório |
| RF219 | No carregamento, o esqueleto deve ganhar um bloco de 112px acima dos 6 cards (RF042). | O esqueleto tem o formato do bloco e dos cards. | Importante | Obrigatório |

## Interfaces (RI)

| ID | Rota ou evento | O que deve receber ou devolver | Relevância |
|---|---|---|---|
| RI201 | Último acesso (rota <a definir>) | A API deve guardar, por pessoa, a data do último acesso a cada workspace e devolver a data na listagem. | Obrigatório |
| RI202 | Favoritos (rota <a definir>) | A API deve guardar, por pessoa, os workspaces favoritos e devolver a marca na listagem. | Obrigatório |
