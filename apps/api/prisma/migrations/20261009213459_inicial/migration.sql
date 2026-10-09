-- CreateEnum
CREATE TYPE "Perfil" AS ENUM ('paciente', 'recepcao', 'profissional');

-- CreateEnum
CREATE TYPE "TipoConsulta" AS ENUM ('primeira', 'retorno');

-- CreateEnum
CREATE TYPE "StatusConsulta" AS ENUM ('agendada', 'cancelada', 'realizada', 'faltou');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "perfil" "Perfil" NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissionais" (
    "id" TEXT NOT NULL,
    "especialidade" TEXT NOT NULL,

    CONSTRAINT "profissionais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultas" (
    "id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "paciente_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "inicio" TIMESTAMPTZ(3) NOT NULL,
    "fim" TIMESTAMPTZ(3) NOT NULL,
    "tipo" "TipoConsulta" NOT NULL,
    "status" "StatusConsulta" NOT NULL DEFAULT 'agendada',
    "criada_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cancelada_em" TIMESTAMPTZ(3),

    CONSTRAINT "consultas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folgas" (
    "id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "criada_em" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "folgas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "consultas_profissional_id_data_idx" ON "consultas"("profissional_id", "data");

-- CreateIndex
CREATE INDEX "consultas_paciente_id_idx" ON "consultas"("paciente_id");

-- CreateIndex
CREATE UNIQUE INDEX "folgas_profissional_id_data_key" ON "folgas"("profissional_id", "data");

-- AddForeignKey
ALTER TABLE "profissionais" ADD CONSTRAINT "profissionais_id_fkey" FOREIGN KEY ("id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultas" ADD CONSTRAINT "consultas_paciente_id_fkey" FOREIGN KEY ("paciente_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folgas" ADD CONSTRAINT "folgas_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
