# map_editor
A game map editor in the browser

On Linux:

Install gems: bundle

Install node: apt-get install nodejs

Install npm: apt-get install npm

npm install

Due to a bug in npm, you may have to install a certain version of ajv to get the warnings to go away: npm i ajv@6.0.0

--------------------

To build/bundle es6 to javascript: `npm run build`

or run `npm start` if you want it to watch your files and build with each channge.

Run the rack server with (rerun is optional, I use it for dev): `rerun rackup config.ru -o 0.0.0.0`
