<h1>FEEDBACK WEB APP</h1>

<span>Applicazione realizzata per riunire tutti i feedback delle compravendite online. Inoltre essendo stata pensata per il collezionismo delle carte da collezione pokemon è stata introdotta una sezione apposita per la ricerca delle carte e del loro valore</span>

<h2>REALIZZAZIONE</h2>

<span>L'applicazione è stata realizzata attraverso il framework expressjs (https://expressjs.com) basato su node (https://nodejs.org/). I dati risiedono all'interno di un database MySql.</span>

<span>Per la ricerca e la valutazione delle carte sono state utilizzate le api fornite da https://pokemontcg.io </sapn>


<h2>INSTALLAZIONE E UTILIZZO</h2>

<span>Attualmente l'applicazione risiede sull'host heroku(https://heroku.com/) ed è accessibile a tutti attraverso l'indirizzo https://feedbackwebapp.herokuapp.com.</span>

<span>Il sistema di autenticazione utilizzato dall'applicazione è quello fornito da facebook, in quanto l'idea dell'applicazione è nata dopo il confronto con gli amministratori di varie community di collezionismo pokemon risiedenti all'interno del social network.</sapn>


<img src="./public/images/login.png" style="width:400px">

<span>Una volta effettuato il login l'utente è automaticamente registrato all'interno della piattaforma e potrà effettuare e/o ricevere feedback e andare a ricercare le carte e il loro valore.</span>

<img src="./public/images/home.png" style="width:400px">

<span>NB: Nella pagina principale l'utente non potrà vedere il prorpio profilo, il quale può essere monitorato nella sezione apposità , raggiungibile attraverso il menù ( cliccando sopra la propria immagine e successivamente sul proprio nominattivo)</span>

<img src="./public/images/paginaPersonale.png" style="width:400px">
<img src="./public/images/profilo.png" style="width:400px">

<span>L'utente potra registrare un feedback (negativo/postivo) riguardo alla compravendita avuta con un utente registrato. Potrà oltre che valutarlo positivamente o negativamente 
registrare una piccola descrizione della trattativa e indicare su quale piattaforma è avvenuta. In questo modo possono essere registrate tutte le trattative avvenute anche su piattaforme diverse da Facebook</span>

<span>Gli utenti possono essere ricercati attraverso la select posta in alto nella home.</span>


<img src="./public/images/ricercautente.png" style="width:400px">
<span>E' presente una pagina dedicata alla visualizzazione dei "Top Seller" cioè di coloro che hanno totalizzato il numero maggiore di feedback positivi.</span>


<span>Una funzionalità sicuramente utile e carina è la possibilità di ricercare le carte riguardanti un pokemon, un set o una specifica espansione</span>
<img src="./public/images/ricercacarte.png" style="width:400px">
<img src="./public/images/dettaglioCarta.png" style="width:400px">

<sapn>All'interno del dettaglio della carta è possibile visualizzare i vari valori forniti dai due principali siti utilizzati per le valutazioni, Cardmarket(https://www.cardmarket.com/it/Pokemon) e TCGPLAYER(https://www.tcgplayer.com) </span>
