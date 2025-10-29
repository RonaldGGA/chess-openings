-- CreateTable
CREATE TABLE "Opening" (
    "id" TEXT NOT NULL,
    "fen" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "eco" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scid" TEXT,
    "isEcoRoot" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opening_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alias" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "openingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FromTo" (
    "id" TEXT NOT NULL,
    "fromFen" TEXT NOT NULL,
    "toFen" TEXT NOT NULL,
    "fromSrc" TEXT NOT NULL,
    "toSrc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FromTo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opening_fen_key" ON "Opening"("fen");

-- CreateIndex
CREATE INDEX "Opening_eco_idx" ON "Opening"("eco");

-- CreateIndex
CREATE INDEX "Opening_src_idx" ON "Opening"("src");

-- CreateIndex
CREATE INDEX "Opening_fen_idx" ON "Opening"("fen");

-- CreateIndex
CREATE UNIQUE INDEX "Alias_openingId_source_value_key" ON "Alias"("openingId", "source", "value");

-- CreateIndex
CREATE INDEX "FromTo_fromFen_idx" ON "FromTo"("fromFen");

-- CreateIndex
CREATE INDEX "FromTo_toFen_idx" ON "FromTo"("toFen");

-- AddForeignKey
ALTER TABLE "Alias" ADD CONSTRAINT "Alias_openingId_fkey" FOREIGN KEY ("openingId") REFERENCES "Opening"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FromTo" ADD CONSTRAINT "FromTo_fromFen_fkey" FOREIGN KEY ("fromFen") REFERENCES "Opening"("fen") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FromTo" ADD CONSTRAINT "FromTo_toFen_fkey" FOREIGN KEY ("toFen") REFERENCES "Opening"("fen") ON DELETE RESTRICT ON UPDATE CASCADE;
