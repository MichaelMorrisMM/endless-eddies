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

    public static QueueManager queueManager = new QueueManager();

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
        if (StorageManager.userStorageLimitExceeded(user)) {
            HttpUtil.printPOSTResult(response, false, "Storage limit exceeded. Please delete previous request(s) before submitting a new one");
            return;
        }

        try {
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

                Command command = new Command(inputs, application, requestName, user);

                if (ExecuteServlet.queueManager.tryAddingCommand(command)) {
                    ExecuteServlet.queueManager.initiate();
                    HttpUtil.printPOSTResult(response, true, requestName);
                } else {
                    HttpUtil.printPOSTResult(response, false, "Execution queue is temporarily full, please try again later");
                }
            } else {
                HttpUtil.printPOSTResult(response, false, "");
            }
        } catch (Exception e) {
            HttpUtil.printPOSTResult(response, false, "An error occurred");
        }
    }

}
