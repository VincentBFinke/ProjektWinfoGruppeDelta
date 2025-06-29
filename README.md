# Vertrieb gebrauchter Mietfahrzeuge

 * [Einleitung](#einleitung)
 * [Installation](#installation)
 * [Dokumentation](#dokumentation)
 * [Kontakt](#kontakt)

### Einleitung

Dieses Repository befasst sich mit der Implementierung des Geschäftsanwendungsfalls Vertrieb gebrauchter Mietfahrzeuge. Das Team Delta hat sich dabei mit folgenden Aufgaben beschäftigt:

- Zusammenstellen der zu verkaufenden Gebrauchtwagen 
- Fahrzeugbestand in einer Datenbank bereitstellen
- Fahrzeugsuche ermöglichen auf Basis von Fahrzeugdaten (z.B. Hersteller, Modell, Laufleistung)
- Fahrzeugdaten auf Website darstellen 
- Kunden ermöglichen ein Fahrzeug anhand von Filteroptionen zu suchen
- Besichtigungstermin/Probefahrt vereinbaren und Kfz-Reservierung ermöglichen
- Registierung für Privat und Geschäftskunden
- Interessendaten erfassen
- Bestätigungs-Mail versenden
- Kaufvertrag erstellen/verwalten ermöglichen
- Zusatzdienste bereitstellen
- Berechnung von Finanzierung-/Leasingangebot ermöglichen
- Zulassungsservice bereitstellen
- Inzahlungnahme Altfahrzeug zur Verfügung stellen

### Installation
1. Öffne VS Code.
2. Öffne das Terminal
3. Navigiere zu dem Ordner, in dem das Repo gespeichert werden soll, z. B.: cd ~/Projekte
4. Gib folgenden Befehl ein: git clone https://github.com/VincentBFinke/ProjektWinfoGruppeDelta.git
5. Nach dem Klonen kannst du mit cd ProjektWinfoGruppeDelta in das Verzeichnis wechseln und es mit VS Code öffnen: code .
6. Lege im Hauptverzeichnis eine .env Datei an diese ist wichtig um die Verbindung zur Cloud-Datenbank aufzubauen. In der .env Datei musst du folgende Dinge angeben: SUPABASE_URL, 
SUPABASE_SERVICE_ROLE_KEY, und noch Informationen die für den Emailverkehr wichtig sind: MAIL_USER, MAIL_PASS. Informiere dich über diese Daten bei den Gruppenmitgliedern, den solche sensiblen Daten werden nicht in das Repository gepusht.
7. Um den Server für das Backend zu starten müssen wir über das Terminal in das richtige Verzeichnis wechseln. Gib im Terminal folgenden Befehl ein: cd ~/ProjektWinfoGruppeDelta/Backend/JS
8. Nachdem du zu dem richtigen Verzeichnis gewechselt hast kannst du folgenden Befehl eingeben: node server.js damit wird der Server gestartet. Im Terminal wirst du danach auch folgendes sehen: ✅ Mit Supabase API verbunden! Das bedeutet das die Verbindung zur Cloud-Datenbank erfolgreich war.
9. Rufe nun im Browser deiner Wahl http://localhost:3000/HTML/startseite.html auf. Damit bist du bereit um unsere lokale Website zu testen. 

### Dokumentation

#### Vollständige Google Drive Doku
- [Google Drive Doku](https://drive.google.com/drive/folders/1MOl6QTZShQ1kk49Gw6CPmpiOLa-Y1eEr?usp=drive_link)


#### Auftrag
- [Projektauftrag](https://docs.google.com/document/d/1RJYmHdSS7uipclAmnLHuTl3D00bsDbuW/edit?usp=sharing&ouid=115149592471075868606&rtpof=true&sd=true)

#### Protokolle
- [Projektlogbuch](https://docs.google.com/document/d/1lckQGwNmpxYp5VJi59bl4Lx1EI_gwjuK_noElvqAvOE/edit?usp=sharing)
- [DokumentationKI](https://drive.google.com/file/d/1qSPqgGoSndy8treM0wpK9PHJiPEsBfis/view?usp=sharing)
- [Dokumentation von Testszenarien](https://drive.google.com/file/d/1seH8WRbJ6FO8YoRT2hE9C3R4qqp9PMdy/view?usp=sharing)
- [Gantt-Diagramm](https://docs.google.com/spreadsheets/d/1jGHK-UEN9nJeG0R-hBegbMNlgJatOJsdK-O2wkysXik/edit?usp=sharing)
- [Risikoreporting](https://drive.google.com/file/d/1DnpNrkLNoT-rb2wyDqRrvp-94K7XsBNZ/view?usp=sharing)
- [Kostenreporting](https://drive.google.com/file/d/1Z6AQEMtNbe5_ZPVDgpHcg24NCrapMcL7/view?usp=sharing)

#### Produktdemo
- [Produktdemo](https://drive.google.com/file/d/12iDVlGZoZeuSKprOB0tC59OVDAGdpnDc/view?usp=sharing)

#### Supabase Cloud‑Datenbank auf Basis von PostgreSQL
- [Datenbank Schema](https://drive.google.com/file/d/1xiOuKCsT0W3P1VvIgjZp-cBFzYyRuYZv/view?usp=sharing)


### Kontakt

- Lukas Eisner
<br>Projektleiter, Front- und Backend Entwickler
<br>lukas.eisner@studmail.w-hs.de

- Vincent Bernhard Finke
<br>Projektmitarbeiter,Frontend Entwickler
<br>vincent.b.finke@studmail.w-hs.de

- Alex Franz
<br>Projektmitarbeiter, Front- und Backend Entwickler
<br>alex.franz@studmail.w-hs.de

- Umut Patir
<br>Protokollführer, Frontend Entwickler
<br>umut.patir@studmail.w-hs.de

- Rajen Rafik
<br>Projektmitarbeiter, Frontend Entwicklerin
<br>rajen.rafik@studmail.w-hs.de

- Bernd Wiederuh
<br>Moderator, Front- und Backend Entwickler
<br>bernd.wiederuh@studmail.w-hs.de






 




 
