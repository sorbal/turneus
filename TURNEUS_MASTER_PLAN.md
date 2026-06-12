TURNEUS PRO - MASTER PLAN v1.0

==================================================
SCOP
==================================================

Turneus este o platforma nationala pentru organizarea si administrarea turneelor recreative.

Platforma trebuie construita pentru:
- Web
- Android
- iPhone

Arhitectura trebuie construita API Ready pentru aplicatia mobila viitoare.

==================================================
JOCURI SUPORTATE
==================================================

- Remi
- Table
- FIFA
- Pescuit

Platforma trebuie construita astfel incat sa permita adaugarea altor jocuri in viitor fara modificari majore.

==================================================
ROLURI
==================================================

1. PLAYER
2. ORGANIZER
3. ADMIN

==================================================
PLAYER
==================================================

- crea cont
- edita profil
- incarca avatar
- inscrie la turnee
- plati online
- vedea clasamente
- vedea istoric participari
- vedea puncte si badge-uri

==================================================
ORGANIZER
==================================================

- crea turnee
- edita turnee proprii
- administra participanti
- introduce rezultate
- genera bracket
- vedea incasari
- vedea comisionul propriu
- administra sponsori proprii

Organizatorul trebuie aprobat de Admin.

==================================================
ADMIN
==================================================

- utilizatori
- organizatori
- jocuri
- orase
- turnee
- plati
- clasamente
- badge-uri
- reclame
- sponsori
- rapoarte

==================================================
PAGINI PUBLICE
==================================================

- Acasa
- Turnee
- Turneu
- Clasamente
- Jucatori
- Profil Jucator
- Orase
- Pagina Oras
- Arhiva Turnee
- Regulamente
- Contact

==================================================
TURNEE
==================================================

Fiecare turneu va avea:

- nume
- joc
- oras
- locatie
- organizator
- data
- ora
- taxa participare
- numar locuri
- participanti
- status
- rezultate
- clasament final

==================================================
REGULAMENT REMI
==================================================

Turneul se joaca exclusiv in sistem Remi pe tabla, fara etalare initiala.

La fiecare masa participa fix 4 jucatori.

La fiecare masa se disputa 10 jocuri.

Dupa cele 10 jocuri:
- primii 2 jucatori cu cel mai mare punctaj se califica mai departe
- ultimii 2 sunt eliminati

Regula obligatorie la inchidere:

Un jucator nu are voie sa inchida daca nu are simultan:
- cel putin o terta
- cel putin o suita

Daca un jucator inchide fara sa respecte regula:
- inchiderea este invalida
- ceilalti jucatori primesc cate 1 punct
- se incepe un nou joc

Punctaj joc Remi:

- 1 punct daca jucatorul castiga cu joker in combinatii
- 2 puncte daca jucatorul castiga fara joker pe tabla
- 3 puncte daca jucatorul inchide cu joker pe liber

Se puncteaza doar castigatorul fiecarui joc.

Ceilalti jucatori primesc 0 puncte.

Clasamentul la masa:

- se calculeaza dupa total puncte acumulate
- in caz de egalitate merge mai departe cel cu mai multe inchideri cu joker
- daca timpul nu permite, decide organizatorul

Fair-play:

Este interzis:
- intarzierea intentionata
- aratarea pieselor altor jucatori
- indicatiile
- intelegerile intre jucatori
- uitatul in piesele primite sau date

Tentativa de trisat duce la eliminare directa.

Comportamentul neadecvat duce la:
- avertisment
- eliminare

Decizia organizatorului este finala.

==================================================
SISTEM FINANCIAR
==================================================

Fond total = Taxa participare x Numar participanti

Distributie:

- Fond premii = 70%
- Organizator = 20%
- Platforma Turneus = 10%

Toate platile sunt procesate prin Turneus.

Platforma calculeaza automat:
- fondul de premiere
- comisionul organizatorului
- comisionul platformei

==================================================
PREMII
==================================================

Din fondul de premii:

- Locul 1 = 50%
- Locul 2 = 30%
- Locul 3 = 20%

==================================================
PLATI
==================================================

