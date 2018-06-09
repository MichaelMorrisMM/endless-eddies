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

    private static ConfigSettings currentConfig;

    public static final String ENV_VAR_CONFIG_DIR = "ENDLESS_EDDIES_CONFIG_DIR";
    public static final String ROOT_PATH = System.getenv(ENV_VAR_CONFIG_DIR);
    public static final String CONFIG_FILE_PATH = ROOT_PATH + File.separator + "config.json";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ConfigSettings config = getCurrentConfig();
        HttpUtil.printJSONResponse(response, config.getConfig());
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        User user = SessionManager.checkAdminSession(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "Invalid permissions");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

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

        HttpUtil.printPOSTResult(response, true, "");
    }

    public static ConfigSettings getCurrentConfig() throws FileNotFoundException {
        if (ConfiguratorServlet.currentConfig != null) {
            return ConfiguratorServlet.currentConfig;
        } else {
            File configFile = new File(CONFIG_FILE_PATH);
            ConfigSettings config;
            if (configFile.exists()) {
                config = new ConfigSettings(configFile);
            } else {
                config = new ConfigSettings();
            }
            ConfiguratorServlet.currentConfig = config;
            return config;
        }
    }
}
