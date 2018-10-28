import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.nio.file.Files;

public class HttpUtil {

    private static final String CONTENT_TYPE_MIME_JSON = "application/json";

    public static void printJSONResponse(HttpServletResponse response, JsonObject o) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_JSON);
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            out.print(o.toString());
        }
    }

    public static void printJSONArray(HttpServletResponse response, JsonArray a) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_JSON);
        response.setCharacterEncoding("UTF-8");
        try (JsonWriter writer = Json.createWriter(response.getWriter())) {
            writer.writeArray(a);
        }
    }

    public static void printPOSTResult(HttpServletResponse response, boolean result, String message) throws IOException {
        printJSONResponse(response, Json.createObjectBuilder()
            .add("success", result)
            .add("message", message)
            .build());
    }

    public static void printPOSTResult(HttpServletResponse response, User user, String message) throws IOException {
        printJSONResponse(response, Json.createObjectBuilder()
            .add("success", true)
            .add("message", message)
            .add("user", user.toJsonObject())
            .build());
    }

    public static void downloadFile(HttpServletResponse response, File file) throws IOException {
        response.setContentType(Files.probeContentType(file.toPath()));
        response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"");
        response.setContentLength((int) file.length());
        try (OutputStream out = response.getOutputStream()) {
            try (FileInputStream in = new FileInputStream(file)) {
                byte[] buffer = new byte[4096];
                int length;
                while ((length = in.read(buffer)) > 0) {
                    out.write(buffer, 0, length);
                }
            }
            out.flush();
        }
    }

    public static User checkForUserSessionAllowingForGuest(HttpServletRequest request) throws IOException {
        ConfigSettings config = ConfiguratorServlet.getCurrentConfig();
        User user = SessionManager.checkSession(request);
        if (user == null && config.allowGuestMode) {
            user = SessionManager.checkGuestSession(request);
        }
        return user;
    }

}
