nicobot-persistence API
===================

L'API est une API REST, chaque requete ou réponse est en JSON. Elle est composée actuellement de 3 services : **Messages**, **Links** et **Scores**.

## Authentification
Pour utiliser l'API, il faut être authentifié. Pour ce faire, il faut ajouter un paramètre `token` dans l'URL de toutes les requetes.

> GET /messages?token=\<TOKEN\>&limit=x&start_date=y

## Service Messages

Ce service permet d'ajouter/récupérer une liste de messages.

#### Description d'un message
```javascript
var Message = {
  postedDate : DateTime // (UTC) (ISO 8601),
  username   : String,
  message    : String
}
```
Chaque message est donc composé de 3 champs :
* postedDate : la date et l'heures à laquelle le message a été transmis
* username : le nom de l'utilisateur qui a envoyé le message
* message : le message à proprement parler

#### Récuperation des messages

Ce service permet de retourner les *n* derniers messages enregistrés.

> GET /messages?limit=x&start_date=y

**Paramètres :**
  * `start_date` : à partir de quelle date/heure il faut retourner des messages (Par défaut : `undefined`)
  * `start` : indice de début de la pagination (Par défaut : `0`)
  * `limit` : le nombre maximum de message à retourner (Par défaut : `10`)

Cela signifie donc qu'il y a une double limite pour ce service.

*Exemple :*
  Il y a 15 messages de sauvegardés pour les 5 dernieres minutes.
  Une requete est effectuée avec les paramètres par défaut, alors seul les 10 derniers messages seront retournés.

**Retour du service :**
```javascript
{
  "content" : [
      Message,
      ...
  ],
  "paging" : {
      start: 0,
      limit: 10,
      total: 15
  }
}
```

#### Ajout de message

Ce service permet de sauvegarder 1 ou plusieurs messages.

> POST /messages

**Paramètre :**

  Le corps de la requete est composé d'un tableau `messages` qui contient le ou les messages à ajouter.

```javascript
  {
    "messages" : [
        Message1,
        Message2
    ]
  }
```

## Service Links

  Ce service permet d'ajouter/récupérer un lien.

#### Description d'un lien
```javascript
var Link = {
  link  : String,
  count : int
}
```
Chaque lien est donc composé de 2 champs :
* link : le lien
* count : le nombre de fois qu'il a déjà été partagé

#### Récuperation d'un lien

Ce service permet de savoir si un lien a déjà été partagé et si oui, de savoir le nombre de fois qu'il l'a été

> GET /links?link=x

**Paramètres :**
  * `link` : le lien complet (avec le http://)

**Retour du service :**
```javascript
{
  "content" : [
      Link
  ]
}
```

#### Ajout/mise à jour d'un lien

Ce service permet de sauvegarder 1 lien. Si le lien est déjà présent son compteur de partage est augmenté de 1.

> POST /messages

**Paramètre :**

  Le corps de la requete est composé d'un objet `link` qui contient le lien à ajouter.

```javascript
  {
    "link" : "http://www.google.com"
  }
```

**Retour du service :**
```javascript
{
  "content" : [
      Link
  ]
}
```

## Service Scores

Plusieurs services de _scoring_ sont disponibles. Pour le moment, seul les services liés au jeu du _Happy Geek Time_ et les _Gommettes_ existent.

### Service Score - Happy Geek Time

Ce service permet de récupérer ou de mettre à jour une liste de scores pour le HGT.

#### Description d'un score
```javascript
var Score = {
  userId : string,
  score  : integer
}
```
Chaque score est donc composé de 2 champs :
* userId : un identifiant unique d'utilisateur
* score : le nombre de point de l'utilisateur sur la semaine (ou l'année)

#### Récuperation des scores _Happy Geek Time_

Ce service est disponible en plusieurs variantes pour coller aux cas d'utilisation principaux.
Quelque soit le cas d'utilisation le retour sera trié par ordre décroissant de score.

#### Récupération des scores HGT de la semaine courante

> GET /scores/hgt/{channel}

**Paramètres :**
  * `channel` : l'identifiant unique du channel pour lequel il faut récupérer les scores

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```

#### Récupération des scores HGT pour une année

> GET /scores/hgt/{channel}/{year}

**Paramètres :**
  * `channel` : l'identifiant unique du channel pour lequel il faut récupérer les scores
  * `year` : l'année (AAAA) pour laquelle il faut récupérer le score des utilisateurs

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```

##### Récupération des scores HGT pour une semaine

> GET /scores/hgt/{channel}/{year}/{week}

