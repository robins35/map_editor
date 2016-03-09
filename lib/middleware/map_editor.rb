require 'pry-remote'
require 'rack/file'
require 'json'

class MapEditor
  def call env
    request = Rack::Request.new(env)
    response = Rack::Response.new

    case "#{request.path}"
    when '/load_images'
      if request.get?
        response.write Dir.glob("public/images/*/*").map{|p| p.gsub('public', '')}.to_json
        response.finish
        #binding.remote_pry
      end
    when '/maps'
      if request.post?
        binding.pry
      end
    else
      Rack::File.new(File.expand_path('public')).call(env)
    end
  end
end
