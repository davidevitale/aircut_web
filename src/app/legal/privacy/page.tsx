import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Informativa sul trattamento dei dati personali di AirCut.",
};

const h2: React.CSSProperties = {
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  marginTop: 40,
  marginBottom: 12,
};
const p: React.CSSProperties = {
  color: "var(--text-secondary)",
  lineHeight: 1.65,
  marginTop: 12,
  fontSize: 16,
};

export default function PrivacyPage() {
  return (
    <PageShell glow={false} maxWidth={760}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
        Privacy Policy
      </h1>
      <p style={{ ...p, color: "var(--text-tertiary)", fontSize: 14, marginTop: 8 }}>
        Ultimo aggiornamento: giugno 2026
      </p>

      <p style={p}>
        La presente informativa descrive come AirCut (il
        &ldquo;Titolare&rdquo;) tratta i dati personali degli utenti, in
        conformità al Regolamento (UE) 2016/679 (&ldquo;GDPR&rdquo;) e alla
        normativa italiana applicabile.
      </p>

      <h2 style={h2}>1. Titolare del trattamento</h2>
      <p style={p}>
        Titolare del trattamento è AirCut. Per ogni richiesta relativa ai dati
        personali è possibile contattare il Titolare all&rsquo;indirizzo
        aircut.team@gmail.com.
      </p>

      <h2 style={h2}>2. Dati trattati</h2>
      <p style={p}>
        Trattiamo i dati che l&rsquo;utente fornisce in fase di registrazione e
        utilizzo del Servizio: nome, cognome, nome del salone o attività,
        indirizzo email e/o numero di telefono, contenuti del portfolio caricati
        dal professionista, nonché dati tecnici di navigazione (ad esempio
        indirizzo IP, tipo di dispositivo e identificativi di sessione) raccolti
        automaticamente per il funzionamento e la sicurezza del Servizio.
      </p>

      <h2 style={h2}>3. Finalità e basi giuridiche</h2>
      <p style={p}>
        I dati sono trattati per: (a) creare e gestire l&rsquo;account ed erogare
        il Servizio (esecuzione del contratto); (b) gestire pagamenti e
        adempimenti fiscali (obbligo legale); (c) garantire la sicurezza della
        piattaforma e prevenire abusi (legittimo interesse); (d) inviare
        comunicazioni di servizio e, previo consenso, comunicazioni promozionali
        (consenso). Il conferimento dei dati necessari all&rsquo;erogazione del
        Servizio è obbligatorio: in mancanza non è possibile utilizzare AirCut.
      </p>

      <h2 style={h2}>4. Modalità del trattamento e conservazione</h2>
      <p style={p}>
        I dati sono trattati con strumenti informatici, adottando misure tecniche
        e organizzative adeguate a proteggerli. Conserviamo i dati per il tempo
        necessario alle finalità indicate e, comunque, per i termini previsti
        dagli obblighi di legge; al termine i dati vengono cancellati o resi
        anonimi.
      </p>

      <h2 style={h2}>5. Comunicazione e fornitori terzi</h2>
      <p style={p}>
        Per erogare il Servizio ci avvaliamo di fornitori che agiscono come
        responsabili del trattamento, tra cui provider di hosting e
        autenticazione, processori di pagamento e strumenti di prenotazione
        collegati dal professionista. Tali soggetti trattano i dati per nostro
        conto e secondo le nostre istruzioni. I dati non sono diffusi né ceduti a
        terzi per finalità proprie senza base giuridica.
      </p>

      <h2 style={h2}>6. Trasferimenti extra UE</h2>
      <p style={p}>
        Qualora alcuni fornitori trattino dati al di fuori dello Spazio Economico
        Europeo, il trasferimento avviene nel rispetto del GDPR, mediante
        decisioni di adeguatezza o clausole contrattuali standard approvate dalla
        Commissione Europea.
      </p>

      <h2 style={h2}>7. Diritti dell&rsquo;interessato</h2>
      <p style={p}>
        L&rsquo;utente può in ogni momento esercitare i diritti di accesso,
        rettifica, cancellazione, limitazione, portabilità e opposizione, nonché
        revocare il consenso prestato. Le richieste possono essere inviate a
        aircut.team@gmail.com. L&rsquo;utente ha inoltre diritto di proporre
        reclamo al Garante per la protezione dei dati personali.
      </p>

      <h2 style={h2}>8. Cookie</h2>
      <p style={p}>
        Il sito utilizza cookie tecnici necessari al funzionamento e, previo
        consenso, cookie analitici o di profilazione. L&rsquo;utente può gestire
        le preferenze tramite le impostazioni del proprio browser o
        l&rsquo;apposito banner, ove presente.
      </p>

      <h2 style={h2}>9. Modifiche</h2>
      <p style={p}>
        La presente informativa può essere aggiornata. La versione vigente è
        sempre disponibile su questa pagina con l&rsquo;indicazione della data di
        ultimo aggiornamento.
      </p>
    </PageShell>
  );
}
