drop database if exists spotify;
create database spotify;

use spotify;

create table sessions (
	id int auto_increment,
	name varchar(100),
	code char(5),
	primary key (id)
);
