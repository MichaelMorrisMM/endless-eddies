import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/get-request")
public class GetRequestServlet extends HttpServlet {

    public static final String APPLICATION_DEFINITION_FILE = "app_def.txt";
    public static final String IN_FILE = "in.txt";
    public static final String OUT_FILE = "out.txt";
    public static final String ERROR_FILE = "error.txt";

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        JsonObjectBuilder builder = Json.createObjectBuilder();
        User user = HttpUtil.checkForUserSessionAllowingForGuest(request);
        if (user == null) {
            HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "No user session").build());
            return;
        }

        String idRequest = request.getParameter("idRequest");
        if (!Util.isNonEmpty(idRequest)) {
            HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "No idRequest specified").build());
            return;
        }
        int idRequestParsed;
        try {
            idRequestParsed = Integer.parseInt(idRequest);
        } catch (NumberFormatException e) {
            HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "Invalid idRequest").build());
            return;
        }
        if (!DatabaseConnector.doesRequestExist(idRequestParsed)) {
            HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "Request does not exist").build());
            return;
        }

        if (DatabaseConnector.userCanManageRequest(user, idRequestParsed)) {
            try {
                Request userRequest = DatabaseConnector.getRequest(idRequestParsed);
                Application application = getApplicationForRequest(userRequest.name);
                File systemOutFile = new File(ConfiguratorServlet.ROOT_PATH + File.separator + userRequest.name + File.separator + OUT_FILE);
                StringBuilder stringBuilder = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(new FileReader(systemOutFile))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        stringBuilder.append(line);
                        stringBuilder.append(System.lineSeparator());
                    }
                }
                JsonArrayBuilder graphResultsBuilder = Json.createArrayBuilder();
                for (GraphTemplate graphTemplate : application.graphs) {
                    graphResultsBuilder = graphResultsBuilder.add(new Graph(userRequest.name, graphTemplate).results);
                }
                HttpUtil.printJSONResponse(response,
                    builder
                        .add("success", true)
                        .add("message", "Request retrieved successfully")
                        .add("request", userRequest.toJsonObject())
                        .add("application", application.toJsonObject())
                        .add("systemOut", stringBuilder.toString())
                        .add("graphResults", graphResultsBuilder.build())
                        .build());
            } catch (Exception e) {
                HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "An error occurred").build());
            }
        } else {
            HttpUtil.printJSONResponse(response, builder.add("success", false).add("message", "User does not have permission to view request").build());
        }
    }

    public static Application getApplicationForRequest(String requestName) {
        try {
            File applicationDefinition = new File(ConfiguratorServlet.ROOT_PATH + File.separator + requestName + File.separator + APPLICATION_DEFINITION_FILE);
            return new Application(applicationDefinition);
        } catch (Exception e) {
            return null;
        }
    }

}
