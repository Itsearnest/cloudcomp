## Heroku: 
[Link zum laufenden App](https://cloud-comp.herokuapp.com)  
Benötigt das [Buildpack für Node.js](https://elements.heroku.com/buildpacks/heroku/heroku-buildpack-nodejs), welches man zum App hinzufügen muss.

## Datenbank:  
Postgres
Anmeldedaten [hier](./app/config/dbconfig.json)  
  
Create Table Statement: 
```SQL  
CREATE TABLE snippets(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  author TEXT NOT NULL,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  tags TEXT[]
);
```
