# Narrativa do Projeto: Academia **Pulse Fit**

## Nome Fictício

**Pulse Fit** — Academia de alto desempenho e bem-estar

---

## A Necessidade

A **Pulse Fit** nasceu em 2023 no bairro Jardim das Flores, fundada por dois ex-atletas de crossfit que viram uma lacuna no mercado: academias tradicionais focavam só em "peso e esteira", enquanto boxes de crossfit eram intimidantes para iniciantes. A proposta da Pulse Fit era simples: **treino inteligente, acompanhamento real, comunidade acolhedora**.

### O Problema Real

Em 2024, com 350+ alunos ativos, 8 instrutores e 12 modalidades (musculação, crossfit, pilates, natação, yoga, funcional, luta, spinning, alongamento, hiit, core, mobilidade), a gestão virou caos:

| Antes do Sistema | Dor |
|------------------|-----|
| **Planilhas no Google Sheets** | Duas recepcionistas editando ao mesmo tempo → dados sobrescritos, matrículas perdidas |
| **WhatsApp para agendar** | "Professor, tem vaga no crossfit das 18h?" → resposta lenta, overbooking, aluno chegando e não tendo vaga |
| **Cadastro em papel** | Fichas ilegíveis, CPF digitado errado, e-mail com typo → impossível contactar aluno para renovação |
| **Controle de mensalidade no caderno** | 40+ alunos em atraso não identificados, receita vazando silenciosamente |
| **Instrutores sem visão** | Professor de natação não sabe quem são seus alunos novos até a aula começar |
| **Relatórios manuais** | Dono gasta 6h/semana montando planilha de ocupação por modalidade para decidir onde investir |

### O Estopim

Em março de 2024, um aluno VIP (pacote anual pago à vista) chegou para aula de pilates e **não tinha vaga** — a recepcionista tinha anotado no WhatsApp mas esqueceu de bloquear na planilha. O aluno cancelou o pacote, pediu reembolso e levou 3 amigos juntos. Prejuízo: R$ 12.000 + reputação.

O dono percebeu: **não dá para escalar no "jeitinho"**. Precisava de um sistema que:

1. **Centralizasse** aluno, instrutor, modalidade e matrícula em um só lugar
2. **Impedisse overbooking** (vaga real × capacidade da sala)
3. **Validasse dados na entrada** (CPF, e-mail, telefone) — nada de "joao@gmal.com"
4. **Desse visibilidade** ao instrutor (lista de alunos da sua modalidade na palma da mão)
5. **Automatizasse** status de matrícula (ativa, cancelada, trancada, aguardando vaga)
6. **Gerasse relatórios** instantâneos: ocupação por modalidade, inadimplência, churn, tickets médios

### A Solução: Pulse Fit System

O sistema que vamos construir atende exatamente essas dores:

- **CRUD completo** das 4 entidades centrais (Instrutor, Modalidade, Aluno, Matrícula)
- **Validação Zod** no front e back — dado sujo não entra
- **Relacionamentos claros**: Matrícula liga Aluno ↔ Modalidade (que tem Instrutor)
- **Busca instantânea** por nome/CPF na lista de alunos
- **Seletores (select)** no formulário de matrícula — ninguém digita ID à mão
- **Login seguro** (bcrypt + JWT) — só recepcionista/admin acessa
- **Swagger** para o dono (técnico) testar a API direto
- **Seed realista** para demonstração no dia da entrega

---

## Personas

| Persona | Papel | O que faz no sistema |
|---------|-------|---------------------|
| **Carlos** (dono) | Admin | Vê relatórios, cadastra instrutores, define modalidades |
| **Mariana** | Recepcionista | Cadastra alunos, faz matrículas, busca aluno, cancela/tranca |
| **Rafael** | Instrutor (Crossfit) | Vê seus alunos da modalidade, marca presença (futuro) |
| **Alunos** | Clientes | Não acessam o sistema diretamente (v1) — só a recepção gerencia |

---

## Métricas de Sucesso (Pós-Implantação)

- ⏱️ Tempo de matrícula: **15 min → 2 min**
- 📉 Overbooking: **3-4/semana → 0**
- 📞 Ligações de cobrança: **manual → lista automática de inadimplentes**
- 📊 Decisão de abrir nova turma: **"achismo" → ocupação > 85% por 3 semanas**
- 💰 Recuperação de receita: **R$ 8-12k/mês** em mensalidades que vazavam

---

> *"Não construímos software para academia. Construímos a infraestrutura que deixa a academia fazer o que sabe de melhor: transformar corpos e vidas."* — Carlos, fundador da Pulse Fit