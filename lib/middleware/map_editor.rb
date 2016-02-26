require 'pry-remote'
require 'rack/file'
require 'json'

class MapEditor
  def call env
    request = Rack::Request.new(env)
    response = Rack::Response.new

    case "#{request.path}"
    when '/load_textures'
      response.write Dir.glob("public/images/textures/*").map{|p| p.gsub('public', '')}.to_json
      response.finish
      #binding.remote_pry
    else
      Rack::File.new(File.expand_path('public')).call(env)
    end
  end
end
