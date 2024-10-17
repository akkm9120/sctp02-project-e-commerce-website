CREATE USER 'noname'@'%' IDENTIFIED WITH mysql_native_password BY 'noname1123';

grant all privileges on *.* to 'noname'@'%';

FLUSH PRIVILEGES;

CREATE DATABASE organic;