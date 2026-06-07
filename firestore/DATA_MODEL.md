# Modello dati — Firestore

Single source of truth condivisa con l'app mobile. Collezione: `profiles`,
documento per professionista, **id documento = Firebase Auth uid**.

## profiles/{uid}

| Campo | Tipo | Note |
|---|---|---|
| `first_name` | string | obbligatorio |
| `last_name` | string | obbligatorio |
| `salon_name` | string | obbligatorio |
| `contact_method` | string | `'email'` o `'phone'` |
| `email` | string \| null | presente se contact_method = email |
| `phone` | string \| null | E.164, presente se contact_method = phone |
| `trial_started_at` | timestamp | impostato alla creazione |
| `trial_ends_at` | timestamp | created_at + 30 giorni |
| `subscription_status` | string | `trialing` \| `active` \| `past_due` \| `canceled` \| `expired` |
| `stripe_customer_id` | string \| null | popolato dal webhook |
| `stripe_subscription_id` | string \| null | popolato dal webhook |
| `current_period_end` | timestamp \| null | fine periodo pagato |
| `created_at` | timestamp | serverTimestamp |

## Sicurezza (firestore.rules)

- L'utente **legge solo** `profiles/{suo_uid}`.
- L'utente puo aggiornare **solo i dati anagrafici**; i campi di trial e billing
  sono bloccati dal client e scritti **solo dal server** (Admin SDK).
- `create`/`delete` lato client: vietati. La creazione passa da `/api/signup`.

## Logica di accesso (sito + app)

```
accesso_consentito =
   (subscription_status == 'active')
OR (subscription_status == 'trialing' AND trial_ends_at > now())
```

Implementata in `src/lib/access.ts`. L'app mobile applica la stessa regola
leggendo `profiles/{uid}`.
