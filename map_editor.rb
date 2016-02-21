require 'pry'
require 'rack/file'

class MapEditor
  def call env
    # request = Rack::Request.new(env)

    # res = Rack::Response.new
    # case "#{request.request_method}"
    # when 'POST'
    #   res.write "Hello chagne!"
    # else
    #   res.write "NO ROUTE"
    # end
    # res.finish
    Rack::File.new(File.expand_path('public')).call(env)
  end
end
