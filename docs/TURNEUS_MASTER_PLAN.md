# TURNEUS - MASTER PLAN

Ultima actualizare: 2026-07-02

## SCOP

Turneus este o platformă pentru organizarea, administrarea și promovarea turneelor recreative și competiționale.

Platforma trebuie să permită:
- creare turnee
- înscriere jucători
- plăți online
- administrare rezultate
- clasamente
- profiluri jucători
- profiluri organizatori
- notificări
- sponsori
- reclame
- aplicație mobilă viitoare

## BRAND

Numele oficial este:

Turneus

Nu se mai folosește numele:

Turneus Pro

Excepție:
- commit-uri istorice
- referințe vechi din istoricul proiectului

## PLATFORME

Turneus trebuie construit pentru:

- Web
- Android
- iPhone

Aplicația mobilă viitoare va folosi aceeași bază de date și același API.

## STACK PRINCIPAL

- Next.js 16
- React 19
- PostgreSQL 16
- Prisma 7
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide Icons
- React Native / Expo pentru mobile

## JOCURI SUPORTATE

Inițial:

- Remi
- Table
- FIFA
- Pescuit

Platforma trebuie construită astfel încât să permită adăugarea altor jocuri fără rescriere majoră.

## ROLURI

### PLAYER

Poate:
- crea cont
- edita profil
- încărca avatar
- se înscrie la turnee
- plăti online
- vedea clasamente
- vedea istoricul participărilor
- vedea puncte și badge-uri

### ORGANIZER

Poate:
- solicita cont de organizator
- crea turnee după aprobare
- administra turnee proprii
- administra participanți
- introduce rezultate
- genera etape / bracket
- vedea încasări
- vedea comisionul propriu
- administra sponsori proprii

Organizatorul trebuie aprobat de Admin.

### ADMIN

Poate administra:
- utilizatori
- organizatori
- jocuri
- orașe
- locații
- turnee
- plăți
- clasamente
- badge-uri
- reclame
- sponsori
- rapoarte
- comentarii
- notificări

## PAGINI PUBLICE

- Acasă
- Turnee
- Detalii turneu
- Clasamente
- Jucători
- Profil jucător
- Organizatori
- Profil organizator
- Orașe
- Pagina orașului
- Arhivă turnee
- Regulamente
- Contact

## TURNEE

Fiecare turneu are:

- nume
- joc
- oraș
- locație
- organizator
- dată
- oră
- taxă participare
- număr locuri
- participanți
- status
- rezultate
- clasament final

## STRUCTURA TURNEELOR

Turneele folosesc etape personalizate.

Exemple:

- Grupe
- Mese
- Optimi
- Sferturi
- Semifinale
- Finală
- Clasament final

Structura trebuie să fie flexibilă pentru:
- Remi
- Table
- FIFA
- Pescuit
- jocuri viitoare

## REGULAMENT REMI

Turneul se joacă în sistem Remi pe tablă, fără etalare inițială.

La fiecare masă participă fix 4 jucători.

La fiecare masă se dispută 10 jocuri.

După cele 10 jocuri:
- primii 2 jucători cu cel mai mare punctaj se califică mai departe
- ultimii 2 sunt eliminați

Regula obligatorie la închidere:

Un jucător nu are voie să închidă dacă nu are simultan:
- cel puțin o terță
- cel puțin o suită

Dacă un jucător închide fără să respecte regula:
- închiderea este invalidă
- ceilalți jucători primesc câte 1 punct
- se începe un nou joc

Punctaj joc Remi:

- 1 punct dacă jucătorul câștigă cu joker în combinații
- 2 puncte dacă jucătorul câștigă fără joker pe tablă
- 3 puncte dacă jucătorul închide cu joker pe liber

Se punctează doar câștigătorul fiecărui joc.

Ceilalți jucători primesc 0 puncte.

Clasamentul la masă:
- se calculează după total puncte acumulate
- în caz de egalitate merge mai departe cel cu mai multe închideri cu joker
- dacă timpul nu permite, decide organizatorul

Fair-play:

Este interzis:
- întârzierea intenționată
- arătarea pieselor altor jucători
- indicațiile
- înțelegerile între jucători
- uitatul în piesele primite sau date

Tentativa de trișat duce la eliminare directă.

Comportamentul neadecvat duce la:
- avertisment
- eliminare

Decizia organizatorului este finală.

## SISTEM FINANCIAR

Fond total = Taxă participare x Număr participanți

Distribuție:

- Fond premii: 70%
- Organizator: 20%
- Platformă Turneus: 10%

Toate plățile sunt procesate prin Turneus.

Platforma calculează automat:
- fondul de premiere
- comisionul organizatorului
- comisionul platformei

## PREMII

Din fondul de premii:

- Locul 1: 50%
- Locul 2: 30%
- Locul 3: 20%

## PLĂȚI

Inițial:
- Netopia

Viitor:
- Stripe
- facturare
- istoric tranzacții
- rapoarte financiare

## CLASAMENTE

Clasamente:

- Național
- Pe oraș
- Pe joc
- Pe sezon
- All-Time

## SEZOANE

Platforma funcționează pe sezoane anuale.

Exemple:
- Sezon 2026
- Sezon 2027
- Sezon 2028

