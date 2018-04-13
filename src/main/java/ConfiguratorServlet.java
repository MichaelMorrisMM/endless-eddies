import javax.json.Json;
import javax.json.JsonReader;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/configurator")
public class ConfiguratorServlet extends HttpServlet {

    public static final String ROOT_PATH = "C:\\endless-eddies";
    public static final String CONFIG_FILE_PATH = ROOT_PATH + "\\config.json";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpUtil.doGetSetup(response);

        ConfigSettings config = getCurrentConfig();

        HttpUtil.printJSONResponse(response, config.getConfig());
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpUtil.doPostSetup(response);

        ConfigSettings config = getCurrentConfig();
        try (JsonReader reader = Json.createReader(request.getReader())) {
            config.updateWithConfig(reader.readObject());
        }

        File root = new File(ROOT_PATH);
        root.mkdirs();
        File configFile = new File(CONFIG_FILE_PATH);
        configFile.createNewFile();

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(CONFIG_FILE_PATH))) {
            writer.write(config.getConfig().toString());
        }

        HttpUtil.printPOSTResult(response, true);
    }

    private static ConfigSettings getCurrentConfig() throws FileNotFoundException {
        File configFile = new File(CONFIG_FILE_PATH);
        if (configFile.exists()) {
            return new ConfigSettings(configFile);
        } else {
            return new ConfigSettings();
        }
    }
}
