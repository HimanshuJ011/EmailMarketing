-- CreateTable
CREATE TABLE "trackings" (
    "id" TEXT NOT NULL,
    "opens" INTEGER NOT NULL DEFAULT 0,
    "userIps" TEXT,

    CONSTRAINT "trackings_pkey" PRIMARY KEY ("id")
);