- Netopia
- plati online
- confirmare automata
- istoric tranzactii
- facturare in versiuni viitoare

==================================================
CLASAMENTE
==================================================

Clasamente:

- National
- Pe Oras
- Pe Joc
- All-Time

==================================================
SISTEM PUNCTE SI SEZOANE
==================================================

Punctele se calculeaza pe sezoane anuale.

Exemple:
- Clasament 2025
- Clasament 2026
- Clasament 2027
- All-Time

Fiecare jucator va avea:

- puncte totale All-Time
- puncte pe anul curent
- puncte pe fiecare an anterior
- pozitie nationala anuala
- pozitie pe oras anuala
- pozitie pe joc anuala

La finalul fiecarui an se acorda:

- Campion National al Anului
- Campion pe Oras
- Campion pe Joc
- Organizatorul Anului

Clasamentele anuale raman arhivate permanent.

==================================================
SISTEM PUNCTE OFICIAL TURNEUS REMI
==================================================

Punctele de la masa de Remi sunt folosite pentru calificarea din masa si pentru statistici.

Clasamentul oficial Turneus este bazat pe performanta in turneu.

Punctaj oficial:

- Participare la turneu = 5 puncte
- Calificare din grupa/masa = 5 puncte
- Sferturi = 10 puncte
- Semifinale = 15 puncte
- Finala = 20 puncte
- Locul 3 = 30 puncte
- Locul 2 = 40 puncte
- Locul 1 = 60 puncte

Bonusuri:

- Cele mai multe inchideri cu joker = 5 puncte
- Castigator neinvins = 10 puncte
- Turneu cu minimum 32 jucatori = 5 puncte bonus pentru semifinalisti

==================================================
SEPARARE STATISTICI VS CLASAMENT
==================================================

Statistici Remi:

- puncte la masa
- inchideri totale
- inchideri cu joker
- inchideri fara joker
- inchideri cu joker pe liber
- procent calificare din grupa

Clasament Turneus:

- bazat doar pe performanta in turnee
- participare
- calificari
- semifinale
- finale
- podiumuri
- victorii

Statistica masoara performanta din jocurile individuale.

Clasamentul oficial masoara performanta in turnee.

Toate statisticile si clasamentele sunt disponibile pentru sezonul curent si pentru All-Time.

==================================================
BADGE-URI
==================================================

- Primul Turneu
- 10 Turnee
- 50 Turnee
- 100 Turnee
- Campion Local
- Campion National
- Top 10 National
- Campionul Anului

==================================================
ORGANIZATORI LOCALI
==================================================

Organizatorii locali sunt baza dezvoltarii nationale a platformei.

Flux:

- solicita cont de organizator
- adminul aproba
- poate organiza in unul sau mai multe orase
- poate crea propriile turnee
- poate introduce rezultate
- poate administra sponsori

Fiecare organizator are:

- profil public
- orase active
- istoric turnee
- clasament organizator
- statistici

==================================================
PROFILURI PUBLICE JUCATORI
==================================================

Fiecare jucator va avea profil public propriu.

Exemple URL:

turneus.ro/jucatori/emilian-balan
turneus.ro/jucatori/ion-popescu

Profilul va afisa:

- fotografie
- nume
- oras
- data inscrierii in platforma
- jocuri preferate
- puncte all-time
- puncte pe anul curent
- clasament national
- clasament pe oras
- clasament pe joc

Statistici:

- turnee jucate
- turnee castigate
- podiumuri
- victorii
- procent victorii

Trofee:

- Campion National
- Campion Local
- Campionul Anului
- Badge-uri speciale

Istoric:

- toate turneele la care a participat
- rezultatele obtinute
- punctele castigate

SEO:

Fiecare profil este indexabil si are URL propriu.

==================================================
PROFILURI PUBLICE ORGANIZATORI
==================================================

Fiecare organizator va avea profil public.

Exemplu:

turneus.ro/organizatori/nume-organizator

Profilul va afisa:

- fotografie/logo
- orase active
- numar turnee organizate
- participanti totali
- rating
- sponsori
- turnee viitoare
- turnee finalizate

