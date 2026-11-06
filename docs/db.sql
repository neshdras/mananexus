-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.tournaments (
  id_tournament bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_tournament character varying NOT NULL,
  format_tournament character varying,
  ranking_tournament ARRAY,
  fk_id_user bigint,
  date_tournament timestamp with time zone NOT NULL,
  price_tournament text NOT NULL,
  ctc_tournament smallint NOT NULL,
  location_tournament text NOT NULL,
  description_tournament text,
  max_place_tournament bigint,
  open_tournament boolean NOT NULL DEFAULT true,
  fk_id_game bigint NOT NULL,
  CONSTRAINT tournaments_pkey PRIMARY KEY (id_tournament),
  CONSTRAINT tournaments_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.users(id_user),
  CONSTRAINT tournaments_fk_id_game_fkey FOREIGN KEY (fk_id_game) REFERENCES public.games(id_game)
);
CREATE TABLE public.roles (
  id_role bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_role character varying NOT NULL,
  CONSTRAINT roles_pkey PRIMARY KEY (id_role)
);
CREATE TABLE public.users (
  id_user bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  firstname_user character varying NOT NULL,
  lastname_user character varying NOT NULL,
  pseudo_user character varying UNIQUE,
  email_user character varying NOT NULL UNIQUE,
  password_user character varying NOT NULL,
  picture_user character varying,
  victorypts_user bigint DEFAULT '0'::bigint,
  token_password_forget text,
  CONSTRAINT users_pkey PRIMARY KEY (id_user)
);
CREATE TABLE public.users_has_roles (
  fk_id_user bigint NOT NULL,
  fk_id_role bigint NOT NULL,
  CONSTRAINT users_has_roles_pkey PRIMARY KEY (fk_id_user, fk_id_role),
  CONSTRAINT users_has_roles_fk_id_role_fkey FOREIGN KEY (fk_id_role) REFERENCES public.roles(id_role),
  CONSTRAINT users_has_roles_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.users(id_user)
);
CREATE TABLE public.tournaments_has_players (
  fk_id_tournament bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  fk_id_player bigint NOT NULL,
  CONSTRAINT tournaments_has_player_fk_id_player_fkey FOREIGN KEY (fk_id_player) REFERENCES public.users(id_user),
  CONSTRAINT tournaments_has_player_fk_id_tournament_fkey FOREIGN KEY (fk_id_tournament) REFERENCES public.tournaments(id_tournament)
);
CREATE TABLE public.tournaments_has_judge (
  fk_id_tournament bigint NOT NULL,
  fk_id_user bigint NOT NULL,
  CONSTRAINT tournaments_has_judge_fk_id_tournament_fkey FOREIGN KEY (fk_id_tournament) REFERENCES public.tournaments(id_tournament),
  CONSTRAINT tournaments_has_judge_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.users(id_user)
);
CREATE TABLE public.games (
  id_game bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  name_game character varying NOT NULL UNIQUE,
  CONSTRAINT games_pkey PRIMARY KEY (id_game)
);
CREATE TABLE public.decklists (
  fk_id_user bigint NOT NULL,
  fk_id_game bigint NOT NULL,
  name_decklist text NOT NULL,
  format_decklist text NOT NULL,
  url_decklist text NOT NULL,
  id_decklist bigint NOT NULL,
  CONSTRAINT decklists_pkey PRIMARY KEY (id_decklist),
  CONSTRAINT decklists_fk_id_user_fkey FOREIGN KEY (fk_id_user) REFERENCES public.users(id_user),
  CONSTRAINT decklists_fk_id_game_fkey FOREIGN KEY (fk_id_game) REFERENCES public.games(id_game)
);