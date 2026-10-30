"""Converte o HTML das tarefas do card (parte-N.html) em lista de marcar, com o print de cada grupo de requisitos abaixo das caixas.

Regras da redatora de 2026-10-29, a partir do retorno do dev (AGENTE_PROTOTIPOS.md, Fase 5, "Protótipo aprovado: o card no
ENSPACE", e regra 42):
- cada RF e RI vira uma caixa da Task List do editor do ENSPACE, "`ID` requisito", sem a coluna de critério;
- a prioridade e a relevância de cada requisito ficam entre parênteses no fim, com o nome de cada escala ("Desejável"
  existe nas 2): "(prioridade: Essencial; relevância: Obrigatório)" (decisão da redatora em 2026-10-30: o dev precisa
  saber o que é obrigatório, importante e opcional);
- 1 print por grupo de requisitos, não por requisito (decisão da redatora em 2026-10-30): os requisitos de um grupo
  ficam juntos na seção, e o print do grupo vai abaixo das caixas deles, pelo endereço do GitHub. O grupo e o arquivo
  vêm de evidencias/requisitos/grupos.json, que ferramentas/prints-de-requisito.mjs grava; sem ele, vale <ID>.jpg;
- requisito com { "sem": "<motivo>" } no prints.json leva "Sem print: <motivo>" abaixo da caixa dele;
- regra de negócio e pergunta viram parágrafo; parágrafo seguido de parágrafo leva 1 linha em branco (<p></p>).

Uso:
  python -B agentes-base/bin/requisitos_para_enspace.py html app/pages/<slug>/requisitos <rascunho>
  python -B ferramentas/tarefas_em_lista.py <rascunho> app/pages/<slug>
  (depois, requisitos_para_enspace.py atualizar <rascunho> --tarefa <n>=<id> ...)
Grava parte-N.html no lugar; a versão em tabela fica em parte-N.tabela.html. Sai com erro se faltar o print de um
requisito que não tem "sem" no prints.json.
"""
import json
import re
import sys
from pathlib import Path

REPO = 'https://raw.githubusercontent.com/pernalombr4/prototipos/main'
BLOCO = re.compile(r'<h2><strong>(.*?)</strong></h2><table><tbody>(.*?)</tbody></table>', re.S)
LINHA = re.compile(r'<tr>(.*?)</tr>', re.S)
CEL = re.compile(r'<t[hd]><p>(.*?)</p></t[hd]>', re.S)
# A Task List do editor do ENSPACE, no HTML que ele mesmo grava (lido da tarefa 939 do desenvolvimento-enlighten2 em
# 2026-10-29). O editor tira a imagem de dentro do item e fecha a lista antes dela; por isso cada grupo de requisitos
# vai numa lista própria, seguida da imagem (medido na tarefa 24389 em 2026-10-29).
UL = '<ul class="not-prose pl-2 checked-task-light" data-type="taskList">'
LI = ('<li class="not-prose flex items-center my-1" data-checked="false" data-type="taskItem">'
      '<label><input type="checkbox"><span></span></label>')


def converter(html, pasta, sem, grupos):
    faltam = []

    def chave(id_):
        return ('sem', id_) if id_ in sem else ('img', grupos.get(id_, f'{id_}.jpg'))

    def print_de(k, ids):
        if k[0] == 'sem':
            return f'<p>Sem print: {sem[k[1]]}.</p>'
        arq = pasta / 'evidencias' / 'requisitos' / k[1]
        if not arq.exists():
            faltam.extend(ids)
            return ''
        rel = arq.as_posix().split('app/pages/', 1)[1]
        nome = ' a '.join(Path(k[1]).stem.split('-'))
        return f'<img src="{REPO}/app/pages/{rel}" alt="{nome} no protótipo">'

    def bloco(m):
        titulo = re.sub(r'\s*\((RF|RN|RI|RNF|RS|RT)\)$', '', m.group(1))
        linhas = [CEL.findall(l) for l in LINHA.findall(m.group(2))]
        cab, corpo = linhas[0], linhas[1:]
        i_rel = cab.index('Relevância') if 'Relevância' in cab else None
        i_pri = cab.index('Prioridade') if 'Prioridade' in cab else None
        tipo = cab[1]
        caixa = tipo in ('Requisito', 'Rota ou evento')
        saida = [f'<h2><strong>{titulo}</strong></h2>']
        caixas = {}
        for c in corpo:
            id_, texto = c[0], c[1]
            if tipo == 'Rota ou evento':
                texto = f'{texto}: {c[2][0].lower()}{c[2][1:]}'
            if tipo.startswith('Pergunta'):
                texto = f'{texto} (quem responde: {c[2]})'
            escalas = []
            if caixa and i_pri is not None:
                escalas.append(f'prioridade: {c[i_pri]}')
            if i_rel is not None and (caixa or c[i_rel] != 'Obrigatório'):
                escalas.append(f'relevância: {c[i_rel]}')
            if escalas:
                texto = f'{texto} ({"; ".join(escalas)})'
            if caixa:
                caixas.setdefault(chave(id_), []).append((id_, f'{LI}<div><p><code>{id_}</code> {texto}</p></div></li>'))
            else:
                saida.append(f'<p><code>{id_}</code> {texto}</p>')
        # Cada grupo na ordem do 1º requisito dele: as caixas numa lista, e o print do grupo abaixo.
        for k, itens in caixas.items():
            saida.append(UL + ''.join(li for _, li in itens) + '</ul>' + print_de(k, [i for i, _ in itens]))
        return ''.join(saida)

    novo = BLOCO.sub(bloco, html)
    # A tabela de decisão (opções de ordenar, texto do último acesso) fica tabela: é curta e não tem as colunas de
    # critério, prioridade e relevância. Só a tabela de requisito, que começa por ID, não pode sobrar.
    if '<table><tbody><tr><th><p>ID</p>' in novo:
        sys.exit('sobrou tabela de requisito sem converter')
    # Parágrafo seguido de parágrafo leva 1 linha em branco: no editor do ENSPACE, o parágrafo vazio <p></p>.
    novo = novo.replace('</p><p>', '</p><p></p><p>')
    return novo, faltam


def main():
    rascunho, pasta = Path(sys.argv[1]), Path(sys.argv[2])
    conf = json.loads((pasta / 'requisitos' / 'prints.json').read_text(encoding='utf-8'))
    sem = {i: r['sem'] for i, r in conf['requisitos'].items() if 'sem' in r}
    arq_grupos = pasta / 'evidencias' / 'requisitos' / 'grupos.json'
    grupos = json.loads(arq_grupos.read_text(encoding='utf-8')) if arq_grupos.exists() else {}
    todos_faltam = []
    for p in sorted(rascunho.glob('parte-*.html')):
        if p.name.endswith('.tabela.html'):
            continue
        tabela = p.with_name(p.stem + '.tabela.html')
        if not tabela.exists():
            tabela.write_text(p.read_text(encoding='utf-8'), encoding='utf-8')
        html = tabela.read_text(encoding='utf-8')
        novo, faltam = converter(html, pasta, sem, grupos)
        todos_faltam += faltam
        p.write_text(novo, encoding='utf-8')
        print(f'{p.name}: {len(html)} -> {len(novo)} bytes, {novo.count("<img ")} prints')
    if todos_faltam:
        sys.exit(f'falta o print de: {", ".join(todos_faltam)} (rode ferramentas/prints-de-requisito.mjs)')


if __name__ == '__main__':
    main()
