-- CreateTable
CREATE TABLE "datasets" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "islamic_value" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "raw_data" JSONB NOT NULL,
    "chart_config" JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "datasets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "dataset_id" UUID NOT NULL,
    "task_number" SMALLINT NOT NULL,
    "watson_level" SMALLINT NOT NULL,
    "indicator" VARCHAR(100) NOT NULL,
    "prompt" TEXT NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_token" VARCHAR(64) NOT NULL,
    "student_name" VARCHAR(255),
    "student_class" VARCHAR(50),
    "school_name" VARCHAR(255),
    "test_phase" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "current_level" SMALLINT NOT NULL DEFAULT 1,
    "badges" JSONB,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "task_id" UUID NOT NULL,
    "answer_text" TEXT,
    "score" SMALLINT NOT NULL,
    "scored_by" VARCHAR(50) NOT NULL DEFAULT 'system',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sus_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "q1" SMALLINT NOT NULL,
    "q2" SMALLINT NOT NULL,
    "q3" SMALLINT NOT NULL,
    "q4" SMALLINT NOT NULL,
    "q5" SMALLINT NOT NULL,
    "q6" SMALLINT NOT NULL,
    "q7" SMALLINT NOT NULL,
    "q8" SMALLINT NOT NULL,
    "q9" SMALLINT NOT NULL,
    "q10" SMALLINT NOT NULL,
    "q11" SMALLINT NOT NULL,
    "q12" SMALLINT NOT NULL,
    "q13" SMALLINT NOT NULL,
    "q14" SMALLINT NOT NULL,
    "total_score" DECIMAL(5,2) NOT NULL,
    "adjective_rating" VARCHAR(20),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sus_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "validators" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(50) NOT NULL,

    CONSTRAINT "validators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expert_validations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "validator_id" UUID NOT NULL,
    "item_number" SMALLINT NOT NULL,
    "score" SMALLINT NOT NULL,
    "feedback" TEXT,

    CONSTRAINT "expert_validations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "datasets_slug_key" ON "datasets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_token_key" ON "sessions"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "task_responses_session_id_task_id_key" ON "task_responses"("session_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "sus_responses_session_id_key" ON "sus_responses"("session_id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_dataset_id_fkey" FOREIGN KEY ("dataset_id") REFERENCES "datasets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_responses" ADD CONSTRAINT "task_responses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_responses" ADD CONSTRAINT "task_responses_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sus_responses" ADD CONSTRAINT "sus_responses_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expert_validations" ADD CONSTRAINT "expert_validations_validator_id_fkey" FOREIGN KEY ("validator_id") REFERENCES "validators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
