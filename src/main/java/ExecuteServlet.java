import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonReader;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@WebServlet("/execute")
public class ExecuteServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
        if (user == null) {
            HttpUtil.printPOSTResult(response, false, "No user session");
            return;
        }
        if (!SessionManager.checkXSRFToken(request)) {
            HttpUtil.printPOSTResult(response, false, "Invalid XSRF token");
            return;
        }

        ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
        JsonObject requestObject;
        try (JsonReader reader = Json.createReader(request.getReader())) {
            requestObject = reader.readObject();
        }
        Application application = config.getApplication(Util.getStringSafe(requestObject, ConfigSettings.TARGET_APPLICATION));

        if (requestObject != null && application != null) {
            List<Input> inputs = new ArrayList<>();
            for (Parameter param : application.getParameters()) {
                inputs.add(new Input(param, requestObject));
            }

            String requestName;
            if (user.isGuest) {
                requestName = "guest_" + UUID.randomUUID().toString().replace("-", "");
            } else {
                requestName = "" + user.idUser + "_" + UUID.randomUUID().toString().replace("-", "");
            }
            File tmpDir = new File(
                ConfiguratorServlet.ROOT_PATH
                    + File.separator
                    + requestName
            );
            tmpDir.mkdir();

            File inFile = new File(tmpDir, GetRequestServlet.IN_FILE);
            inFile.createNewFile();
            File outFile = new File(tmpDir, GetRequestServlet.OUT_FILE);
            outFile.createNewFile();
            File errorFile = new File(tmpDir, GetRequestServlet.ERROR_FILE);
            errorFile.createNewFile();
            File applicationDefinitionFile = new File(tmpDir, GetRequestServlet.APPLICATION_DEFINITION_FILE);
            applicationDefinitionFile.createNewFile();

            try {
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(applicationDefinitionFile))) {
                    writer.write(application.toJsonObject().toString());
                }

                Command command = new Command(application.command, inputs);
                Process process = command.execute(inFile, outFile, errorFile, tmpDir);
                process.waitFor();

                if (user.isGuest) {
                    DatabaseConnector.createNewGuestRequest(requestName, user.idGuest);
                } else {
                    DatabaseConnector.createNewRequest(requestName, user.idUser);
                }

                HttpUtil.printPOSTResult(response, true, "");
            } catch (Exception e) {
                HttpUtil.printPOSTResult(response, false, "");
            }
        } else {
            HttpUtil.printPOSTResult(response, false, "");
        }
    }

}
