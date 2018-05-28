CREATE TABLE user(
    idUser      INT             PRIMARY KEY,
    email       VARCHAR(320)    NOT NULL UNIQUE,
    password    VARCHAR(128)    NOT NULL,
    salt        VARCHAR(128)    NOT NULL,
    isAdmin     CHAR(1)         NOT NULL
);
CREATE TABLE request(
    idRequest   INTEGER     PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    idUser      INTEGER,
    FOREIGN KEY(idUser) REFERENCES user(idUser)
);