**Paramètres :**
  * `channel` : l'identifiant unique du channel pour lequel il faut récupérer les scores
  * `year` : l'année (AAAA)
  * `week` : le numéro de la semaine (entre 1 et 52)

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```
##### Ajout de score au HGT

Ce service permet de sauvegarder 1 point pour la semaine courante pour un ou plusieurs utilisateurs.

> POST /scores/hgt/{channel}

**Paramètres :**

  * `channel` : l'identifiant unique du channel pour lequel il faut ajouter les scores

Le corps de la requete est composé d'un tableau `users` qui contient le ou les utilisateurs dont le score doit etre augmenté de 1 point.

```javascript
  {
    "users" : [
        userId1,
        userId2
    ]
  }
```

### Service Score - Gommettes

Ce service permet de récupérer un score de Gommettes (calculé suivant le nombre de gommettes vertes et rouges) et d'ajouter une gommette.

#### Description d'un score
```javascript
var Score = {
  userId     : string,
  redCount   : integer,
  greenCount : integer,
  score      : integer
}
```
Chaque score est donc composé de 5 champs :
* userId : un identifiant unique d'utilisateur
* redCount : le nombre de gommettes rouges reçues dans la période choisie
* greenCount : le nombre de gomettes vertes reçues dans la période
* score : le calcul pondéré suivant le nombre de gommettes reçues (une gommette verte = 2 points, une rouge = -1 point)

#### Description d'une gommette
```javascript
var Gommette = {
  userId       : string,
  giverId      : string,
  reason       : string,
  type         : integer,
  yesCount     : integer,
  noCount      : integer,
  creationDate : DateTime, // (UTC) (ISO 8601)
  valid        : boolean
}
```
Chaque gommette est donc composée de 8 champs :
* userId : un identifiant unique d'utilisateur qui reçoit la gommette
* giverId : un identifiant unique d'utilisateur qui donne la gommettechoisie
* type : une valeur indiquant quelle gommette donner:
  * 0 = rouge
  * 1 = verte
* yesCount : le nombre de personnes ayant validé la gommette
* noCount : le nombre de personnes ayant refusé de mettre la gommette
* creationDate : La date et heure à laquelle à été assignée la gommette
* valid : indique si la gommette est acceptée ou non (suffisamment de votes pour). Seules les gommettes ayant valid=true sont comptées dans le score.

#### Récuperation des scores _Gommettes_

Ce service est disponible en plusieurs variantes pour coller aux cas d'utilisation principaux.
Quelque soit le cas d'utilisation le retour sera trié par ordre décroissant de score.

#### Récupération des scores Gommettes de l'année courante

> GET /scores/gommettes

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```

#### Récupération des scores Gommettes pour une année

> GET /scores/gommettes/{year}

**Paramètres :**
  * `year` : l'année (AAAA) pour laquelle il faut récupérer le score des utilisateurs

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```

#### Récupération des scores Gommettes pour une année et un utilisateur en particulier

> GET /scores/gommettes/{year}/{userId}

**Paramètres :**
  * `year` : l'année (AAAA)
  * `userId` : l'identifiant de l'utilisateur pour lequel on souhaite lire le score

**Retour du service :**
```javascript
{
  "scores" : [
      Score,
      ...
  ]
}
```
##### Ajout d'une gommette

Ce service permet de sauvegarder une gommette pour un utilisateur. Les infos requises sont volontairement plus complètes, elles seront récupérables via des services créés ultérieurement.

> POST /scores/gommettes

**Paramètres :**

Le corps de la requete est composé d'un objet `gommette` qui contient les informations nécessaires pour ajouter un élément.

```javascript
  {
    "gommette" : Gommette
  }
```

## Developpement

* pré-requis: `docker`, `docker-compose`

Un fichier `docker-compose.yml` est présent et permet de démarrer un environnement de développement. voici une petite liste des commandes qu'il est possible d'utiliser pour utiliser le conteneur. Ces commandes sont à exécuter dans le dossier.

* `dc up -d` : démarre l'api et sa base de données. Les tables et une clé api (`dev`) est créée au premier démarrage (via le fichier `dbinit.sql`).
* `dc rm mysql` (et `dc rm api`): supprimer les images pour les recréer au prochain démarrage. Utile en cas de modification de la structure de la base de données (via le fichier `dbinit.sql`).

Par défaut, l'api sera accessible sur l'ip suivante: `http://localhost:9080`. Il est possible de développer sans redémarrer.
Il est possible également de se connecter sur la base de données sur le port `9306` et en utilisant les identifiants disponibles dans `mysql.env`.
