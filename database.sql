CREATE TABLE todo_list (
	id SERIAL PRIMARY KEY,
	task VARCHAR(255) NOT NULL,
	details VARCHAR(255),
	complete BOOLEAN NOT NULL DEFAULT FALSE,
	due_date TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO todo_list ( task, details, due_date)
VALUES 
('Brush Teeth', 'Teeth gonna SPARKLE', '2020-07-06 20:38:40'),
('Take Shower', 'Gotta be FRESH!', '2020-07-07 20:38:40'),
('Get Dressed', 'Gonna look FLY!', '2020-07-16 20:38:40')
