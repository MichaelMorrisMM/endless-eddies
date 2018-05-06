import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

public class HttpUtil {

    private static final boolean ALLOW_CORS_LOCALHOST = true;
    private static final String LOCALHOST_DEV_SERVER = "http://localhost:4200";

    private static final String CONTENT_TYPE_MIME_JSON = "application/json";

    public static void doGetSetup(HttpServletResponse response) {
        setCORSHeaders(response);
    }

    public static void doPostSetup(HttpServletResponse response) {
        setCORSHeaders(response);
    }

    private static void setCORSHeaders(HttpServletResponse response) {
        if (ALLOW_CORS_LOCALHOST) {
            response.setHeader("Access-Control-Allow-Origin", LOCALHOST_DEV_SERVER);
            response.setHeader("Vary", "Origin");
        }
    }

    public static void printJSONResponse(HttpServletResponse response, JsonObject o) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_JSON);
        try (PrintWriter out = response.getWriter()) {
            out.print(o.toString());
        }
    }

    public static void printJSONArray(HttpServletResponse response, JsonArray a) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_JSON);
        try (JsonWriter writer = Json.createWriter(response.getWriter())) {
            writer.writeArray(a);
        }
    }

    public static void printPOSTResult(HttpServletResponse response, boolean result, String message) throws IOException {
        printJSONResponse(response, Json.createObjectBuilder().add("success", result).add("message", message).build());
    }

}
