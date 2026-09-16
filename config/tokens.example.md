# Modelo do `tokens.md`

> Copie para `config/tokens.md` e preencha. O `tokens.md` é ignorado pelo git e **nunca** é
> commitado — este repositório é público.
>
> Os valores ficam na pasta de tokens da máquina da Mikaela. Se o `tokens.md` não existir,
> **pare e peça a ela**; não invente valor e não vasculhe o disco atrás de credencial.

```
# Ambiente do produto — SEMPRE develop, nunca produção
BASE_URL=

# Usuário de automação usado na investigação
USER_EMAIL=

# O ÚNICO workspace onde a exploração acontece, e a tela por onde ela começa.
# Nunca explorar em outro: os demais têm dado de gente de verdade.
WORKSPACE_EXPLORACAO=
URL_EXPLORACAO=

# Token da API de develop.
# Leitura: esquemas e estrutura de campo, sempre liberado.
# Escrita: SÓ para preparo em massa de cenário de teste, no workspace de
# exploração. A jornada avaliada acontece pela tela — ver a Fase 2 da spec.
API_TOKEN=

# Pasta local de onde esses valores vieram
PASTA_DE_TOKENS=
```

**A senha não entra aqui e não entra em lugar nenhum.** O agente não digita senha em
formulário: o acesso é pela sessão já aberta no Chrome da usuária e, se ela cair, pelo botão
Microsoft do Keycloak. Se nem assim entrar, pare e peça para ela fazer o login.
