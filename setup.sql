CREATE USER 'foo'@'%' IDENTIFIED WITH mysql_native_password BY 'bar';

grant all privileges on *.* to 'foo'@'%';

FLUSH PRIVILEGES;

CREATE DATABASE organic;