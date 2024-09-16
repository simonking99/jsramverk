# SSR Editor

Starter project for DV1677 JSRamverk

Steg vi fick gå igenom för att få applikationen att fungera.

Steg 1: Installera dotenv
Installera dotenv för att hantera miljövariabler:
    npm install dotenv

Steg 2: Skapa en miljövariabelfil
Skapa en .env-fil i projektets rotmapp:
    touch .env

Vi la till följande rad i .env-filen för att definiera porten, 
eftersom den var undefined när vi körde node app.mjs:
    PORT=3000

Steg 3: Skapa databastabellen
För att skapa tabellen documents i SQLite:
Öppna SQLite3 och skapa databasen:
    sqlite3 db/docs.sqlite

Kontrollera om tabellen documents finns:
    .tables

Om tabellen documents inte finns, skapa den genom att köra SQL-kommandot:
    .read db/migrate.sql

---------------------------------
Vi har valt att använda oss av frontend ramverked React

Refaktorering