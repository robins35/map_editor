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

        # column_lengths = []
        File.open(map_path, 'w') do |file|
          map_json =  { layout: layout }.to_json
          file.write map_json
          # layout.each do |column|
          #   column_lengths << column.length
          #   file.write "#{column.join(',')}\n"
          # end
        end

        response_data = { map_id: map_id }.to_json
        response = Rack::Response.new(response_data,
                                      status,
                                      "Content-Type" => "application/json")
        response.finish
      elsif request.get?
        if $1.nil?
          map_names = Dir.glob("#{map_dir}*").
            sort_by { |path| path.scan(/\d+/)[-1].to_i }.
            map { |path| path.split(File::SEPARATOR).last }

          map_data = map_names.map do |map_name|
            {
              text: map_name,
              unique_id: map_name.scan(/\d+/)[-1].to_i
            }
          end


          response_data = { map_data: map_data }.to_json
        else
          map_id = $1
          map_path = "#{map_dir}map#{map_id}"

          response_data = File.read(map_path)
        end
        response = Rack::Response.new(response_data,
                                      200,
                                      "Content-Type" => "application/json")
        response.finish
      end
    else
      Rack::File.new(File.expand_path('public')).call(env)
    end
  end
end