==================================================
PAGINI SEO AUTOMATE
==================================================

Platforma genereaza automat pagini pentru:

- jocuri
- orase
- jucatori
- organizatori
- turnee

Exemple:

turneus.ro/remi
turneus.ro/table
turneus.ro/fifa
turneus.ro/pescuit

turneus.ro/orase/braila
turneus.ro/orase/galati

turneus.ro/jucatori/emilian-balan

turneus.ro/organizatori/nume-organizator

turneus.ro/turnee/campionatul-brailei-remi-2026

==================================================
MODUL RECLAME
==================================================

Platforma va avea spatii de reclama administrabile din panoul Admin.

Tipuri:

- banner homepage
- banner turnee
- banner clasamente
- banner oras
- banner joc
- banner profil jucator
- banner turneu

Adminul poate:

- adauga reclama
- edita reclama
- sterge reclama
- activa reclama
- dezactiva reclama
- seta perioada
- seta link
- seta pozitie

Targetare:

- global
- oras
- joc
- turneu
- organizator

Statistici:

- afisari
- click-uri
- CTR

==================================================
SPONSORI
==================================================

Turneele pot avea sponsori.

Sponsorii pot fi:

- sponsor platforma
- sponsor organizator
- sponsor turneu

Pot avea:

- logo
- website
- banner
- pagina dedicata

==================================================
NOTIFICARI
==================================================

Platforma va avea sistem de notificari pentru jucatori, organizatori si admin.

Tipuri notificari:

- inscriere confirmata
- plata confirmata
- turneu incepe in 10 zile
- turneu incepe in 2 zile
- turneu incepe in 24h
- turneu incepe in 1h
- calificare in etapa urmatoare
- rezultate publicate
- castig premiu

Notificarile trebuie pregatite pentru:

- notificari in platforma
- email
- notificari mobile push in aplicatia viitoare

==================================================
COMUNITATE
==================================================

Platforma va avea sistem de comentarii.

Comentarii disponibile la:

- turneu
- profil jucator
- profil organizator

Comentariile pot fi moderate de admin.

Adminul poate:

- sterge comentarii
- ascunde comentarii
- bloca utilizatori care abuzeaza

==================================================
CONT UNIC TURNEUS
==================================================

Fiecare utilizator are un singur cont Turneus.

Acelasi cont poate participa la:

- Remi
- Table
- FIFA
- Pescuit
- alte jocuri viitoare

Fiecare joc are:

- clasament propriu
- statistici proprii
- puncte proprii
- campioni proprii

Profilul jucatorului afiseaza:

- clasament general Turneus
- clasament Remi
- clasament Table
- clasament FIFA
- clasament Pescuit

==================================================
DATE CONT JUCATOR
==================================================

Date obligatorii:

- nume si prenume
- username
- email
- telefon
- oras
- data nasterii

Date optionale:

- poza profil
- bio scurt
- jocuri preferate

Public pe profil se afiseaza doar datele permise de utilizator si informatiile relevante pentru competitie.

==================================================
STRUCTURA TURNEELOR
==================================================

Turneele folosesc etape personalizate.

Fiecare turneu poate avea una sau mai multe etape.

Exemple etape:

- Grupe
- Mese
- Optimi
- Sferturi
- Semifinale
- Finala
- Clasament final

Aceasta structura permite adaptarea platformei pentru:

- Remi
- Table
- FIFA
- Pescuit
- jocuri viitoare

Fiecare etapa poate avea reguli proprii, participanti proprii si rezultate proprii.

==================================================
APLICATIE MOBILA
==================================================

Platforma trebuie construita astfel incat toate functiile sa poata fi utilizate ulterior intr-o aplicatie React Native / Expo.

Android si iPhone trebuie sa foloseasca aceeasi baza de date si acelasi API.

==================================================
REGULA IMPORTANTA
==================================================

Orice functionalitate noua trebuie adaugata mai intai in acest document inainte de implementare.

MASTER PLAN-ul reprezinta documentul oficial de dezvoltare al platformei Turneus.
