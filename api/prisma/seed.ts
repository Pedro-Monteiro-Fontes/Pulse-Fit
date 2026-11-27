import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

function generateValidCPF(): string {
  const nums = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += nums[i] * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  nums.push(rest);
  sum = 0;
  for (let i = 0; i < 10; i++) sum += nums[i] * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  nums.push(rest);
  const cpf = nums.join('');
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9, 11)}`;
}

function generateValidCREF(): string {
  const num = String(Math.floor(100000 + Math.random() * 900000));
  const uf = ['SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'][Math.floor(Math.random() * 10)];
  return `${num.slice(0, 3)}-${num.slice(3, 6)}/${uf}`;
}

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.matricula.deleteMany();
  await prisma.modalidade.deleteMany();
  await prisma.instrutor.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.usuario.deleteMany();

  console.log('👨‍🏫 Criando instrutores...');
  const instrutores = await Promise.all(
    [
      { nome: 'Carlos Eduardo Silva', email: 'carlos.silva@pulsefit.com', telefone: '(11) 99999-1111', cref: '123-456/SP' },
      { nome: 'Mariana Oliveira', email: 'mariana.oliveira@pulsefit.com', telefone: '(11) 99999-2222', cref: '234-567/RJ' },
      { nome: 'Roberto Santos', email: 'roberto.santos@pulsefit.com', telefone: '(11) 99999-3333', cref: '345-678/MG' },
      { nome: 'Fernanda Lima', email: 'fernanda.lima@pulsefit.com', telefone: '(11) 99999-4444', cref: '456-789/RS' },
      { nome: 'Ricardo Costa', email: 'ricardo.costa@pulsefit.com', telefone: '(11) 99999-5555', cref: '567-890/PR' },
    ].map(d => prisma.instrutor.create({ data: d }))
  );

  console.log('🏋️ Criando modalidades...');
  const modalidades = await Promise.all(
    [
      { nome: 'Musculação', descricao: 'Treino de força com pesos livres e máquinas', instrutorId: instrutores[0].id },
      { nome: 'CrossFit', descricao: 'Treino funcional de alta intensidade', instrutorId: instrutores[0].id },
      { nome: 'Pilates', descricao: 'Controle muscular, flexibilidade e postura', instrutorId: instrutores[1].id },
      { nome: 'Yoga', descricao: 'Equilíbrio, respiração e meditação', instrutorId: instrutores[1].id },
      { nome: 'Spinning', descricao: 'Ciclismo indoor com música motivadora', instrutorId: instrutores[2].id },
      { nome: 'Boxe', descricao: 'Técnica de boxe e condicionamento físico', instrutorId: instrutores[2].id },
      { nome: 'Funcional', descricao: 'Movimentos naturais do dia a dia', instrutorId: instrutores[3].id },
      { nome: 'Alongamento', descricao: 'Flexibilidade e prevenção de lesões', instrutorId: instrutores[4].id },
    ].map(d => prisma.modalidade.create({ data: d }))
  );

  console.log('👥 Criando alunos...');
  const alunos = await Promise.all(
    Array.from({ length: 20 }, (_, i) => {
      const names = [
        'Ana Paula Souza', 'Bruno Henrique', 'Carla Mendes', 'Diego Alves', 'Eduarda Ribeiro',
        'Felipe Carvalho', 'Gabriela Ferreira', 'Hugo Martins', 'Isabela Gomes', 'João Pedro',
        'Larissa Dias', 'Mateus Rocha', 'Natália Barbosa', 'Otávio Nunes', 'Patrícia Cardoso',
        'Rafael Moreira', 'Sofia Araújo', 'Thiago Monteiro', 'Vanessa Teixeira', 'William Campos'
      ];
      const birthYear = 1980 + Math.floor(Math.random() * 25);
      const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      return prisma.aluno.create({
        data: {
          nome: names[i],
          cpf: generateValidCPF(),
          email: `aluno${i + 1}@example.com`,
          telefone: `(11) 9${String(Math.floor(1000 + Math.random() * 9000))}-${String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0')}`,
          dataNascimento: new Date(`${birthYear}-${birthMonth}-${birthDay}`),
        },
      });
    })
  );

  console.log('📝 Criando matrículas...');
  const statuses = ['ativa', 'ativa', 'ativa', 'cancelada'];
  for (let i = 0; i < 30; i++) {
    const aluno = alunos[Math.floor(Math.random() * alunos.length)];
    const modalidade = modalidades[Math.floor(Math.random() * modalidades.length)];
    const exists = await prisma.matricula.findUnique({
      where: { alunoId_modalidadeId: { alunoId: aluno.id, modalidadeId: modalidade.id } },
    });
    if (!exists) {
      await prisma.matricula.create({
        data: {
          alunoId: aluno.id,
          modalidadeId: modalidade.id,
          dataInicio: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
          status: statuses[Math.floor(Math.random() * statuses.length)],
        },
      });
    }
  }

  console.log('👤 Criando usuários...');
  const senhaHash = await bcrypt.hash('123456', 10);
  await Promise.all([
    prisma.usuario.create({ data: { nome: 'Admin Pulse', email: 'admin@pulsefit.com', senhaHash } }),
    prisma.usuario.create({ data: { nome: 'Recepção', email: 'recepcao@pulsefit.com', senhaHash } }),
  ]);

  console.log('✅ Seed concluído com sucesso!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());