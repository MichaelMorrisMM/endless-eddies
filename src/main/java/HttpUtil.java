import javax.json.Json;
import javax.json.JsonArray;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

public class HttpUtil {

    private static final String CONTENT_TYPE_MIME_JSON = "application/json";
    private static final String CONTENT_TYPE_MIME_OCTET_STREAM = "application/octet-stream";

    public static void doGetSetup(HttpServletResponse response) {
    }

    public static void doPostSetup(HttpServletResponse response) {
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
        printJSONResponse(response, Json.createObjectBuilder()
            .add("success", result)
            .add("message", message)
            .build());
    }

    public static void printPOSTResult(HttpServletResponse response, String requestName, boolean result, String message) throws IOException {
        printJSONResponse(response, Json.createObjectBuilder()
            .add("requestName", requestName)
            .add("success", result)
            .add("message", message)
            .build());
    }

    public static void downloadFile(HttpServletResponse response, File file) throws IOException {
        response.setContentType(CONTENT_TYPE_MIME_OCTET_STREAM);
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

}
