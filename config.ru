require_relative './lib/middleware/map_editor'
require_relative './lib/middleware/my_haml'
require 'sass/plugin/rack'
require 'pry'


#\ -p 8080
use MyHaml
use Sass::Plugin::Rack
use Rack::Static, urls: ["/public"], root: "public", index: "index.html.haml"
run MapEditor.new

map "/javascript" do
  run Rack::File.new(File.expand_path('dist/'))
end
