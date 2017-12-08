nicobot-persistence API
===================

L'API est une API REST, chaque requete ou réponse est en JSON. Elle est composée actuellement de 2 services : **Messages** et **Links**.

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

Ce service permet de récupérer une liste de scores pour le HGT.

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

#### Récuperation des scores

Ce service est disponible en plusieurs variantes pour coller aux cas d'utilisation principaux.

##### Récupération des scores de la semaine courante

> GET /scores/{channel}

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

##### Récupération des scores pour une année

> GET /scores/{channel}/{year}

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

##### Récupération des scores pour une semaine

> GET /scores/{channel}/{year}/{week}

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