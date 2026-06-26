---
name: write-documentation
description: >
  Aplica princípios de boa documentação: clareza, estrutura que serve o conteúdo, e curadoria de texto gerado por AI antes de publicar. Use quando o usuário for escrever ou revisar qualquer doc (guia, spec, referência, README, nota) e a dúvida for de qualidade/forma — não de conteúdo técnico específico. Triggers: "escreve um doc", "documenta isso", "cura esse texto de AI", "esse texto tá com cara de AI?", "revisa antes de publicar", "deixa esse doc menos chato", "como documentar isso".
---

# Write Documentation

Documentação escala conhecimento. Se está só na cabeça de alguém, não escala. Se está escrito, qualquer pessoa acessa, entende e contribui.

Esta skill é sobre **forma e qualidade** de um doc — clareza, estrutura, curadoria. Não é sobre o conteúdo técnico em si.

---

## Princípios

- **Direto ao ponto.** Sem introdução tipo "Neste documento vamos abordar...". Começa pelo conteúdo.
- **Tom de conversa, não de manual corporativo.** Se não diria numa conversa, não escreve.
- **Estrutura serve o conteúdo** — não o contrário. Não precisa de H2/H3/H4 pra 3 frases.
- **Tenha opinião.** Doc bom tem ponto de vista. Se algo é a melhor opção, diz que é.
- **Correto e curto > correto e completo.**

---

## Escrevendo com AI — curar, não gerar

LLMs geram rascunhos poderosos, mas texto de AI sem curadoria tem vícios previsíveis. O trabalho não é *gerar* — é **curar**.

### Vícios comuns de texto AI

| Vício | Exemplo | O que fazer |
| --- | --- | --- |
| **Verbosidade** | "É importante ressaltar que a documentação desempenha um papel fundamental..." | Corta. Vai direto. |
| **Hedging excessivo** | "Isso pode potencialmente ajudar a melhorar..." | Afirma ou não afirma. Tira o "pode potencialmente". |
| **Listas infinitas** | 10 bullets quando 3 bastavam | Menos é mais. Prioriza. |
| **Tom corporativo** | "Visando otimizar os processos e garantir a excelência..." | Escreve como fala. |
| **Repetição disfarçada** | Mesma coisa no título, na intro e no 1º parágrafo | Uma vez basta. |
| **Estrutura excessiva** | H2/H3/H4 pra 3 frases de conteúdo | Estrutura serve o conteúdo. |

### Como curar

1. **Gere o rascunho com AI** — deixa sair tudo, sem filtro.
2. **Corte pela metade** — se o texto AI tem 10 parágrafos, 50–70% costuma bastar.
3. **Leia em voz alta** — se soa robótico ou burocrático, reescreve no seu tom.
4. **Elimine a introdução** — AI adora "Neste documento vamos abordar...". Deleta e começa pelo conteúdo.
5. **Adicione opinião** — AI é neutra por padrão. Se algo é a melhor opção, diz que é.

> 💡 Se um doc parece *correto mas chato*, provavelmente é texto AI sem curadoria.

---

## Processo

1. **Escreva o rascunho** (com ou sem AI).
2. **Cure** com o checklist acima — corta, lê em voz alta, mata a intro, adiciona opinião.
3. **Cheque a forma:**
   - Começou com "Neste doc vamos abordar..."? Corta.
   - Tem seções sem conteúdo real? Remove.
   - Mais de 3 níveis de hierarquia? Simplifica.
   - Quem lê consegue agir depois de 30 segundos? Se não, simplifica.
4. **Entregue em Markdown.**
