import javax.json.JsonObject;
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

    private static void setCORSHeaders(HttpServletResponse response) {
        if (ALLOW_CORS_LOCALHOST) {
            response.setHeader("Access-Control-Allow-Origin", LOCALHOST_DEV_SERVER);
            response.setHeader("Vary", LOCALHOST_DEV_SERVER);
        }
    }

    public static void printJSONResponse(HttpServletResponse response, JsonObject o) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_JSON);
        try (PrintWriter out = response.getWriter()) {
            out.print(o.toString());
        }
    }
}
