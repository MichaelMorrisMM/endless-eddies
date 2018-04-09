import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;

@WebServlet("/configurator")
public class ConfiguratorServlet extends HttpServlet {

    private static final String CONFIG_FILE_PATH = "C:/endless_eddies_config/config.json";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpUtil.doGetSetup(response);

        ConfigSettings config;
        File configFile = new File(CONFIG_FILE_PATH);
        if (configFile.exists()) {
            config = new ConfigSettings(configFile);
        } else {
            config = new ConfigSettings();
        }

        HttpUtil.printJSONResponse(response, config.getConfig());
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpUtil.doPostSetup(response);

        HttpUtil.printPOSTResult(response, true);
    }
}
