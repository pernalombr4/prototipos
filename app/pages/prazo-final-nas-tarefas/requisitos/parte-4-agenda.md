# 4. Agenda

**Objetivo:** a Agenda mostra o prazo final de cada tarefa rápida no dia dele, além da tarefa no dia que a Configuração escolhe.

**Depende de:** 1. O prazo final na tarefa rápida.

**Onde vale:** Agenda, na grade e na Configuração, aba Tarefas Rápidas.

**Protótipo:** https://pernalombr4.github.io/prototipos/prazo-final-nas-tarefas/, área Agenda. "Configurar" abre a Configuração; a aba Tarefas Rápidas tem a Data e "Marcar o prazo final".

## A grade (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF024 | Quando a tarefa rápida tem prazo final, a Agenda deve mostrar um marcador "Prazo final: <nome da tarefa>" no dia do prazo final, além da tarefa no dia da opção "Data". | Exemplo: Data = Vencimento; tarefa com vencimento 20/11 e prazo final 25/11 aparece em 20/11 e tem o marcador em 25/11. | Essencial | Obrigatório |
| RF026 | Quando a tarefa está com o prazo final vencido (RN006), o marcador do prazo final deve aparecer com o destaque de vencido do protótipo; com a tarefa concluída, riscado. | O marcador de 19/11 da tarefa da RN006 aparece em vermelho cheio; o da tarefa concluída aparece riscado. | Importante | Desejável |
| RF027 | Quando o membro clica no marcador do prazo final, a Agenda deve abrir o painel da tarefa, como faz com a tarefa. | O painel abre com o prazo final na seção Datas. | Importante | Obrigatório |

## A Configuração (RF)

| ID | Requisito | Critério de aceite | Prioridade | Relevância |
|---|---|---|---|---|
| RF023 | A opção "Data" das Tarefas Rápidas na Configuração da Agenda deve oferecer "Prazo final". | A lista mostra Criado em, Vencimento, Prazo final e Concluído em. | Importante | Obrigatório |
| RF025 | A Configuração da Agenda deve ter a opção "Marcar o prazo final" nas Tarefas Rápidas, ligada por padrão, que mostra ou esconde o marcador do RF024. | Desligada e salva, os marcadores somem; a tarefa continua no dia da opção "Data". Com Data = Prazo final, a opção não aparece. | Importante | Desejável |