Fiecare sezon are:
- dată început
- dată sfârșit
- clasamente proprii
- campioni proprii
- statistici proprii

La finalul fiecărui sezon:
- se arhivează clasamentele
- se declară campionii sezonului
- începe sezon nou

Clasamentul All-Time rămâne separat și se actualizează permanent.

## SISTEM PUNCTE OFICIAL

Punctaj oficial Turneus:

- Participare la turneu: 5 puncte
- Calificare din grupă / masă: 5 puncte
- Sferturi: 10 puncte
- Semifinale: 15 puncte
- Finală: 20 puncte
- Locul 3: 30 puncte
- Locul 2: 40 puncte
- Locul 1: 60 puncte

Bonusuri:

- Cele mai multe închideri cu joker: 5 puncte
- Câștigător neînvins: 10 puncte
- Turneu cu minimum 32 jucători: 5 puncte bonus pentru semifinaliști

## STATISTICI VS CLASAMENT

Statistici Remi:
- puncte la masă
- închideri totale
- închideri cu joker
- închideri fără joker
- închideri cu joker pe liber
- procent calificare din grupă

Clasament Turneus:
- participare
- calificări
- semifinale
- finale
- podiumuri
- victorii
- puncte oficiale

Statistica măsoară performanța din jocurile individuale.

Clasamentul oficial măsoară performanța în turnee.

## BADGE-URI

Inițial:

- Primul Turneu
- 10 Turnee
- 50 Turnee
- 100 Turnee
- Campion Local
- Campion Național
- Top 10 Național
- Campionul Anului

## ORGANIZATORI

Organizatorii locali sunt baza dezvoltării naționale a platformei.

Flux:

- solicită cont de organizator
- adminul aprobă
- poate organiza în unul sau mai multe orașe
- poate crea propriile turnee
- poate introduce rezultate
- poate administra sponsori

Fiecare organizator are:
- profil public
- orașe active
- istoric turnee
- clasament organizator
- statistici

## PROFILURI PUBLICE JUCĂTORI

Fiecare jucător are profil public.

Profilul afișează:
- fotografie
- nume
- oraș
- data înscrierii
- jocuri preferate
- puncte All-Time
- puncte sezon curent
- clasament național
- clasament pe oraș
- clasament pe joc

Statistici:
- turnee jucate
- turnee câștigate
- podiumuri
- victorii
- procent victorii

Istoric:
- turnee la care a participat
- rezultate
- puncte câștigate

## PROFILURI PUBLICE ORGANIZATORI

Fiecare organizator are profil public.

Profilul afișează:
- fotografie / logo
- orașe active
- număr turnee organizate
- participanți totali
- rating
- sponsori
- turnee viitoare
- turnee finalizate

## PAGINI SEO AUTOMATE

Platforma generează automat pagini pentru:
- jocuri
- orașe
- jucători
- organizatori
- turnee

Exemple:
- /remi
- /table
- /fifa
- /pescuit
- /orase/braila
- /orase/galati
- /jucatori/nume-jucator
- /organizatori/nume-organizator
- /turnee/nume-turneu

## RECLAME

Platforma are spații de reclamă administrabile din Admin Panel.

Tipuri:
- banner homepage
- banner turnee
- banner clasamente
- banner oraș
- banner joc
- banner profil jucător
- banner turneu

Targetare:
- global
- oraș
- joc
- turneu
- organizator

Statistici:
- afișări
- click-uri
- CTR

## SPONSORI

Sponsorii pot fi:
- sponsor platformă
- sponsor organizator
- sponsor turneu

Pot avea:
- logo
- website
- banner
- pagină dedicată

## NOTIFICĂRI

Platforma va avea notificări pentru:
- jucători
- organizatori
- admini

Tipuri:
- înscriere confirmată
- plată confirmată
- turneu începe în 10 zile
- turneu începe în 2 zile
- turneu începe în 24h
- turneu începe în 1h
- calificare etapă următoare
- rezultate publicate
- premiu câștigat

Canale:
- platformă
- email
- push mobile

## COMUNITATE

Platforma are sistem de comentarii.

Comentarii disponibile la:
- turneu
- profil jucător
- profil organizator

Adminul poate:
- șterge comentarii
- ascunde comentarii
- bloca utilizatori care abuzează

## CONT UNIC

Fiecare utilizator are un singur cont Turneus.

Acel cont poate participa la:
- Remi
- Table
- FIFA
- Pescuit
- jocuri viitoare

Fiecare joc are:
- clasament propriu
- statistici proprii
- puncte proprii
- campioni proprii

## DATE CONT JUCĂTOR

Obligatorii:
- nume
- prenume
- username
- email
- telefon
- oraș
- data nașterii

Opționale:
- poză profil
- bio scurt
- jocuri preferate

Pe profilul public se afișează doar datele permise și informațiile relevante pentru competiție.

## APLICAȚIE MOBILĂ

Platforma trebuie construită API-ready.

Aplicația mobilă viitoare:
- React Native
- Expo
- Android
- iPhone

Android și iPhone folosesc aceeași bază de date și același API.

## REGULĂ IMPORTANTĂ

Orice funcționalitate nouă se adaugă mai întâi în documentație înainte de implementare.

Master Plan-ul reprezintă documentul oficial de dezvoltare al platformei Turneus.
