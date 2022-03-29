create TABLE projects(
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  text VARCHAR(255),
  img VARCHAR(255)
);

create TABLE users(
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE,
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  age INTEGER,
  password VARCHAR(255)
);


INSERT INTO projects(title,text,img) VALUES('Spring Security','Protects your application with comprehensive and extensible authentication and authorization support.','https://spring.io/images/projects/spring-security-b712a4cdb778e72eb28b8c55ec39dbd1.svg');