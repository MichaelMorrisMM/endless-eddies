import javax.json.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;

public class Graph {

    public JsonArray results;

    Graph(String requestName, GraphTemplate template) {
        this.results = Json.createArrayBuilder().build();
        File file = new File(ConfiguratorServlet.ROOT_PATH + File.separator + requestName + File.separator + template.filename);
        if (file.exists() && file.isFile() && file.canRead()) {
            try (JsonReader reader = Json.createReader(new FileReader(file))) {
                results = reader.readArray();
            } catch (FileNotFoundException e) {
            }
        }
    }

}
