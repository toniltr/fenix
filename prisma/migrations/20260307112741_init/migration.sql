-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "passwordHash" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Auth" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'LOCAL',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "providerUserId" TEXT,
    "sessionId" TEXT,
    "refreshTokenHash" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "lastLoginAt" DATETIME,
    "expiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Auth_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Story" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'PRIVATE',
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "authorId" INTEGER NOT NULL,
    "startRoomId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Story_startRoomId_fkey" FOREIGN KEY ("startRoomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL DEFAULT 0,
    "storyId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Room_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RoomConnection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "fromRoomId" INTEGER NOT NULL,
    "toRoomId" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'DOOR',
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isOneWay" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "RoomConnection_fromRoomId_fkey" FOREIGN KEY ("fromRoomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomConnection_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Actor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'NPC',
    "description" TEXT,
    "metadata" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "x" REAL NOT NULL DEFAULT 0,
    "y" REAL NOT NULL DEFAULT 0,
    "z" REAL NOT NULL DEFAULT 0,
    "roomId" INTEGER NOT NULL,
    "ownerId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Actor_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Actor_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_uuid_key" ON "User"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_uuid_idx" ON "User"("uuid");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_uuid_key" ON "Auth"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_sessionId_key" ON "Auth"("sessionId");

-- CreateIndex
CREATE INDEX "Auth_uuid_idx" ON "Auth"("uuid");

-- CreateIndex
CREATE INDEX "Auth_userId_idx" ON "Auth"("userId");

-- CreateIndex
CREATE INDEX "Auth_provider_idx" ON "Auth"("provider");

-- CreateIndex
CREATE INDEX "Auth_status_idx" ON "Auth"("status");

-- CreateIndex
CREATE INDEX "Auth_sessionId_idx" ON "Auth"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Story_uuid_key" ON "Story"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_uuid_idx" ON "Story"("uuid");

-- CreateIndex
CREATE INDEX "Story_slug_idx" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_authorId_idx" ON "Story"("authorId");

-- CreateIndex
CREATE INDEX "Story_visibility_idx" ON "Story"("visibility");

-- CreateIndex
CREATE INDEX "Story_status_idx" ON "Story"("status");

-- CreateIndex
CREATE INDEX "Story_startRoomId_idx" ON "Story"("startRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Room_uuid_key" ON "Room"("uuid");

-- CreateIndex
CREATE INDEX "Room_uuid_idx" ON "Room"("uuid");

-- CreateIndex
CREATE INDEX "Room_storyId_idx" ON "Room"("storyId");

-- CreateIndex
CREATE INDEX "Room_storyId_orderIndex_idx" ON "Room"("storyId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Room_storyId_slug_key" ON "Room"("storyId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "RoomConnection_uuid_key" ON "RoomConnection"("uuid");

-- CreateIndex
CREATE INDEX "RoomConnection_uuid_idx" ON "RoomConnection"("uuid");

-- CreateIndex
CREATE INDEX "RoomConnection_fromRoomId_idx" ON "RoomConnection"("fromRoomId");

-- CreateIndex
CREATE INDEX "RoomConnection_toRoomId_idx" ON "RoomConnection"("toRoomId");

-- CreateIndex
CREATE INDEX "RoomConnection_fromRoomId_toRoomId_idx" ON "RoomConnection"("fromRoomId", "toRoomId");

-- CreateIndex
CREATE UNIQUE INDEX "Actor_uuid_key" ON "Actor"("uuid");

-- CreateIndex
CREATE INDEX "Actor_uuid_idx" ON "Actor"("uuid");

-- CreateIndex
CREATE INDEX "Actor_roomId_idx" ON "Actor"("roomId");

-- CreateIndex
CREATE INDEX "Actor_ownerId_idx" ON "Actor"("ownerId");

-- CreateIndex
CREATE INDEX "Actor_kind_idx" ON "Actor"("kind");

-- CreateIndex
CREATE INDEX "Actor_roomId_x_y_z_idx" ON "Actor"("roomId", "x", "y", "z");
