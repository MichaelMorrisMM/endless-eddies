DROP TABLE IF EXISTS user;
CREATE TABLE user(
    idUser      INTEGER         PRIMARY KEY,
    email       VARCHAR(320)    NOT NULL UNIQUE,
    password    VARCHAR(100)    NOT NULL,
    salt        VARCHAR(150)    NOT NULL,
    isAdmin     CHAR(1)         NOT NULL
);
DROP TABLE IF EXISTS request;
CREATE TABLE request(
    idRequest   INTEGER         PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    idUser      INTEGER,
    idGuest     INTEGER,
    date        VARCHAR(30)     NOT NULL,
    expiration  INTEGER,
    FOREIGN KEY(idUser) REFERENCES user(idUser)
);
