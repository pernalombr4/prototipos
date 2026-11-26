"""Mudou para o agentes-base (bin/tarefas_em_lista.py) em 2026-11-26, com a skill card-enspace.

Este arquivo só chama o de lá, com os mesmos argumentos, para os comandos antigos continuarem valendo:
  python -B ferramentas/tarefas_em_lista.py <rascunho> app/pages/<slug>
"""
import runpy
import sys

sys.dont_write_bytecode = True
ALVO = r'C:\Users\JardimMikaela\agentes-base\bin\tarefas_em_lista.py'
sys.argv[0] = ALVO
runpy.run_path(ALVO, run_name='__main__')
