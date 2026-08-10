-- AlterTable: tambah kolom nullable untuk data pilihan ganda & prasyarat modul
ALTER TABLE "tasks" ADD COLUMN "options" JSONB;
