CREATE TABLE user(
    userId      INT             PRIMARY KEY,
    email       VARCHAR(320)    NOT NULL UNIQUE,
    password    VARCHAR(1000)   NOT NULL,
    salt        VARCHAR(1000)   NOT NULL
);
CREATE TABLE request(
    requestId   INTEGER     PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    userId      INTEGER,
    FOREIGN KEY(userId) REFERENCES user(userId)
);
