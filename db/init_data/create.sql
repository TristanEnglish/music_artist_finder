DROP TABLE IF EXISTS search_results CASCADE;
CREATE TABLE IF NOT EXISTS search_results (
  artist_name VARCHAR(200), 
  artist_img VARCHAR(200),
  artist_genre VARCHAR(200),
  artist_country VARCHAR(200),
  artist_biography TEXT,
  id SERIAL PRIMARY KEY
);