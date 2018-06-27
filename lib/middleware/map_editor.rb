require 'pry-remote'
require 'rack/file'
require 'json'

class MapEditor
  def call env
    request = Rack::Request.new(env)

    case "#{request.path}"
    when '/load_images'
      if request.get?
        response = Rack::Response.new
        response.write Dir.glob("public/images/*/*").map{|p| p.gsub('public', '')}.to_json
        response.finish
      end
    # when '/maps'
    when /\/maps\/?(\d+)?/
      map_dir = "public/maps/"
      Dir.mkdir(map_dir) unless File.exists?(map_dir)

      if request.post?
        layout = JSON.parse(request.params["layout"])

        if $1.nil?
          last_map = Dir.glob("#{map_dir}*").sort_by { |path| path.scan(/\d+/)[-1].to_i }.last

          if last_map.nil?
            map_path = "#{map_dir}map0" 
          else
            old_map_id = last_map.scan(/\d+/)[-1].to_i
            map_id = old_map_id + 1
            map_path = last_map.sub(/#{old_map_id}$/, "#{map_id}")
          end

          status = 201
        else
          map_id = $1
          map_path = "#{map_dir}map#{map_id}"
          status = 200
        end

        column_lengths = []
        File.open(map_path, 'w') do |file|
          layout.each do |column|
            column_lengths << column.length
            file.write "#{column.join(',')}\n"
          end
        end

        response_data = { map_id: map_id }.to_json
        response = Rack::Response.new(response_data,
                                      status,
                                      "Content-Type" => "application/json")
        response.finish
      elsif request.get?
        map_names = Dir.glob("#{map_dir}*").
          sort_by { |path| path.scan(/\d+/)[-1].to_i }.
          map { |path| path.split(File::SEPARATOR).last }

        response_data = { map_names: map_names }.to_json
        response = Rack::Response.new(response_data,
                                      200,
                                      "Content-Type" => "application/json")
      end
    else
      Rack::File.new(File.expand_path('public')).call(env)
    end
  end
end
