CREATE TABLE todo_list (
	id SERIAL PRIMARY KEY,
	task VARCHAR(255) NOT NULL,
	details VARCHAR(255),
	complete BOOLEAN NOT NULL DEFAULT FALSE,
	due_date TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'GMT+10')
);

INSERT INTO todo_list ( task, details, due_date)
VALUES 
('Finish Weekend Project', 'Try not to burn yourself out!', '2020-07-05 17:00:00+0'),
('Brush Teeth', 'and put the cap back on', '2020-07-05 07:30:00+0'),
('Take Shower', 'Do you really need a reminder for this?', '2020-07-05 08:00:40+0'),
('Make Tea', 'It helps wake me up', '2020-07-05 08:45:00+0'),
('Attend Class', 'So many things to learn', '2020-07-10 09:00:00+0'),
('Visit The Family', 'While maintaining social distances', '2020-07-12 14:00:00+0'),
('Graduate from Prime', 'I hope', '2020-09-18 17:00:00+0'),
('Find a Job!', 'Somewhere cool', '2020-09-19 08:00:00+0');
