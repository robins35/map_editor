require_relative './map_editor'
require_relative './my_haml'
require 'sprockets'
require 'sprockets/es6'
require 'pry'

map "/javascripts" do
  run Rack::File.new(File.expand_path('assets/javascripts/bundle.js'))
end

#\ -p 8080
use MyHaml
use Rack::Static, urls: ["/public"], root: "public", index: "index.html.haml"
run MapEditor.new
