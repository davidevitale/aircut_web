import type { Metadata } from "next";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = {
  title: "Termini di servizio",
  description: "Termini e condizioni d'uso della piattaforma AirCut.",
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

export default function TerminiPage() {
  return (
    <PageShell glow={false} maxWidth={760}>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
        Termini di servizio
      </h1>
      <p style={{ ...p, color: "var(--text-tertiary)", fontSize: 14, marginTop: 8 }}>
        Ultimo aggiornamento: giugno 2026
      </p>

      <h2 style={h2}>1. Oggetto e accettazione</h2>
      <p style={p}>
        I presenti Termini di servizio (i &ldquo;Termini&rdquo;) regolano
        l&rsquo;accesso e l&rsquo;utilizzo della piattaforma AirCut (il
        &ldquo;Servizio&rdquo;), erogata tramite sito web e applicazioni mobili.
        Creando un account o utilizzando il Servizio, l&rsquo;utente dichiara di
        aver letto, compreso e accettato integralmente i presenti Termini. Se non
        si accettano i Termini, non è consentito utilizzare il Servizio.
      </p>

      <h2 style={h2}>2. Descrizione del Servizio</h2>
      <p style={p}>
        AirCut è una piattaforma di visual discovery che consente ai
        professionisti del settore beauty (parrucchieri, nail artist, tatuatori,
        makeup artist e figure affini) di pubblicare un portfolio dei propri
        lavori e di rendersi reperibili dai potenziali clienti. AirCut non
        eroga direttamente i servizi di acconciatura o estetica, non gestisce gli
        appuntamenti per conto dei professionisti e non interviene nel flusso di
        pagamento tra professionista e cliente. Le prenotazioni avvengono tramite
        i sistemi gestionali di terze parti scelti dal professionista.
      </p>

      <h2 style={h2}>3. Registrazione e account</h2>
      <p style={p}>
        Per accedere alle funzionalità riservate è necessario registrare un
        account fornendo dati veritieri, accurati e aggiornati. L&rsquo;utente è
        responsabile della riservatezza delle proprie credenziali e di ogni
        attività svolta tramite il proprio account. È necessario avere almeno 18
        anni e, per i professionisti, disporre dei titoli e delle autorizzazioni
        previsti dalla normativa per l&rsquo;esercizio della propria attività.
      </p>

      <h2 style={h2}>4. Abbonamento, prezzi e recesso</h2>
      <p style={p}>
        L&rsquo;utilizzo professionale del Servizio è soggetto a un abbonamento a
        pagamento secondo i piani indicati nella pagina Prezzi. È previsto un
        primo periodo di prova gratuito; al termine, salvo disdetta,
        l&rsquo;abbonamento si rinnova automaticamente al canone vigente.
        L&rsquo;utente può disdire in qualsiasi momento dalle impostazioni
        dell&rsquo;account; la disdetta ha effetto al termine del periodo già
        pagato. Si applicano i diritti di recesso previsti dal Codice del Consumo
        ove l&rsquo;utente agisca come consumatore.
      </p>

      <h2 style={h2}>5. Contenuti dell&rsquo;utente</h2>
      <p style={p}>
        L&rsquo;utente è l&rsquo;unico responsabile dei contenuti che pubblica
        (foto, testi, descrizioni). Pubblicando contenuti, l&rsquo;utente dichiara
        di esserne titolare o di avere ottenuto tutte le autorizzazioni
        necessarie, comprese le liberatorie delle persone ritratte, e concede ad
        AirCut una licenza non esclusiva, gratuita e revocabile a ospitare e
        mostrare tali contenuti ai fini del funzionamento del Servizio.
      </p>

      <h2 style={h2}>6. Condotte vietate</h2>
      <p style={p}>
        È vietato caricare contenuti illeciti, ingannevoli, diffamatori, lesivi
        di diritti altrui o di proprietà intellettuale di terzi, nonché
        utilizzare il Servizio per finalità diverse da quelle consentite, tentare
        di comprometterne la sicurezza o aggirarne le limitazioni. AirCut si
        riserva di rimuovere contenuti e di sospendere o chiudere account in caso
        di violazione.
      </p>

      <h2 style={h2}>7. Limitazione di responsabilità</h2>
      <p style={p}>
        Il Servizio è fornito &ldquo;così com&rsquo;è&rdquo;. AirCut non
        garantisce la qualità, la puntualità o l&rsquo;esito delle prestazioni
        erogate dai professionisti, né è parte del rapporto tra professionista e
        cliente. Nei limiti consentiti dalla legge, AirCut non risponde dei danni
        indiretti, consequenziali o di perdita di profitto derivanti
        dall&rsquo;uso del Servizio.
      </p>

      <h2 style={h2}>8. Modifiche ai Termini</h2>
      <p style={p}>
        AirCut può aggiornare i presenti Termini per esigenze normative,
        tecniche o operative. Le modifiche sostanziali saranno comunicate con
        ragionevole preavviso. L&rsquo;uso continuato del Servizio dopo
        l&rsquo;entrata in vigore delle modifiche ne comporta l&rsquo;accettazione.
      </p>

      <h2 style={h2}>9. Legge applicabile e foro</h2>
      <p style={p}>
        I presenti Termini sono regolati dalla legge italiana. Per le
        controversie con utenti consumatori è competente il foro del luogo di
        residenza o domicilio del consumatore; negli altri casi si applica il
        foro indicato nella documentazione contrattuale di AirCut.
      </p>

      <h2 style={h2}>10. Contatti</h2>
      <p style={p}>
        Per qualsiasi richiesta relativa ai presenti Termini è possibile
        scrivere a aircut.team@gmail.com.
      </p>
    </PageShell>
  );
}
