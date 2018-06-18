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
      end
    when '/maps'
      if request.post?
        layout = JSON.parse(request.params["layout"])

        map_dir = "public/maps/"
        Dir.mkdir(map_dir) unless File.exists?(map_dir)

        last_map = Dir.glob("#{map_dir}*").sort.last
        map_name = last_map.nil? ? "#{map_dir}map0" : "#{map_dir}map#{last_map[-1].to_i + 1}"

        column_lengths = []
        File.open(map_name, 'w') do |file|
          layout.each do |column|
            column_lengths << column.length
            file.write "#{column.join(',')}\n"
          end
        end

        response.finish
      end
    else
      Rack::File.new(File.expand_path('public')).call(env)
    end
  end
end
