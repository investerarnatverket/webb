# Investerarnätverket – webbplatsen

Samlar event från nätverket, Aktiespararna och Unga Aktiespararna. Medlemmar loggar in
och lägger upp event; besökare kan prenumerera på mejl om nya event.

| Del | Tjänst | Varför |
|---|---|---|
| Sajten | Next.js 16 på **Netlify** | Byggs automatiskt vid varje push till GitHub |
| Kod | **GitHub**, privat repo i en organisation för nätverket | Flera kan ta över, ingen hänger på en person |
| Event och medlemmar | **Supabase** (Postgres + inloggning), region EU | Medlemmar loggar in med engångskod, databasens radsäkerhet styr vem som får ändra |
| Mejl | **Resend** | Bekräftelsemejl, inloggningskoder (via SMTP) och utskick till prenumeranter |

## Så hänger det ihop

- **Event** ligger i tabellen `event`. Besökare ser bara publicerade; medlemmar ser även utkast.
  Startsidan och `/event` cachas och töms direkt när en medlem sparar.
- **Medlem** = en rad i `medlemmar`. Alla medlemmar kan lägga till och ta bort andra (inga fasta roller).
  Inloggning sker med en sexsiffrig kod på mejlen, inte en länk: Outlooks Safe Links öppnar länkar
  i förväg och förbrukar dem.
- **Prenumeranter** sparas inte i Supabase. Formuläret skickar ett bekräftelsemejl med en signerad
  länk; först när den klickas läggs adressen in som kontakt i Resend. Utskicken görs sedan i
  Resend under *Broadcasts*, som sköter avregistreringslänken.

```
src/
  app/            sidor: /, /event, /om, /integritet, /logga-in, /medlem/…, /prenumerera/…
  components/     EventLista, Prenumerera
  lib/            event (hämtning + cache), medlem (behörighet), tid (svensk tid), prenumeration (signerade länkar)
  proxy.ts        förnyar inloggningen på /medlem
supabase/migrations/   databasschemat
```

## Komma igång – i den här ordningen

### 1. Domän
Registrera `investerarnatverket.se` (ledig 2026-10-25) hos valfri registrar. Resend kan inte
skicka från en Outlook-adress; avsändaren måste ligga på en egen domän. Outlook-adressen används
som svarsadress (`KONTAKT_EPOST`).

### 2. GitHub
1. Skapa en organisation för nätverket (gratis) och bjud in dem som ska kunna ändra koden.
2. Skapa ett **privat** repo, t.ex. `webb`, och pusha koden:
   ```
   git remote add origin https://github.com/<organisation>/webb.git
   git push -u origin main
   ```

### 3. Supabase
1. Skapa ett projekt, region **Stockholm (eu-north-1)**.
2. *SQL Editor*: kör `supabase/migrations/20261025000000_grund.sql`.
3. *Authentication → Sign In / Providers*: stäng av **Allow new users to sign up**. Konton skapas bara från sajtens medlemssida.
4. *Authentication → Emails → Templates → Magic Link*: byt innehållet så att mejlet visar koden, t.ex.
   `Din inloggningskod till Investerarnätverket: {{ .Token }}` (och ta bort länken).
5. *Authentication → Emails → SMTP Settings*: lägg in Resend (`smtp.resend.com`, port 465, användare `resend`,
   lösenord = en Resend-API-nyckel). Supabases inbyggda mejl går bara till projektets egna teammedlemmar,
   så utan detta får medlemmarna ingen kod.
6. **Första medlemmen** (därefter läggs alla till inifrån sajten): *Authentication → Users → Add user*
   med din e-post och *Auto Confirm*, kopiera användarens id och kör:
   ```sql
   insert into public.medlemmar (id, namn, roll) values ('<id>', 'Ditt Namn', 'Webb');
   ```

### 4. Resend
1. Lägg till domänen och DNS-posterna Resend visar (SPF, DKIM, gärna DMARC) hos registraren.
2. Skapa en API-nyckel med *Full access* (kontakter kräver det).
3. Valfritt: skapa ett segment för prenumeranterna och lägg dess id i `RESEND_SEGMENT_ID`.

### 5. Netlify
1. *Add new project → Import from GitHub* och välj repot. Netlify känner igen Next.js själv.
2. Lägg in alla variabler från `.env.example` under *Environment variables*. `SAJT_URL` = den riktiga adressen.
3. Koppla domänen under *Domain management*.

## Utveckla lokalt

```
cp .env.example .env.local   # fyll i
npm install
npm run dev                  # http://localhost:3000
```

## Kvar att göra före lansering

- [ ] Fyll i personuppgiftsansvarig på `/integritet` och stäm av texten med Aktiespararna.
- [ ] Stäm av med Aktiespararna hur nätverket får beskriva sin koppling till dem, och om deras namn och logotyp får användas.
- [ ] Läs igenom texterna på startsidan och `/om` – de är ett första utkast.
- [ ] Ordmärke eller logotyp för nätverket.
