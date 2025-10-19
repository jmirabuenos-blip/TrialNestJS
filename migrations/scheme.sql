create table if not exists users (
    id int auto_increment primary key,
    username varchar(100) not null unique,
    passwordx varchar(255) not null,
    role_ varchar(50) not null default 'user',
    refresh_token varchar(255),
    created_at timestamp default current_timestamp
    updated_at timestamp default current_timestamp on update current_timestamp
);

create table if not exists positions (
    position_id int not null auto_increment primary key,
    position_code varchar(100) not null,
    position_name varchar(300) not null,
    id int not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp on update current_timestamp,
    foreign key (id) references users(id) 
);