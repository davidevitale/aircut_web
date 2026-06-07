# AirCut

Sito B2B premium (italiano) il cui unico obiettivo e portare il professionista
beauty a **iscriversi** ed entrare automaticamente nell'**app mobile esistente**,
condividendo la stessa identita.

Stack: **Next.js 14 (App Router) · TypeScript · Tailwind v4 · Motion · Firebase (Auth + Firestore) · Stripe**.

---

## 1. Decisione architetturale

L'app mobile usa **Firebase**, quindi il sito usa **lo stesso progetto Firebase**:

- **Firebase Auth** = identita condivisa (email link / phone OTP). Lo stesso
  identificativo fa entrare il professionista nell'app, senza una seconda
  registrazione.
- **Firestore** (`profiles/{uid}`) = single source of truth per profilo, trial e
  stato abbonamento. L'app legge da qui per decidere l'accesso.
- **Stripe** = pagamento ricorrente €29/mese. Lo stato dell'abbonamento viene
  scritto su Firestore dal webhook.

> Prima del deploy: usare lo **stesso progetto Firebase** dell'app. Aggiungere
> il dominio del sito agli "Authorized domains" in Firebase Auth.

---

## 2. Setup

```bash
npm install
cp .env.example .env.local   # compilare i valori (vedi §4)
npm run dev                  # http://localhost:3000
```

Build di produzione: `npm run build && npm start`.

---

## 3. Firebase

1. **Auth**: abilitare i provider **Email link (passwordless)** e **Phone**.
   - Email link: in Auth > Sign-in method attivare "Email/Password" con l'opzione
     "Email link (passwordless sign-in)".
   - Phone: abilitare e configurare reCAPTCHA (il sito usa reCAPTCHA invisibile).
   - Aggiungere il dominio del sito agli **Authorized domains**.
2. **Firestore**: creare il database e pubblicare le regole da `firestore.rules`.
   ```bash
   firebase deploy --only firestore:rules
   ```
3. **Service account** (Admin SDK): Impostazioni progetto > Account di servizio >
   genera nuova chiave privata. Incollare il JSON in `FIREBASE_SERVICE_ACCOUNT_JSON`
   (oppure usare le tre var separate). Solo lato server.

Modello dati e sicurezza: vedi `firestore/DATA_MODEL.md`.

---

## 4. Variabili d'ambiente

| Variabile | Dove | Note |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | client | config pubblica Firebase (6 valori) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | **solo server** | JSON service account (o le 3 var FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY) |
| `STRIPE_SECRET_KEY` | **solo server** | chiave segreta Stripe |
| `STRIPE_WEBHOOK_SECRET` | **solo server** | verifica firma webhook |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | client | publishable key |
| `STRIPE_PRICE_ID` | server | price ricorrente €29/mese (EUR) |
| `NEXT_PUBLIC_SITE_URL` | client+server | es. https://aircut.app |

Le chiavi segrete non devono **mai** arrivare al client.

---

## 5. Stripe

1. Prodotto **AirCut Pro**, prezzo ricorrente **€29/mese (EUR)** → `STRIPE_PRICE_ID`.
2. Webhook verso `POST /api/webhooks/stripe` con gli eventi:
   `checkout.session.completed`, `customer.subscription.created`,
   `customer.subscription.updated`, `invoice.payment_failed`,
   `customer.subscription.deleted`.
3. Signing secret → `STRIPE_WEBHOOK_SECRET`.

In locale: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.

---

## 6. Trial e accesso (spec §6)

- Iscrizione = **gratis subito**, accesso all'app per **30 giorni**, nessuna carta.
- Pagamento **solo a fine trial**.
- Logica condivisa (`src/lib/access.ts`), identica a quella dell'app:

```
accesso_consentito =
   (status == 'active')
OR (status == 'trialing' AND trial_ends_at > now())
```

Altri stati (`expired`, `past_due`, `canceled`) ⇒ paywall → `/pagamento`.

---

## 7. Flusso

1. `/iscriviti` → `POST /api/signup`: crea utente in Firebase Auth + documento
   `profiles/{uid}` con trial 30 giorni. Poi il client invia email link / OTP SMS.
2. `/verifica` → completa il sign-in Firebase (link email o codice SMS) → `/benvenuto`.
3. A fine trial `/pagamento` → `POST /api/checkout` (con ID token Firebase) →
   Stripe Checkout. Il **webhook** porta `subscription_status` a `active` su Firestore.

---

## 8. Struttura

```
src/
  app/
    page.tsx                 Landing
    iscriviti/ verifica/ benvenuto/ prezzi/ pagamento/ legal/
    api/
      signup/                Firebase Auth + Firestore + trial
      checkout/              Verifica ID token + Stripe Checkout
      webhooks/stripe/       Webhook (firma) → aggiorna Firestore
  lib/
    firebase/client.ts       Firebase client (Auth)
    firebase/admin.ts        Admin SDK (server only)
    stripe.ts                istanza Stripe lazy (server)
    access.ts                logica di accesso condivisa
public/brand/                wordmark.svg, icon.svg, og.png, favicon.png
firestore.rules              security rules
firestore/DATA_MODEL.md      modello dati
```

---

## 9. Placeholder da completare

- URL store app + deep link in `src/app/benvenuto/page.tsx`.
- Email/contatti e social nel footer.
- Testi legali in `src/app/legal/*`.

---

## 10. Note

- Le cartelle `supabase/` e `src/lib/supabase/` sono **deprecate** (residui della
  versione precedente, svuotate). Si possono eliminare a mano dal repo.
- Nessuna integrazione con gestionali esterni: solo la riga di copy
  "Funziona con il gestionale che gia usi". L'app mobile non e in questo repo:
  va solo collegata allo stesso progetto Firebase.
